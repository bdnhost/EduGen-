import json
import random
from pathlib import Path
from datetime import datetime, timedelta

BASE = Path(__file__).parent
JSON_FILE = BASE / "course_digital_literacy.json"
ENHANCED_JSON_FILE = BASE / "course_digital_literacy_enhanced.json"

# סוגי מטלות (3 מטלות מכל סוג לכל מפגש)
ASSIGNMENT_TYPES = ["exercise", "assignment", "project"]

# תבניות מטלות לפי סוג
EXERCISE_TEMPLATES = [
    {
        "title": "תרגיל מבוא",
        "description": "תרגיל בסיסי להכרות עם הנושא",
        "files": ["instructions.md", "starter_code.py"],
    },
    {
        "title": "תרגיל אתגר",
        "description": "תרגיל מאתגר עם יישום מעשי",
        "files": ["instructions.md", "solution_template.py"],
    },
    {
        "title": "תרגיל תכנון",
        "description": "תרגיל תכנון וארכיטקטורה",
        "files": ["instructions.md", "design_diagram.svg"],
    },
]

ASSIGNMENT_TEMPLATES = [
    {
        "title": "משימה אישית",
        "description": "משימה עצמאית ליישום הנלמד",
        "files": ["task_description.md", "submission_template.md"],
    },
    {
        "title": "משימה קבוצתית",
        "description": "משימה לשיתוף פעולה בצוות",
        "files": ["team_guidelines.md", "collaboration_template.md"],
    },
    {
        "title": "משימה מחקרית",
        "description": "משימה הדורשת מחקר ולימוד עצמי",
        "files": ["research_questions.md", "report_template.md"],
    },
]

PROJECT_TEMPLATES = [
    {
        "title": "פרויקט קטן",
        "description": "פרויקט קטן ליישום מיידי",
        "files": ["project_brief.md", "requirements.json"],
    },
    {
        "title": "פרויקט ביניים",
        "description": "פרויקט ביניים עם מספר שלבים",
        "files": ["milestones.md", "project_plan.md"],
    },
    {
        "title": "פרויקט גמר",
        "description": "פרויקט סיכום מקיף",
        "files": ["final_requirements.md", "presentation_template.pptx"],
    },
]


def create_assignments_for_session(session_id, session_title):
    """יצירת 3 מטלות (אחת מכל סוג) עבור מפגש"""
    assignments = []
    base_id = f"{session_id}_"

    # תרגיל אחד (exercise) - רק התרגיל הראשון
    assignments.append(
        {
            "id": f"{base_id}ex1",
            "type": "exercise",
            "title": f"{session_title} - תרגיל בסיסי",
            "description": "תרגיל בסיסי להכרות עם הנושא",
            "files": ["instructions.md", "starter_code.py"],
            "due_in_days": 7,
            "weight": 5,
            "points": 10,
        }
    )

    # משימה אחת (assignment) - רק המשימה הראשונה
    assignments.append(
        {
            "id": f"{base_id}as1",
            "type": "assignment",
            "title": f"{session_title} - משימה אישית",
            "description": "משימה עצמאית ליישום הנלמד",
            "files": ["task_description.md", "submission_template.md"],
            "due_in_days": 14,
            "weight": 15,
            "points": 30,
        }
    )

    # פרויקט אחד (project) - רק הפרויקט הראשון
    assignments.append(
        {
            "id": f"{base_id}pr1",
            "type": "project",
            "title": f"{session_title} - פרויקט מעשי",
            "description": "פרויקט מעשי ליישום הנלמד",
            "files": ["project_brief.md", "requirements.json"],
            "due_in_days": 21,
            "weight": 25,
            "points": 50,
        }
    )

    return assignments


def create_diagrams_for_session(session_id, session_title):
    """יצירת דיאגרמות וגרפיקה עבור מפגש"""
    diagrams = []

    diagram_types = [
        {
            "type": "flowchart",
            "title": "תרשים זרימה",
            "file": f"{session_id}_flowchart.svg",
            "description": "תרשים זרימה של התהליכים במפגש",
        },
        {
            "type": "architecture",
            "title": "תרשים ארכיטקטורה",
            "file": f"{session_id}_architecture.svg",
            "description": "תרשים ארכיטקטורה של המערכת",
        },
        {
            "type": "timeline",
            "title": "ציר זמן",
            "file": f"{session_id}_timeline.svg",
            "description": "ציר זמן של השלבים במפגש",
        },
    ]

    for diagram in diagram_types:
        diagrams.append(
            {
                "id": f"{session_id}_{diagram['type']}",
                "type": diagram["type"],
                "title": f"{session_title} - {diagram['title']}",
                "description": diagram["description"],
                "file": diagram["file"],
                "format": "SVG",
            }
        )

    return diagrams


def enhance_course_structure():
    """שיפור מבנה הקורס עם מטלות מובנות וגרפיקה"""
    print("טוען קורס בסיסי...")
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        course = json.load(f)

    print("מוסיף מטלות מובנות לכל מפגש...")
    all_assignments = []
    all_diagrams = []

    for session in course["sessions"]:
        session_id = session["temp_id"]  # שימוש ב-temp_id במקום id
        session_title = session["title"]

        # יצירת מטלות למפגש
        session_assignments = create_assignments_for_session(session_id, session_title)
        all_assignments.extend(session_assignments)

        # יצירת דיאגרמות למפגש
        session_diagrams = create_diagrams_for_session(session_id, session_title)
        all_diagrams.extend(session_diagrams)

        # הוספת קישורים למפגש
        if "resources" not in session:
            session["resources"] = {}

        session["resources"]["assignments"] = [a["id"] for a in session_assignments]
        session["resources"]["diagrams"] = [d["id"] for d in session_diagrams]

    # הוספת מטלות מובנות לקורס
    course["structured_assignments"] = all_assignments
    course["diagrams"] = all_diagrams

    # הוספת קטגוריות מטלות
    course["assignment_categories"] = [
        {
            "id": "exercises",
            "name": "תרגילים",
            "description": "תרגילים קצרים ליישום מיידי",
            "count": len([a for a in all_assignments if a["type"] == "exercise"]),
        },
        {
            "id": "assignments",
            "name": "משימות",
            "description": "משימות מקיפות יותר",
            "count": len([a for a in all_assignments if a["type"] == "assignment"]),
        },
        {
            "id": "projects",
            "name": "פרויקטים",
            "description": "פרויקטים ארוכי טווח",
            "count": len([a for a in all_assignments if a["type"] == "project"]),
        },
    ]

    # הוספת סטטיסטיקות
    course["statistics"] = {
        "total_sessions": len(course["sessions"]),
        "total_assignments": len(all_assignments),
        "assignments_per_session": len(all_assignments) // len(course["sessions"]),
        "total_diagrams": len(all_diagrams),
        "diagrams_per_session": len(all_diagrams) // len(course["sessions"]),
        "assignment_types": {
            "exercises": len([a for a in all_assignments if a["type"] == "exercise"]),
            "assignments": len(
                [a for a in all_assignments if a["type"] == "assignment"]
            ),
            "projects": len([a for a in all_assignments if a["type"] == "project"]),
        },
    }

    print("שומר קורס משופר...")
    with open(ENHANCED_JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(course, f, ensure_ascii=False, indent=2)

    return course


def create_assignment_files():
    """יצירת קבצים למטלות"""
    assignments_dir = BASE / "assignments"
    assignments_dir.mkdir(exist_ok=True)

    diagrams_dir = BASE / "diagrams"
    diagrams_dir.mkdir(exist_ok=True)

    with open(ENHANCED_JSON_FILE, "r", encoding="utf-8") as f:
        course = json.load(f)

    files_created = []

    # יצירת קבצים למטלות
    for assignment in course.get("structured_assignments", []):
        assignment_dir = assignments_dir / assignment["id"]
        assignment_dir.mkdir(exist_ok=True)

        for file_name in assignment["files"]:
            file_path = assignment_dir / file_name

            if file_name.endswith(".md"):
                content = f"""# {assignment['title']}

## תיאור
{assignment['description']}

## פרטים טכניים
- **מזהה מטלה:** {assignment['id']}
- **סוג:** {assignment['type']}
- **ניקוד:** {assignment['points']} נקודות
- **משקל:** {assignment['weight']}%
- **מועד הגשה:** {assignment['due_in_days']} ימים מהמפגש

## הוראות
1. קראו בעיון את ההוראות
2. השלימו את המשימה לפי הדרישות
3. הגישו את הקבצים הנדרשים

## הערכה
המטלה תעריך לפי:
- דיוק הביצוע
- איכות הקוד/התוכן
- עמידה בדדליין

---
נוצר ב: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
            elif file_name.endswith(".py"):
                content = f"""# קוד התחלתי עבור: {assignment['title']}
# {assignment['description']}

import json
import os

def main():
    print("התחלת עבודה על המטלה: {assignment['title']}")
    # הוסף כאן את הקוד שלך
    
if __name__ == "__main__":
    main()
"""
            elif file_name.endswith(".json"):
                content = json.dumps(
                    {
                        "assignment_id": assignment["id"],
                        "title": assignment["title"],
                        "type": assignment["type"],
                        "requirements": [
                            "דרישה 1: השלם את המשימה לפי ההוראות",
                            "דרישה 2: ודא שהקוד רץ ללא שגיאות",
                            "דרישה 3: הגש את כל הקבצים הנדרשים",
                        ],
                        "created": datetime.now().isoformat(),
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            else:
                content = f"קובץ: {file_name}\nלמטלה: {assignment['title']}\nנוצר: {datetime.now().isoformat()}"

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            files_created.append(file_path)

    # יצירת דיאגרמות SVG דמה
    for diagram in course.get("diagrams", []):
        diagram_path = diagrams_dir / diagram["file"]

        # יצירת SVG בסיסי
        svg_content = f"""<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">
        דיאגרמה: {diagram['title']}
    </text>
    <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        {diagram['description']}
    </text>
    <text x="50%" y="70%" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">
        מזהה: {diagram['id']} | סוג: {diagram['type']}
    </text>
</svg>"""

        with open(diagram_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        files_created.append(diagram_path)

    return files_created


def main():
    print("שיפור מבנה הקורס הדיגיטלי...")
    print("=" * 50)

    # שלב 1: שיפור מבנה ה-JSON
    course = enhance_course_structure()

    # שלב 2: יצירת קבצים
    print("\nיוצר קבצים למטלות ודיאגרמות...")
    files_created = create_assignment_files()

    # הדפסת סיכום
    print("\n" + "=" * 50)
    print("סיכום יצירה:")
    print(f"• קורס משופר נשמר ב: {ENHANCED_JSON_FILE}")
    print(f"• מספר מפגשים: {len(course['sessions'])}")
    print(f"• מספר מטלות מובנות: {len(course['structured_assignments'])}")
    print(f"• מספר דיאגרמות: {len(course['diagrams'])}")
    print(f"• קבצים שנוצרו: {len(files_created)}")

    # הדפסת התפלגות מטלות
    print("\nהתפלגות מטלות לפי סוג:")
    for category in course["assignment_categories"]:
        print(f"  • {category['name']}: {category['count']} מטלות")

    print("\nקבצים לדוגמה שנוצרו:")
    for i, file in enumerate(files_created[:5], 1):
        print(f"  {i}. {file.relative_to(BASE)}")
    if len(files_created) > 5:
        print(f"  ... ועוד {len(files_created) - 5} קבצים")

    print(
        "\nהמערכת מוכנה! ניתן להריץ את create_course_assets_enhanced.py עם הקובץ המשופר."
    )
    print("=" * 50)


if __name__ == "__main__":
    main()
