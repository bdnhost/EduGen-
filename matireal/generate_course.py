# c:\Users\User\Desktop\matireal\generate_course.py

import random
import argparse
import json
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re
import urllib.parse
import deepseek


def analyze_guide(html_path):
    """Parses the guide's HTML to extract pedagogical content."""
    try:
        with open(html_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
    except FileNotFoundError:
        raise FileNotFoundError(f"Guide file not found: {html_path}")
    except Exception as e:
        raise Exception(f"Error parsing guide {html_path}: {e}")

    analysis = {}
    
    # Safe title extraction
    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        analysis["raw_title"] = title_tag.string.split("|")[0].strip()
    else:
        analysis["raw_title"] = "Unknown Course"
    
    # Safe description extraction
    desc_tag = soup.find("meta", {"name": "description"})
    analysis["description"] = desc_tag["content"] if desc_tag and desc_tag.get("content") else "No description provided"

    # Using a more robust method to find sections
    analysis["sections"] = []
    for h2 in soup.find_all("h2"):
        section_content = []
        for sibling in h2.find_next_siblings():
            if sibling.name == "h2":
                break
            section_content.append(sibling)

        title = h2.get_text(strip=True)
        if title:  # Only add sections that have a title
            analysis["sections"].append(
                {"title": title, "content_soup": section_content}
            )

    # Extract "Teasers" for pedagogical value
    analysis["teasers"] = []
    teaser_classes = {
        "teaser-idea": "💡 רעיון",
        "teaser-warning": "⚠️ אזהרה",
        "teaser-secret": "🤫 סוד מקצועי",
        "teaser-bonus": "😎 בונוס",
    }
    # A more robust way to find teasers
    for div in soup.find_all(
        "div", class_=lambda c: c and any(tc in c for tc in teaser_classes.keys())
    ):
        teaser_type = None
        for cls in div.get("class", []):
            if cls in teaser_classes:
                teaser_type = teaser_classes[cls]
                break
        if teaser_type:
            title_tag = div.find(["h4", "div"], class_="teaser-title")
            title = title_tag.get_text(strip=True) if title_tag else teaser_type
            content = div.find("p").get_text(strip=True) if div.find("p") else ""
            analysis["teasers"].append(
                {"type": teaser_type, "title": title, "content": content}
            )

    return analysis


def build_pedagogical_narrative(analysis, num_sessions):
    """
    The "Pedagogical Compass". This function organizes the raw sections
    into a coherent course flow.
    """
    sections = analysis["sections"]

    # Define keywords for ordering
    intro_keywords = ["מבוא", "יסודות", "למה", "התחלה"]
    advanced_keywords = ["מתקדם", "יישום", "פרויקט", "מסקנות", "משימות"]

    # Separate sections based on keywords
    intro_sections = [
        s for s in sections if any(kw in s["title"] for kw in intro_keywords)
    ]
    advanced_sections = [
        s for s in sections if any(kw in s["title"] for kw in advanced_keywords)
    ]
    core_sections = [
        s for s in sections if s not in intro_sections and s not in advanced_sections
    ]

    # Create a logical order
    sorted_sections = intro_sections + core_sections + advanced_sections

    narrative = []
    # Simple distribution logic: divide sections among available sessions
    sections_per_session = max(1, len(sorted_sections) // num_sessions)

    current_session_content = []
    for i, section in enumerate(sorted_sections):
        current_session_content.append(section)
        if (
            len(current_session_content) >= sections_per_session
            and len(narrative) < num_sessions - 1
        ):
            narrative.append(current_session_content)
            current_session_content = []

    # Add remaining sections to the last session
    if current_session_content:
        if narrative:
            narrative[-1].extend(current_session_content)
        else:
            narrative.append(current_session_content)

    # Ensure we have the exact number of sessions requested
    while len(narrative) < num_sessions and narrative:
        # If we have fewer sessions than requested, split the largest one
        largest_session = max(narrative, key=len)
        if len(largest_session) > 1:
            split_point = len(largest_session) // 2
            narrative.append(largest_session[split_point:])
            narrative[narrative.index(largest_session)] = largest_session[:split_point]
        else:
            break  # Cannot split further

    # If still not enough, just duplicate the last one as a "workshop"
    while len(narrative) < num_sessions:
        narrative.append([{"title": "סדנת פרויקט ויישום מעשי", "content_soup": []}])

    return narrative[:num_sessions]


def call_language_model(
    prompt_text: str, api_key: str, system_prompt: str, context: str = ""
) -> str:
    """
    Calls the DeepSeek LLM API to enrich content.
    """
    if not api_key:
        # Fallback to the simple simulation if no API key is provided
        if "description" in prompt_text:
            topics = prompt_text.split(":")[-1].strip()
            return f"במפגש זה נצלול לעומק הנושאים הבאים: {topics}. נתחיל מהיסודות, נמשיך ליישומים מעשיים ונסקור דוגמאות מהעולם האמיתי כדי להבטיח הבנה מקיפה."
        if "objectives" in prompt_text:
            topics = prompt_text.split(":")[-1].strip().split(", ")
            return "\n".join(
                [
                    f"{i+1}. הסטודנט ידע ליישם את עקרונות '{topic}' בפרויקט מעשי."
                    for i, topic in enumerate(topics)
                ]
            )
        return "No API Key provided. Using fallback."

    try:
        # Use context if provided, otherwise use just the prompt
        if context:
            full_prompt = f"Based on the following context from the learning guides, please fulfill the user's request.\n\nCONTEXT:\n---\n{context[:2000]}\n---\n\nUSER REQUEST:\n{prompt_text}"
        else:
            full_prompt = prompt_text

        client = deepseek.DeepSeek(api_key=api_key)
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {"role": "user", "content": full_prompt},
            ],
            max_tokens=200,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        # If the API call fails, return a simple, informative string.
        print(f"⚠️  LLM API failed: {e}. Using template fallback.")
        if "description" in prompt_text:
            topics = prompt_text.split(":")[-1].strip()
            return f"במפגש זה נצלול לעומק הנושאים הבאים: {topics}. נתחיל מהיסודות, נמשיך ליישומים מעשיים ונסקור דוגמאות מהעולם האמיתי כדי להבטיח הבנה מקיפה."
        return "Unable to generate AI content. Please check your API key and network connection."


def find_relevant_image(topic: str) -> str:
    """Finds a relevant, royalty-free image URL for a given topic."""
    query = urllib.parse.quote_plus(topic)
    return f"https://source.unsplash.com/800x600/?{query}"


def create_course_json(
    analysis, guide_names, num_sessions, total_hours, density, api_key, system_prompt
):
    """Builds the final JSON object using all schema parameters."""
    
    # Validate inputs
    if not guide_names or len(guide_names) == 0:
        guide_names = ["unknown_guide"]
    
    if not analysis or not isinstance(analysis, dict):
        raise ValueError("Invalid analysis object provided")
    
    if num_sessions < 1:
        num_sessions = 1
    
    if total_hours <= 0:
        total_hours = 10
    
    if density not in ["low", "medium", "high"]:
        density = "medium"

    # Use the raw_title from the aggregated analysis for the course name
    course_code = (
        f"{re.split('[_.-]', guide_names[0])[0].upper()}-PRO-{datetime.now().year}"
        if guide_names
        else f"GEN-PRO-{datetime.now().year}"
    )
    start_date = datetime.now().date()

    # --- Read all guide content for LLM Context ---
    guide_context = ""
    for guide_name in guide_names:
        try:
            with open(guide_name, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f, "html.parser")
                guide_context += f"Content from {guide_name}:\n{soup.get_text(separator=' ', strip=True)}\n\n"
        except FileNotFoundError:
            guide_context += f"Could not find file: {guide_name}\n\n"

    # The Pedagogical Compass in action
    pedagogical_narrative = build_pedagogical_narrative(analysis, num_sessions)

    # --- Masterpiece JSON Structure ---
    course_structure = {
        "_DOCUMENTATION": {
            "title": f"קובץ ייבוא אוטומטי: {analysis['raw_title']}",
            "overview": f"קורס זה נוצר אוטומטית על ידי generate_course.py על בסיס המדריכים: {', '.join(guide_names)}.",
            "author": "LearningHub AI Course Generator",
            "version": "1.0",
        },
        "course": {
            "name": f"🚀 {analysis['raw_title']}",
            "code": course_code,
            "description": analysis["description"],
            "institution": "LearningHub - EduManage",
            "semester": "סמסטר אוטומטי",
            "year": str(datetime.now().year),
            "start_date": start_date.isoformat(),
            "total_sessions": num_sessions,
            "total_hours": total_hours,
            "color": "from-blue-500 to-indigo-500",  # Default color
            "allow_self_registration": True,
        },
        "sessions": [],
        "assignments": [],
        "materials": [],
        "announcements": [],
    }

    # Add all provided guides to materials
    for g_name in guide_names:
        course_structure["materials"].append(
            {
                "title": f"📚 מדריך: {re.split('[_.-]', g_name)[0].replace('_', ' ').title()}",
                "description": f"מדריך מקור: {g_name}",
                "type": "link",
                "file_url": f"https://bdnhost.net/Resources/{g_name}",
                "course_global": True,
            }
        )

    # Populate Sessions from the narrative
    for i, session_sections in enumerate(pedagogical_narrative):
        session_date = start_date + timedelta(weeks=i)
        session_title = " | ".join([s["title"] for s in session_sections])

        # --- AI Content Enrichment ---
        description_prompt = f"Write a short, engaging session description in Hebrew for a course session covering these topics: {session_title}. Start the description directly, without any introductory phrases."
        enriched_description = call_language_model(
            description_prompt, api_key, system_prompt, guide_context
        )

        objectives_prompt = f"Write 3 numbered learning objectives in Hebrew for a course session covering these topics: {session_title}. The objectives should start with 'הסטודנט ידע/יכיר/יבין'. Provide only the numbered list."
        enriched_objectives = call_language_model(
            objectives_prompt, api_key, system_prompt, guide_context
        )
        image_url = find_relevant_image(
            session_sections[0]["title"]
        )  # Use first topic for image search

        session = {
            "temp_id": f"s{i+1}",
            "session_number": i + 1,
            "title": f"מפגש {i+1}: {session_title}",
            "description": enriched_description,
            "objectives": enriched_objectives,
            "date": session_date.isoformat(),
            "duration_hours": round(total_hours / num_sessions, 2),
        }
        course_structure["sessions"].append(session)

        # Add the found image as a material for the session
        course_structure["materials"].append(
            {
                "title": f"🖼️ תמונת נושא: {session_sections[0]['title']}",
                "description": "תמונה להמחשת נושאי המפגש.",
                "type": "link",  # Using 'link' type to point to an image URL
                "file_url": image_url,
                "session_temp_id": f"s{i+1}",
            }
        )

    # --- Smart Assignment Generation based on Density ---

    # High Density: Create a small assignment for each session
    if density == "high":
        for i, session_sections in enumerate(
            pedagogical_narrative[:-1]
        ):  # Exclude last session (for project)
            first_section_title = session_sections[0]["title"]
            assignment = {
                "//_COMMENT": f"מטלת בית אוטומטית למפגש {i+1}",
                "title": f"📝 תרגיל {i+1}: יישום '{first_section_title}'",
                "description": f"במטלה זו נתרגל את העקרונות שנלמדו בנושא '{first_section_title}'.",
                "type": "assignment",
                "session_temp_id": f"s{i+1}",
                "due_date": (start_date + timedelta(weeks=i, days=5)).isoformat(),
                "max_score": 100,
                "weight": 10,  # Lower weight for smaller assignments
                "rubric": {
                    "name": f"מחוון תרגיל {i+1}",
                    "criteria": [
                        {
                            "title": "ביצוע המשימה",
                            "description": "האם התרגיל בוצע בהתאם להנחיות.",
                            "max_points": 70,
                        },
                        {
                            "title": "הגשה בזמן",
                            "description": "האם המטלה הוגשה בזמן.",
                            "max_points": 30,
                        },
                    ],
                },
            }
            course_structure["assignments"].append(assignment)

    # Medium/High Density: Create a quiz
    if density in ["medium", "high"] and len(analysis["teasers"]) > 1:
        quiz_session_index = (num_sessions // 2) if num_sessions > 1 else 0
        quiz_teasers = random.sample(
            analysis["teasers"], k=min(len(analysis["teasers"]), 2)
        )  # 2 random questions

        questions = []
        for teaser in quiz_teasers:
            # A simple way to generate a question and plausible wrong answers
            correct_answer = teaser["content"]
            other_options = [
                t["content"]
                for t in analysis["teasers"]
                if t["content"] != correct_answer
            ]
            distractors = random.sample(other_options, k=min(len(other_options), 2))

            options = distractors + [correct_answer]
            random.shuffle(options)

            questions.append(
                {
                    "question": f"איזה מהבאים הוא '{teaser['type']}' שהוזכר במדריך?",
                    "options": options,
                    "correct": options.index(correct_answer),
                }
            )

        quiz = {
            "//_COMMENT": "בוחן אמצע שנוצר אוטומטית.",
            "title": "❓ בוחן אמצע: בדיקת מושגי יסוד",
            "description": "בוחן קצר לבדיקת הבנת מושגי המפתח והעקרונות החשובים מהחלק הראשון של הקורס.",
            "type": "quiz",
            "session_temp_id": f"s{quiz_session_index + 1}",
            "due_date": (
                start_date + timedelta(weeks=quiz_session_index, days=5)
            ).isoformat(),
            "max_score": 100,
            "weight": 20,
            "content_data": {
                "instructions": "### 💡 למה לצפות בבוחן?\n- הבוחן מורכב מ-2 שאלות אמריקאיות.\n- הנושאים מבוססים על הטיפים והאזהרות מהמדריך.\n- לרשותכם 10 דקות.\n\nבהצלחה!",
                "questions": questions,
            },
        }
        course_structure["assignments"].append(quiz)

    # Create a Masterpiece Project Assignment from the last section
    last_section_title = (
        pedagogical_narrative[-1][-1]["title"]
        if pedagogical_narrative and len(pedagogical_narrative) > 0 and len(pedagogical_narrative[-1]) > 0
        else "יישום מעשי"
    )

    # Use teasers for pedagogical value in the assignment
    tips_from_teasers = [
        t["content"]
        for t in analysis.get("teasers", [])
        if t["type"] in ["💡 רעיון", "🤫 סוד מקצועי", "😎 בונוס"]
    ]
    warnings_for_rubric = [
        t["content"] for t in analysis.get("teasers", []) if t["type"] == "⚠️ אזהרה"
    ]
    
    # Handle low density: minimal assignments
    if density == "low":
        # Only create a final project, no exercises
        pass

    if True:  # Always create a project
        project = {
            "//_COMMENT": "פרויקט גמר שנוצר אוטומטית על בסיס המדריך.",
            "title": f"🏆 פרויקט גמר: יישום מעשי של {analysis['raw_title']}",
            "description": "בפרויקט זה תיישמו את כל העקרונות מהמדריך כדי לבנות פרויקט מקיף.",
            "type": "project",
            "session_temp_id": f"s{len(course_structure['sessions'])}",  # Link to last session
            "due_date": (
                start_date + timedelta(weeks=len(course_structure["sessions"]))
            ).isoformat(),
            "max_score": 100,
            "weight": (
                70 if density == "high" else (80 if density == "medium" else 100)
            ),  # Adjust weight based on density
            "key_concepts": [
                {"term": "יישום מעשי", "definition": "הפיכת תיאוריה לתוצר עובד."},
                {
                    "term": "פתרון בעיות",
                    "definition": "התמודדות עם אתגרים לא צפויים בתהליך. (מבוסס על מספר מדריכים)",
                },
            ],
            "content_data": {
                "instructions": (
                    f"### 🎯 מטרת הפרויקט:\nבהתבסס על המדריך, עליכם לבנות פרויקט המדגים שליטה בנושא '{last_section_title}'.\n\n### 📋 הנחיות:\n1. הגדירו בעיה מציאותית שניתן לפתור באמצעות הכלים מהמדריך.\n2. תכננו את הפתרון שלכם, תוך התייחסות לעקרונות שנלמדו.\n3. בנו את הפרויקט שלב אחר שלב.\n4. הגישו תוצר עובד יחד עם מסמך תיעוד קצר.\n\n### ✨ טיפים להצלחה:\n"
                    + "\n".join([f"- {tip}" for tip in tips_from_teasers])
                    if tips_from_teasers
                    else "- התחילו בקטן והתקדמו בהדרגה."
                ),
                "milestones": [
                    {
                        "title": "הגשה סופית",
                        "deadline": (
                            start_date + timedelta(weeks=num_sessions)
                        ).isoformat(),
                    },
                ],
            },
            "rubric": {
                "name": "מחוון פרויקט גמר",
                "criteria": [
                    {
                        "title": "עמידה בדרישות",
                        "description": "האם הפרויקט מיישם את כל הנושאים הנדרשים מהמדריך.",
                        "max_points": 50,
                    },
                    {
                        "title": "איכות התוצר",
                        "description": "התוצר עובד, יעיל ומובנה היטב.",
                        "max_points": 30,
                    },
                    {
                        "title": "הימנעות מטעויות נפוצות",
                        "description": "התייחסות לאזהרות מהמדריך. "
                        + " ".join(warnings_for_rubric),
                        "max_points": 10,
                    },
                    {
                        "title": "תיעוד והגשה",
                        "description": "ההגשה כוללת את כל הקבצים הנדרשים והסברים ברורים.",
                        "max_points": 10,
                    },
                ],
            },
        }
        course_structure["assignments"].append(project)

    # Add a generic announcement
    course_structure["announcements"].append(
        {
            "title": f"🎉 ברוכים הבאים לקורס '{analysis['raw_title']}'!",
            "content": "אנו שמחים להתחיל יחד את המסע. אנא עברו על סילבוס הקורס והכינו את סביבת העבודה הנדרשת לקראת המפגש הראשון.",
            "priority": "high",
            "session_temp_id": "s1",
        }
    )

    return course_structure


def validate_course_json(course_structure):
    """Validates the generated course JSON for consistency."""
    errors = []
    
    # Check required fields
    if "course" not in course_structure:
        errors.append("Missing 'course' field in output")
    
    if "sessions" not in course_structure:
        errors.append("Missing 'sessions' field in output")
    
    # Check session_temp_id consistency
    session_ids = {f"s{i+1}" for i in range(len(course_structure.get("sessions", [])))}
    for assignment in course_structure.get("assignments", []):
        if "session_temp_id" in assignment and assignment["session_temp_id"] not in session_ids:
            errors.append(f"Invalid session_temp_id: {assignment['session_temp_id']}")
    
    if errors:
        print("❌ Validation Errors:")
        for error in errors:
            print(f"  - {error}")
        return False
    
    print("✅ JSON validation passed!")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="🚀 Automatic Course Generator - Generate structured courses from learning guides",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_course.py --guide python_guide.html --output course.json --sessions 8 --hours 40
  python generate_course.py --guide iot_guide.html --density high --api-key YOUR_KEY
        """
    )
    
    parser.add_argument("--guide", required=True, help="Path to the HTML guide file")
    parser.add_argument("--output", default="course.json", help="Output JSON file path (default: course.json)")
    parser.add_argument("--sessions", type=int, default=8, help="Number of sessions (default: 8)")
    parser.add_argument("--hours", type=float, default=40, help="Total hours for the course (default: 40)")
    parser.add_argument("--density", choices=["low", "medium", "high"], default="medium", 
                       help="Course density: low (minimal), medium (balanced), high (intensive) (default: medium)")
    parser.add_argument("--api-key", default="", help="DeepSeek API key for LLM enrichment (optional)")
    parser.add_argument("--system-prompt", default="You are an expert course designer creating structured learning experiences.",
                       help="System prompt for LLM (default: expert course designer)")
    parser.add_argument("--validate-only", action="store_true", help="Only validate, don't generate")
    
    args = parser.parse_args()
    
    try:
        print(f"🔍 Analyzing guide: {args.guide}")
        analysis = analyze_guide(args.guide)
        print(f"✅ Extracted title: {analysis['raw_title']}")
        print(f"✅ Extracted description: {analysis['description'][:100]}...")
        
        print(f"\n📚 Generating course with {args.sessions} sessions, {args.hours} hours total")
        course = create_course_json(
            analysis,
            guide_names=[args.guide],
            num_sessions=args.sessions,
            total_hours=args.hours,
            density=args.density,
            api_key=args.api_key,
            system_prompt=args.system_prompt
        )
        
        # Validate before writing
        if not validate_course_json(course):
            print("\n❌ Course validation failed. Aborting write.")
            exit(1)
        
        # Write to file
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(course, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ Course generated successfully!")
        print(f"📄 Output file: {args.output}")
        print(f"📊 Sessions: {len(course['sessions'])}")
        print(f"📋 Assignments: {len(course['assignments'])}")
        print(f"📚 Materials: {len(course['materials'])}")
        
    except FileNotFoundError as e:
        print(f"❌ File error: {e}")
        exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
