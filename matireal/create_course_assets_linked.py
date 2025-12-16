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

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Paths
BASE = Path(__file__).parent
JSON_FILE = BASE / "course_iot_masterpiece.json"
MD_FILE = BASE / "course_iot_masterpiece.md"
OUT_PDF = BASE / "course_iot_syllabus.pdf"
OUT_PPTX = BASE / "course_iot_master_slides.pptx"
LINKS_JSON = BASE / "course_iot_links.json"
MANIFEST_JSON = BASE / "course_manifest.json"

# Base URL for LMS (can be configured via environment or parameter)
BASE_URL = "https://edu-manage.org/courses/iot-master-2025/assets"

# Font configuration - using Helvetica which maps to Arial on Windows and supports Hebrew
HEBREW_FONT = "Helvetica"
HEBREW_FONT_BOLD = "Helvetica-Bold"


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
    """Draw Hebrew text with proper shaping."""
    display_text = reshape_hebrew(text)
    try:
        canvas_obj.setFont(font_name, font_size)
    except Exception:
        # Fallback to regular font if bold not available
        if "-Bold" in font_name:
            canvas_obj.setFont(HEBREW_FONT, font_size)
            canvas_obj.setFillColorRGB(0, 0, 0)  # Ensure black
        else:
            raise
    canvas_obj.drawString(x, y, display_text)


def make_syllabus_pdf(course, md_text, out_path):
    """Generate main syllabus PDF."""
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

        # Metadata
        c.setFont(HEBREW_FONT, 10)
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
            c.setFont(HEBREW_FONT, 11)
            for chunk in split_text(desc, 90):
                draw_hebrew_string(c, x, y, chunk, HEBREW_FONT, 11)
                y -= 0.5 * cm

        y -= 0.6 * cm
        draw_hebrew_string(c, x, y, "Sessions (Overview)", HEBREW_FONT_BOLD, 12)
        y -= 0.8 * cm

        c.setFont(HEBREW_FONT, 10)
        sessions = course.get("sessions", [])
        for s in sessions:
            title = f"{s.get('id', '')} - {s.get('title', '')}"
            draw_hebrew_string(c, x, y, title, HEBREW_FONT, 10)
            y -= 0.5 * cm

            objs = s.get("objectives", [])
            if isinstance(objs, list):
                for obj in objs:
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
                c.setFont(HEBREW_FONT, 10)

        c.save()
        logger.info(f"Syllabus PDF created: {out_path}")
        return str(out_path.relative_to(BASE))
    except Exception as e:
        logger.error(f"Failed to create syllabus PDF: {e}")
        raise


def make_session_pdfs(course, out_dir):
    """Generate individual session PDFs."""
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

            # Description
            draw_hebrew_string(c, x, y, "Description:", HEBREW_FONT_BOLD, 12)
            y -= 0.6 * cm
            c.setFont(HEBREW_FONT, 10)
            desc = s.get("description", "")
            if desc:
                for line in split_text(desc, 90):
                    draw_hebrew_string(c, x, y, line, HEBREW_FONT, 10)
                    y -= 0.45 * cm
                    if y < 4 * cm:
                        c.showPage()
                        y = height - margin

            y -= 0.4 * cm
            draw_hebrew_string(c, x, y, "Objectives:", HEBREW_FONT_BOLD, 12)
            y -= 0.6 * cm
            c.setFont(HEBREW_FONT, 10)
            objs = s.get("objectives", [])
            if isinstance(objs, list):
                for obj in objs:
                    for line in split_text("- " + obj, 90):
                        draw_hebrew_string(c, x + 0.6 * cm, y, line, HEBREW_FONT, 10)
                        y -= 0.45 * cm
                        if y < 4 * cm:
                            c.showPage()
                            y = height - margin
            else:
                for line in split_text(str(objs), 90):
                    draw_hebrew_string(c, x + 0.6 * cm, y, line, HEBREW_FONT, 10)
                    y -= 0.45 * cm

            c.save()
            rel_path = str(fname.relative_to(BASE))
            session_links[sid] = {
                "title": s.get("title"),
                "pdf_path": rel_path,
                "pdf_url": f"{BASE_URL}/{rel_path.replace('\\', '/')}",
                "session_id": sid,
            }
            logger.debug(f"Created session PDF: {fname}")
        except Exception as e:
            logger.error(
                f"Failed to create PDF for session {s.get('id', 'unknown')}: {e}"
            )

    logger.info(f"Created {len(sessions)} session PDFs in {out_dir}")
    return session_links


def make_pptx(course, out_path):
    """Generate PowerPoint presentation."""
    try:
        prs = Presentation()

        # Title slide
        slide_layout = prs.slide_layouts[0]
        slide = prs.slides.add_slide(slide_layout)
        title = slide.shapes.title
        subtitle = slide.placeholders[1]

        course_data = course.get("course", {})
        title.text = course_data.get("name", "Course")
        subtitle.text = f"{course_data.get('code', '')} — Masterpiece syllabus"

        # Session slides
        sessions = course.get("sessions", [])
        for s in sessions:
            slide_layout = prs.slide_layouts[1]
            slide = prs.slides.add_slide(slide_layout)
            slide.shapes.title.text = s.get("title", "")

            body = slide.shapes.placeholders[1].text_frame
            body.text = ""
            objs = s.get("objectives", [])

            if isinstance(objs, list):
                for i, obj in enumerate(objs):
                    p = body.add_paragraph() if i > 0 else body.paragraphs[0]
                    p.text = f"- {obj}"
                    p.level = 0
            else:
                body.text = str(objs)

        # Project slide (if assignments exist)
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
                p.text = f"{k}: {v}"
                p.level = 1

        prs.save(str(out_path))
        logger.info(f"PPTX created: {out_path}")
        return str(out_path.relative_to(BASE))
    except Exception as e:
        logger.error(f"Failed to create PPTX: {e}")
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
    """Create a manifest with pedagogical links for LMS integration."""
    course_data = course.get("course", {})
    sessions = course.get("sessions", [])
    assignments = course.get("assignments", [])

    manifest = {
        "course": {
            "id": course_data.get("code"),
            "name": course_data.get("name"),
            "description": course_data.get("description"),
            "syllabus_pdf": {
                "path": syllabus_pdf_path,
                "url": f"{BASE_URL}/{syllabus_pdf_path.replace('\\', '/')}",
                "purpose": "Main course syllabus document",
                "pedagogical_role": "Overview of course structure, sessions, and objectives",
            },
            "slides": {
                "path": pptx_path,
                "url": f"{BASE_URL}/{pptx_path.replace('\\', '/')}",
                "purpose": "Presentation slides for classroom instruction",
                "pedagogical_role": "Visual support for lectures and discussions",
            },
        },
        "sessions": [],
        "assignments": [],
    }

    # Add session links
    for s in sessions:
        sid = s.get("id")
        if sid in session_links:
            link_info = session_links[sid]
            manifest["sessions"].append({
                "id": sid,
                "title": s.get("title"),
                "objectives": s.get("objectives", []),
                "duration_hours": s.get("duration_hours"),
                "resources": {
                    "session_outline_pdf": {
                        "path": link_info["pdf_path"],
                        "url": link_info["pdf_url"],
                        "purpose": "Detailed outline for this specific session",
                        "pedagogical_role": "Guide for instructors and reference for students",
                    }
                },
                "pedagogical_sequence": f"Session {sid} of {len(sessions)}",
            })
        else:
            manifest["sessions"].append({
                "id": sid,
                "title": s.get("title"),
                "resources": {"session_outline_pdf": None},
            })

    # Add assignment links
    for a in assignments:
        aid = a.get("id")
        manifest["assignments"].append({
            "id": aid,
            "title": a.get("title"),
            "description": a.get("description"),
            "session_id": a.get("session_id"),
            "due_in_weeks": a.get("due_in_weeks"),
            "weight": a.get("weight"),
            "rubric": a.get("rubric", {}),
            "resources": {
                "related_slides": {
                    "url": f"{BASE_URL}/{pptx_path.replace('\\', '/')}",
                    "reference": "See project slide in presentation",
                }
            },
            "pedagogical_note": "Final project integrates concepts from all sessions",
        })

    # Write manifest file
    with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    logger.info(f"Pedagogical manifest created: {MANIFEST_JSON}")

    # Also create a simpler links file for direct URL mapping
    simple_links = {
        "syllabus_pdf": f"{BASE_URL}/{syllabus_pdf_path.replace('\\', '/')}",
        "slides_pptx": f"{BASE_URL}/{pptx_path.replace('\\', '/')}",
        "session_pdfs": {
            sid: {
                "title": session_links[sid]["title"],
                "url": session_links[sid]["pdf_url"],
            }
            for sid in session_links
        },
    }
    with open(LINKS_JSON, "w", encoding="utf-8") as f:
        json.dump(simple_links, f, ensure_ascii=False, indent=2)
    logger.info(f"Simple links file created: {LINKS_JSON}")

    return manifest


def main():
    """Main function with pedagogical linking."""
    try:
        logger.info("Loading course data...")
        course = load_json(JSON_FILE)
        validate_course_data(course)

        md = load_md(MD_FILE)

        logger.info("Generating syllabus PDF...")
        syllabus_path = make_syllabus_pdf(course, md, OUT_PDF)

        logger.info("Generating per-session PDFs...")
        session_links = make_session_pdfs(course, BASE / "session_pdfs_linked")

        logger.info("Generating PPTX...")
        pptx_path = make_pptx(course, OUT_PPTX)

        logger.info("Creating pedagogical links manifest...")
        manifest = create_links_manifest(course, syllabus_path, session_links, pptx_path)

        logger.info("All assets and pedagogical links generated successfully!")
        logger.info(f"Syllabus PDF: {syllabus_path}")
        logger.info(f"Session PDFs: {len(session_links)} files")
        logger.info(f"Slides PPTX: {pptx_path}")
        logger.info(f"Manifest: {MANIFEST_JSON}")
        logger.info(f"Links: {LINKS_JSON}")

        # Print summary for easy copy-paste
        print("\n" + "="*60)
        print("PEDAGOGICAL ASSETS SUMMARY")
        print("="*60)
        print(f"Course: {course['course']['name']}")
        print(f"Code: {course['course']['code']}")
        print(f"Syllabus: {BASE_URL}/{syllabus_path.replace('\\', '/')}")
        print(f"Slides: {BASE_URL}/{pptx_path.replace('\\', '/')}")
        print("\nSession PDFs:")
        for sid, info in session_links.items():
            print(f"  {sid}: {info['pdf_url']}")
        print(f"\nManifest JSON: {MANIFEST_JSON}")
        print("="*60)

    except Exception as e:
        logger.error(f"Script failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
