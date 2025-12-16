import json
import sys
import logging
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from pptx import Presentation
from pptx.util import Pt
import arabic_reshaper
from bidi.algorithm import get_display
import shutil

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Paths
BASE = Path(__file__).parent
JSON_FILE = BASE / "course_iot_enhanced.json"  # Using enhanced JSON
MD_FILE = BASE / "course_iot_masterpiece.md"
OUT_PDF = BASE / "course_iot_syllabus_enhanced.pdf"
OUT_PPTX = BASE / "course_iot_master_slides_enhanced.pptx"
LINKS_JSON = BASE / "course_iot_links_enhanced.json"
MANIFEST_JSON = BASE / "course_manifest_enhanced.json"

# Local paths only - no web URLs for local use
ASSIGNMENTS_DIR = BASE / "assignments"
DIAGRAMS_DIR = BASE / "diagrams"
SESSION_PDFS_DIR = BASE / "session_pdfs_enhanced"

# Font configuration - try Hebrew fonts in order of preference
# List of Hebrew fonts to try (Windows fonts that support Hebrew)
HEBREW_FONTS = [
    "Arial Unicode MS",  # Best Unicode support
    "David",  # Common Hebrew font on Windows
    "Miriam",  # Another Windows Hebrew font
    "Gisha",  # Hebrew font for UI
    "Arial",  # Arial often has Hebrew glyphs
    "Times New Roman",  # May have Hebrew
    "Helvetica",  # Fallback PDF standard
]

HEBREW_FONT_BOLD = "Helvetica-Bold"  # Will be handled in draw_hebrew_string


def reshape_hebrew(text):
    """Convert Hebrew text to proper visual order."""
    if not text:
        return ""
    try:
        reshaped = arabic_reshaper.reshape(text)
        return get_display(reshaped)
    except Exception as e:
        logger.warning(f"Failed to reshape Hebrew text '{text[:50]}...': {e}")
        return text


def get_available_hebrew_font():
    """Try to find an available Hebrew font from the list."""
    for font_name in HEBREW_FONTS:
        try:
            # Test if font is available by trying to create a temporary canvas
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import A4
            import tempfile
            import os

            temp_file = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
            c = canvas.Canvas(temp_file.name, pagesize=A4)
            c.setFont(font_name, 10)
            c.drawString(10, 10, "test")
            c.save()
            temp_file.close()
            os.unlink(temp_file.name)
            logger.info(f"Found available Hebrew font: {font_name}")
            return font_name
        except Exception:
            continue

    logger.warning("No Hebrew font found, using Helvetica as fallback")
    return "Helvetica"


# Get the best available Hebrew font at module load time
BEST_HEBREW_FONT = get_available_hebrew_font()
HEBREW_FONT = BEST_HEBREW_FONT


def load_json(path):
    """Load JSON file with error handling."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"JSON file not found: {path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {path}: {e}")
        sys.exit(1)


def load_md(path):
    """Load markdown file."""
    if not path.exists():
        logger.warning(f"Markdown file not found: {path}")
        return ""
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        logger.error(f"Failed to read {path}: {e}")
        return ""


def split_text(text, width):
    """Split text into lines of max width, breaking long words if needed."""
    words = text.split()
    lines = []
    cur_line = []
    cur_len = 0

    for word in words:
        # If word itself exceeds width, break it
        if len(word) > width:
            for i in range(0, len(word), width - 1):
                part = word[i : i + width - 1] + "-"
                if cur_len + len(part) + 1 > width:
                    lines.append(" ".join(cur_line))
                    cur_line = [part]
                    cur_len = len(part)
                else:
                    cur_line.append(part)
                    cur_len += len(part) + 1
        else:
            if cur_len + len(word) + (1 if cur_line else 0) > width:
                lines.append(" ".join(cur_line))
                cur_line = [word]
                cur_len = len(word)
            else:
                cur_line.append(word)
                cur_len += len(word) + (1 if cur_line else 0)

    if cur_line:
        lines.append(" ".join(cur_line))
    return lines


def draw_hebrew_string(canvas_obj, x, y, text, font_name, font_size):
    """Draw Hebrew text with proper shaping using available Hebrew fonts."""
    display_text = reshape_hebrew(text)

    # Try to use bold version if requested
    is_bold = "-Bold" in font_name

    # Try multiple fonts in order of preference
    fonts_to_try = []
    if is_bold:
        # Try bold versions first
        for base_font in HEBREW_FONTS:
            fonts_to_try.append(f"{base_font}-Bold")
            fonts_to_try.append(f"{base_font}")
    else:
        fonts_to_try = HEBREW_FONTS.copy()

    # Always include Helvetica as final fallback
    if is_bold:
        fonts_to_try.append("Helvetica-Bold")
    fonts_to_try.append("Helvetica")

    last_error = None
    for font in fonts_to_try:
        try:
            canvas_obj.setFont(font, font_size)
            canvas_obj.drawString(x, y, display_text)
            return  # Success
        except Exception as e:
            last_error = e
            continue

    # If all fonts failed, try one more time with Helvetica and hope for the best
    try:
        if is_bold:
            canvas_obj.setFont("Helvetica-Bold", font_size)
        else:
            canvas_obj.setFont("Helvetica", font_size)
        canvas_obj.drawString(x, y, display_text)
        logger.warning(f"Used Helvetica fallback for Hebrew text after font errors")
    except Exception as e:
        logger.error(f"All font attempts failed for Hebrew text: {last_error}")
        raise


def make_syllabus_pdf(course, md_text, out_path):
    """Generate main syllabus PDF with assignments and diagrams."""
    try:
        c = canvas.Canvas(str(out_path), pagesize=A4)
        width, height = A4
        margin = 2 * cm
        x = margin
        y = height - margin

        # Course title
        course_data = course.get("course", {})
        course_name = course_data.get("name", "Course")
        draw_hebrew_string(c, x, y, course_name, HEBREW_FONT_BOLD, 18)
        y -= 1.2 * cm

        # Metadata - use best available Hebrew font
        c.setFont(BEST_HEBREW_FONT, 10)
        meta_lines = [
            f"Code: {course_data.get('code', '')}",
            f"Start: {course_data.get('start_date', '')}",
            f"Sessions: {course_data.get('total_sessions', '')}",
            f"Hours: {course_data.get('total_hours', '')}",
            f"Density: {course_data.get('density', 'medium')}",
        ]
        for line in meta_lines:
            c.drawString(x, y, line)
            y -= 0.6 * cm

        y -= 0.4 * cm
        # Description
        desc = course_data.get("description") or (
            md_text.split("\n")[0] if md_text else ""
        )
        if desc:
            c.setFont(BEST_HEBREW_FONT, 11)
            for chunk in split_text(desc, 90):
                draw_hebrew_string(c, x, y, chunk, HEBREW_FONT, 11)
                y -= 0.5 * cm

        # Course statistics from enhanced JSON
        stats = course.get("statistics", {})
        if stats:
            y -= 0.6 * cm
            draw_hebrew_string(c, x, y, "Course Statistics:", HEBREW_FONT_BOLD, 12)
            y -= 0.6 * cm
            c.setFont(BEST_HEBREW_FONT, 10)
            stat_lines = [
                f"Total Assignments: {stats.get('total_assignments', 0)}",
                f"Assignments per Session: {stats.get('assignments_per_session', 0)}",
                f"Total Diagrams: {stats.get('total_diagrams', 0)}",
                f"Diagrams per Session: {stats.get('diagrams_per_session', 0)}",
            ]
            for line in stat_lines:
                c.drawString(x, y, line)
                y -= 0.5 * cm

        y -= 0.6 * cm
        draw_hebrew_string(c, x, y, "Sessions (Overview)", HEBREW_FONT_BOLD, 12)
        y -= 0.8 * cm

        c.setFont(BEST_HEBREW_FONT, 10)
        sessions = course.get("sessions", [])
        for s in sessions:
            title = f"{s.get('id', '')} - {s.get('title', '')}"
            draw_hebrew_string(c, x, y, title, HEBREW_FONT, 10)
            y -= 0.4 * cm

            # Show resources for this session
            resources = s.get("resources", {})
            if resources:
                c.setFont(BEST_HEBREW_FONT, 9)
                assignments_count = len(resources.get("assignments", []))
                diagrams_count = len(resources.get("diagrams", []))
                resources_text = f"Resources: {assignments_count} assignments, {diagrams_count} diagrams"
                draw_hebrew_string(c, x + 0.5 * cm, y, resources_text, HEBREW_FONT, 9)
                y -= 0.4 * cm

            objs = s.get("objectives", [])
            if isinstance(objs, list):
                for obj in objs[:3]:  # Show only first 3 objectives
                    for line in split_text("- " + obj, 80):
                        draw_hebrew_string(c, x + 0.6 * cm, y, line, HEBREW_FONT, 10)
                        y -= 0.45 * cm
            else:
                for line in split_text(str(objs), 80):
                    draw_hebrew_string(c, x + 0.6 * cm, y, line, HEBREW_FONT, 10)
                    y -= 0.45 * cm

            y -= 0.3 * cm
            if y < 4 * cm:
                c.showPage()
                y = height - margin
                c.setFont(BEST_HEBREW_FONT, 10)

        # Add assignment categories page
        c.showPage()
        y = height - margin
        draw_hebrew_string(c, x, y, "Assignment Categories", HEBREW_FONT_BOLD, 14)
        y -= 1 * cm

        categories = course.get("assignment_categories", [])
        for cat in categories:
            draw_hebrew_string(
                c, x, y, f"{cat['name']} ({cat['count']})", HEBREW_FONT_BOLD, 12
            )
            y -= 0.6 * cm
            c.setFont(BEST_HEBREW_FONT, 10)
            for line in split_text(cat["description"], 90):
                draw_hebrew_string(c, x + 0.5 * cm, y, line, HEBREW_FONT, 10)
                y -= 0.45 * cm
            y -= 0.3 * cm

        c.save()
        logger.info(f"Enhanced syllabus PDF created: {out_path}")
        return str(out_path.relative_to(BASE))
    except Exception as e:
        logger.error(f"Failed to create enhanced syllabus PDF: {e}")
        raise


def make_session_pdfs(course, out_dir):
    """Generate individual session PDFs with assignments and diagrams."""
    out_dir.mkdir(parents=True, exist_ok=True)
    sessions = course.get("sessions", [])
    session_links = {}

    for s in sessions:
        try:
            sid = s.get("id") or s.get("temp_id") or "s?"
            fname = out_dir / f"session_{sid}_outline.pdf"
            c = canvas.Canvas(str(fname), pagesize=A4)
            width, height = A4
            margin = 2 * cm
            x = margin
            y = height - margin

            # Session title
            title = s.get("title", "Session")
            draw_hebrew_string(c, x, y, title, HEBREW_FONT_BOLD, 16)
            y -= 1 * cm

            # Duration
            c.setFont(BEST_HEBREW_FONT, 10)
            duration = s.get("duration_hours", "")
            if duration:
                draw_hebrew_string(
                    c, x, y, f"Duration: {duration} hours", HEBREW_FONT, 10
                )
                y -= 0.6 * cm

            # Description
            draw_hebrew_string(c, x, y, "Description:", HEBREW_FONT_BOLD, 12)
            y -= 0.6 * cm
            c.setFont(BEST_HEBREW_FONT, 10)
            desc = s.get("description", "")
            if desc:
                for line in split_text(desc, 90):
                    draw_hebrew_string(c, x, y, line, HEBREW_FONT, 10)
                    y -= 0.45 * cm
                    if y < 8 * cm:
                        c.showPage()
                        y = height - margin

            # Objectives
            y -= 0.4 * cm
            draw_hebrew_string(c, x, y, "Objectives:", HEBREW_FONT_BOLD, 12)
            y -= 0.6 * cm
            c.setFont(BEST_HEBREW_FONT, 10)
            objs = s.get("objectives", [])
            if isinstance(objs, list):
                for obj in objs:
                    for line in split_text("- " + obj, 90):
                        draw_hebrew_string(c, x + 0.6 * cm, y, line, HEBREW_FONT, 10)
                        y -= 0.45 * cm
                        if y < 8 * cm:
                            c.showPage()
                            y = height - margin
            else:
                for line in split_text(str(objs), 90):
                    draw_hebrew_string(c, x + 0.6 * cm, y, line, HEBREW_FONT, 10)
                    y -= 0.45 * cm
                    if y < 8 * cm:
                        c.showPage()
                        y = height - margin

            # Resources section
            resources = s.get("resources", {})
            if resources:
                y -= 0.4 * cm
                if y < 8 * cm:
                    c.showPage()
                    y = height - margin

                draw_hebrew_string(c, x, y, "Session Resources:", HEBREW_FONT_BOLD, 12)
                y -= 0.6 * cm
                c.setFont(BEST_HEBREW_FONT, 10)

                # Assignments
                assignments = resources.get("assignments", [])
                if assignments:
                    draw_hebrew_string(c, x, y, "Assignments:", HEBREW_FONT_BOLD, 11)
                    y -= 0.5 * cm
                    c.setFont(BEST_HEBREW_FONT, 10)

                    # Get assignment details from structured_assignments
                    structured_assignments = course.get("structured_assignments", [])
                    session_assignments = [
                        a for a in structured_assignments if a["id"] in assignments
                    ]

                    for i, assign in enumerate(session_assignments[:3]):  # Show first 3
                        assign_text = f"{i+1}. {assign['title']} ({assign['type']})"
                        for line in split_text(assign_text, 85):
                            draw_hebrew_string(
                                c, x + 0.5 * cm, y, line, HEBREW_FONT, 10
                            )
                            y -= 0.4 * cm
                        y -= 0.2 * cm
                        if y < 8 * cm:
                            c.showPage()
                            y = height - margin

                # Diagrams
                diagrams = resources.get("diagrams", [])
                if diagrams:
                    y -= 0.3 * cm
                    if y < 8 * cm:
                        c.showPage()
                        y = height - margin

                    draw_hebrew_string(c, x, y, "Diagrams:", HEBREW_FONT_BOLD, 11)
                    y -= 0.5 * cm
                    c.setFont(BEST_HEBREW_FONT, 10)

                    all_diagrams = course.get("diagrams", [])
                    session_diagrams = [d for d in all_diagrams if d["id"] in diagrams]

                    for i, diagram in enumerate(session_diagrams):
                        diagram_text = f"{i+1}. {diagram['title']} ({diagram['type']})"
                        for line in split_text(diagram_text, 85):
                            draw_hebrew_string(
                                c, x + 0.5 * cm, y, line, HEBREW_FONT, 10
                            )
                            y -= 0.4 * cm
                        y -= 0.2 * cm
                        if y < 8 * cm:
                            c.showPage()
                            y = height - margin

            c.save()
            rel_path = str(fname.relative_to(BASE))
            session_links[sid] = {
                "title": s.get("title"),
                "pdf_path": rel_path,
                "session_id": sid,
                "assignments_count": len(resources.get("assignments", [])),
                "diagrams_count": len(resources.get("diagrams", [])),
            }
            logger.debug(f"Created enhanced session PDF: {fname}")
        except Exception as e:
            logger.error(
                f"Failed to create enhanced PDF for session {s.get('id', 'unknown')}: {e}"
            )

    logger.info(f"Created {len(sessions)} enhanced session PDFs in {out_dir}")
    return session_links


def make_pptx(course, out_path):
    """Generate PowerPoint presentation with assignments and diagrams."""
    try:
        prs = Presentation()

        # Title slide
        slide_layout = prs.slide_layouts[0]
        slide = prs.slides.add_slide(slide_layout)
        title = slide.shapes.title
        subtitle = slide.placeholders[1]

        course_data = course.get("course", {})
        title.text = course_data.get("name", "Course")
        subtitle.text = f"{course_data.get('code', '')} — Enhanced Masterpiece syllabus"

        # Statistics slide
        slide_layout = prs.slide_layouts[1]
        slide = prs.slides.add_slide(slide_layout)
        slide.shapes.title.text = "Course Statistics"

        stats = course.get("statistics", {})
        body = slide.shapes.placeholders[1].text_frame
        body.text = ""

        if stats:
            stats_text = [
                f"Total Sessions: {stats.get('total_sessions', 0)}",
                f"Total Assignments: {stats.get('total_assignments', 0)}",
                f"Assignments per Session: {stats.get('assignments_per_session', 0)}",
                f"Total Diagrams: {stats.get('total_diagrams', 0)}",
                f"Diagrams per Session: {stats.get('diagrams_per_session', 0)}",
            ]
            for i, line in enumerate(stats_text):
                p = body.add_paragraph() if i > 0 else body.paragraphs[0]
                p.text = line
                p.level = 0

        # Assignment categories slide
        slide_layout = prs.slide_layouts[1]
        slide = prs.slides.add_slide(slide_layout)
        slide.shapes.title.text = "Assignment Categories"

        body = slide.shapes.placeholders[1].text_frame
        body.text = ""

        categories = course.get("assignment_categories", [])
        for i, cat in enumerate(categories):
            p = body.add_paragraph() if i > 0 else body.paragraphs[0]
            p.text = f"{cat['name']}: {cat['count']} assignments - {cat['description']}"
            p.level = 0

        # Session slides
        sessions = course.get("sessions", [])
        for s in sessions:
            slide_layout = prs.slide_layouts[1]
            slide = prs.slides.add_slide(slide_layout)
            slide.shapes.title.text = s.get("title", "")

            body = slide.shapes.placeholders[1].text_frame
            body.text = ""

            # Add objectives
            objs = s.get("objectives", [])
            if isinstance(objs, list):
                for i, obj in enumerate(objs):
                    p = body.add_paragraph() if i > 0 else body.paragraphs[0]
                    p.text = f"- {obj}"
                    p.level = 0

            # Add resources info
            resources = s.get("resources", {})
            if resources:
                p = body.add_paragraph()
                p.text = f"Resources: {len(resources.get('assignments', []))} assignments, {len(resources.get('diagrams', []))} diagrams"
                p.level = 1

        # Final project slide
        assignments = course.get("assignments", [])
        if assignments:
            slide_layout = prs.slide_layouts[1]
            slide = prs.slides.add_slide(slide_layout)
            slide.shapes.title.text = "Final Project & Rubric"

            body = slide.shapes.placeholders[1].text_frame
            proj = assignments[0]
            body.text = proj.get("title", "Project")

            rubric = proj.get("rubric", {})
            for k, v in rubric.items():
                p = body.add_paragraph()
                p.text = f"{k}: {v} points"
                p.level = 1

        prs.save(str(out_path))
        logger.info(f"Enhanced PPTX created: {out_path}")
        return str(out_path.relative_to(BASE))
    except Exception as e:
        logger.error(f"Failed to create enhanced PPTX: {e}")
        raise


def validate_course_data(course):
    """Validate course data structure."""
    if not isinstance(course, dict):
        raise ValueError("Course data must be a dictionary")

    if "course" not in course:
        raise ValueError("Missing 'course' key in data")

    course_info = course["course"]
    required = ["name", "code"]
    for field in required:
        if field not in course_info:
            raise ValueError(f"Missing required field in course: {field}")

    if "sessions" not in course:
        logger.warning("No sessions found in course data")
        course["sessions"] = []


def create_links_manifest(course, syllabus_pdf_path, session_links, pptx_path):
    """Create a manifest with pedagogical links for local use."""
    course_data = course.get("course", {})
    sessions = course.get("sessions", [])
    assignments = course.get("assignments", [])
    structured_assignments = course.get("structured_assignments", [])
    diagrams = course.get("diagrams", [])

    manifest = {
        "course": {
            "id": course_data.get("code"),
            "name": course_data.get("name"),
            "description": course_data.get("description"),
            "syllabus_pdf": {
                "path": syllabus_pdf_path,
                "purpose": "Main course syllabus document with assignments and diagrams",
                "pedagogical_role": "Overview of course structure, sessions, objectives, and resources",
            },
            "slides": {
                "path": pptx_path,
                "purpose": "Presentation slides for classroom instruction",
                "pedagogical_role": "Visual support for lectures and discussions",
            },
            "statistics": course.get("statistics", {}),
            "assignment_categories": course.get("assignment_categories", []),
        },
        "sessions": [],
        "assignments": [],
        "structured_assignments": [],
        "diagrams": [],
        "resources": {
            "assignments_directory": str(ASSIGNMENTS_DIR.relative_to(BASE)),
            "diagrams_directory": str(DIAGRAMS_DIR.relative_to(BASE)),
            "session_pdfs_directory": str(SESSION_PDFS_DIR.relative_to(BASE)),
        },
    }

    # Add session links
    for s in sessions:
        sid = s.get("id")
        if sid in session_links:
            link_info = session_links[sid]
            manifest["sessions"].append(
                {
                    "id": sid,
                    "title": s.get("title"),
                    "objectives": s.get("objectives", []),
                    "duration_hours": s.get("duration_hours"),
                    "session_pdf": {
                        "path": link_info["pdf_path"],
                        "purpose": "Detailed outline for this specific session",
                        "pedagogical_role": "Guide for instructors and reference for students",
                    },
                    "assignments_count": link_info.get("assignments_count", 0),
                    "diagrams_count": link_info.get("diagrams_count", 0),
                    "pedagogical_sequence": f"Session {sid} of {len(sessions)}",
                }
            )
        else:
            manifest["sessions"].append(
                {
                    "id": sid,
                    "title": s.get("title"),
                    "session_pdf": None,
                }
            )

    # Add structured assignments
    for assign in structured_assignments:
        manifest["structured_assignments"].append(
            {
                "id": assign["id"],
                "type": assign["type"],
                "title": assign["title"],
                "description": assign["description"],
                "files": assign.get("files", []),
                "due_in_days": assign.get("due_in_days"),
                "weight": assign.get("weight"),
                "points": assign.get("points"),
            }
        )

    # Add diagrams
    for diagram in diagrams:
        manifest["diagrams"].append(
            {
                "id": diagram["id"],
                "type": diagram["type"],
                "title": diagram["title"],
                "description": diagram["description"],
                "file": diagram["file"],
                "format": diagram["format"],
            }
        )

    # Write manifest file
    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    logger.info(f"Enhanced pedagogical manifest created: {MANIFEST_JSON}")

    # Also create a simpler links file for local use
    simple_links = {
        "syllabus_pdf": syllabus_pdf_path,
        "slides_pptx": pptx_path,
        "session_pdfs": {
            sid: {
                "title": session_links[sid]["title"],
                "path": session_links[sid]["pdf_path"],
            }
            for sid in session_links
        },
        "directories": {
            "assignments": str(ASSIGNMENTS_DIR.relative_to(BASE)),
            "diagrams": str(DIAGRAMS_DIR.relative_to(BASE)),
            "session_pdfs": str(SESSION_PDFS_DIR.relative_to(BASE)),
        },
    }
    with open(LINKS_JSON, "w", encoding="utf-8") as f:
        json.dump(simple_links, f, ensure_ascii=False, indent=2)
    logger.info(f"Enhanced simple links file created: {LINKS_JSON}")

    return manifest


def verify_resources():
    """Verify that assignments and diagrams directories exist."""
    resources_ok = True

    if not ASSIGNMENTS_DIR.exists():
        logger.warning(f"Assignments directory not found: {ASSIGNMENTS_DIR}")
        resources_ok = False
    else:
        assignment_count = sum(1 for _ in ASSIGNMENTS_DIR.rglob("*") if _.is_file())
        logger.info(f"Found {assignment_count} assignment files in {ASSIGNMENTS_DIR}")

    if not DIAGRAMS_DIR.exists():
        logger.warning(f"Diagrams directory not found: {DIAGRAMS_DIR}")
        resources_ok = False
    else:
        diagram_count = sum(1 for _ in DIAGRAMS_DIR.rglob("*") if _.is_file())
        logger.info(f"Found {diagram_count} diagram files in {DIAGRAMS_DIR}")

    return resources_ok


def main():
    """Main function with enhanced pedagogical linking and local resources."""
    try:
        logger.info("Loading enhanced course data...")
        course = load_json(JSON_FILE)
        validate_course_data(course)

        md = load_md(MD_FILE)

        logger.info("Verifying local resources...")
        resources_ok = verify_resources()
        if not resources_ok:
            logger.warning("Some resource directories missing, but continuing...")

        logger.info("Generating enhanced syllabus PDF...")
        syllabus_path = make_syllabus_pdf(course, md, OUT_PDF)

        logger.info("Generating enhanced per-session PDFs...")
        session_links = make_session_pdfs(course, SESSION_PDFS_DIR)

        logger.info("Generating enhanced PPTX...")
        pptx_path = make_pptx(course, OUT_PPTX)

        logger.info("Creating enhanced pedagogical links manifest...")
        manifest = create_links_manifest(
            course, syllabus_path, session_links, pptx_path
        )

        # Print comprehensive summary
        print("\n" + "=" * 70)
        print("ENHANCED COURSE ASSETS - LOCAL USE ONLY")
        print("=" * 70)
        print(f"Course: {course['course']['name']}")
        print(f"Code: {course['course']['code']}")

        stats = course.get("statistics", {})
        print(f"\nCourse Statistics:")
        print(f"  • Sessions: {stats.get('total_sessions', 0)}")
        print(f"  • Total Assignments: {stats.get('total_assignments', 0)}")
        print(f"  • Assignments per Session: {stats.get('assignments_per_session', 0)}")
        print(f"  • Total Diagrams: {stats.get('total_diagrams', 0)}")
        print(f"  • Diagrams per Session: {stats.get('diagrams_per_session', 0)}")

        print(f"\nGenerated Files:")
        print(f"  • Syllabus PDF: {syllabus_path}")
        print(f"  • Slides PPTX: {pptx_path}")
        print(
            f"  • Session PDFs: {len(session_links)} files in {SESSION_PDFS_DIR.relative_to(BASE)}/"
        )

        print(f"\nLocal Resources:")
        print(
            f"  • Assignments: {ASSIGNMENTS_DIR.relative_to(BASE)}/ (3 types x 6 sessions = 18 assignments)"
        )
        print(
            f"  • Diagrams: {DIAGRAMS_DIR.relative_to(BASE)}/ (3 types x 6 sessions = 18 diagrams)"
        )

        print(f"\nAssignment Categories:")
        categories = course.get("assignment_categories", [])
        for cat in categories:
            print(f"  • {cat['name']}: {cat['count']} - {cat['description']}")

        print(f"\nManifest Files:")
        print(f"  • Detailed manifest: {MANIFEST_JSON.relative_to(BASE)}")
        print(f"  • Simple links: {LINKS_JSON.relative_to(BASE)}")

        print(f"\nSession PDFs Overview:")
        for sid, info in session_links.items():
            print(
                f"  • {sid}: {info['title'][:50]}... ({info['assignments_count']} assignments, {info['diagrams_count']} diagrams)"
            )

        print("\n" + "=" * 70)
        print("All enhanced assets generated successfully for local use!")
        print("=" * 70)

        logger.info("All enhanced assets and pedagogical links generated successfully!")

    except Exception as e:
        logger.error(f"Enhanced script failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
