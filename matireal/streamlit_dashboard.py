import streamlit as st
import json
from datetime import datetime
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

# Import the core logic from your generator script
from generate_course import analyze_guide, create_course_json

st.set_page_config(
    layout="wide", page_title="Course Generator Dashboard", page_icon="🚀"
)

st.title("🚀 Course Generator Dashboard")
st.write("ממשק ויזואלי ליצירת קורסים באופן אוטומטי על בסיס מדריכי הלימוד.")


@st.cache_data
def get_available_guides():
    """Scans the sitemap.xml to find all available HTML guide files."""
    guides_map = {}
    try:
        tree = ET.parse("sitemap.xml")
        root = tree.getroot()
        for url in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url"):
            loc = url.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text
            if loc.endswith(".html"):
                filename = loc.split("/")[-1]
                # Try to parse the title from the HTML file itself
                try:
                    with open(filename, "r", encoding="utf-8") as f:
                        soup = BeautifulSoup(f, "html.parser")
                        guides_map[filename] = soup.title.string.split("|")[0].strip()
                except (FileNotFoundError, AttributeError):
                    guides_map[filename] = (
                        filename  # Fallback to filename if title can't be read
                    )
        return guides_map
    except (FileNotFoundError, ET.ParseError):
        return {
            "web_scraping_guide.html": "Web Scraping Guide",
            "mechanical_design_guide.html": "Mechanical Design Guide",
        }  # Fallback


with st.sidebar:
    st.header("⚙️ הגדרות כלליות")
    course_name = st.text_input("שם הקורס (Course Name)", "Web Scraping for Engineers")
    guide_files_input = st.multiselect(
        "בחר מדריכים (Select Guides)",
        options=get_available_guides().keys(),
        format_func=lambda filename: get_available_guides()[
            filename
        ],  # Display title, return filename
        default=["web_scraping_guide.html"],
    )
    # Dynamic indicator for selected guides
    st.write(f"**נבחרו {len(guide_files_input)} מדריכים**")

    num_sessions = st.number_input(
        "מספר מפגשים (Number of Sessions)", min_value=1, value=4
    )
    total_hours = st.number_input('סה"כ שעות (Total Hours)', min_value=1, value=16)
    density = st.select_slider(
        "צפיפות תוכן (Content Density)",
        options=["low", "medium", "high"],
        value="medium",
    )
    st.date_input(
        "תאריך התחלה (Start Date)",
        key="start_date",
    )
    st.selectbox(
        "תדירות המפגשים (Frequency)",
        ["weekly", "bi-weekly"],
        key="frequency",
    )

    st.header("🤖 הגדרות AI")
    prompt_personas = {
        "עוזר פדגוגי כללי": "You are a helpful assistant that writes pedagogical content for courses in Hebrew. Your answers should be concise, engaging, and directly address the user's request without any extra conversational text.",
        "ממוקד דוגמאות מעשיות": "You are an expert instructor focused on practical application. All your generated content should emphasize real-world examples and hands-on exercises. Your answers are in Hebrew.",
        "מיועד למתחילים": "You are a friendly teacher explaining complex topics to complete beginners. Use simple language, analogies, and avoid jargon. Your answers are in Hebrew.",
        "מאתגר למתקדמים": "You are a senior engineer creating challenging content for experienced professionals. Focus on advanced concepts, edge cases, and in-depth analysis. Your answers are in Hebrew.",
    }
    st.selectbox(
        "בחר הנחיה ל-LLM (Prompt Persona)",
        options=list(prompt_personas.keys()),
        key="prompt_persona",
    )

    st.text_input(
        "DeepSeek API Key",
        type="password",
        key="api_key",
    )


generate_button = st.sidebar.button(
    "צור קובץ קורס (Generate Course File)", type="primary"
)

if generate_button:
    st.header("תהליך יצירת הקורס")
    log_area = st.empty()

    # --- 1. Gather Parameters ---
    params = {
        "course_name": course_name,
        "guide_files": guide_files_input,
        "num_sessions": num_sessions,
        "total_hours": total_hours,
        "density": density,
        "start_date": st.session_state.start_date,
        "frequency": st.session_state.frequency,
        "api_key": st.session_state.api_key,
        "system_prompt": prompt_personas[st.session_state.prompt_persona],
    }

    if not params["guide_files"] or params["guide_files"] == [""]:
        st.error("שגיאה: יש לספק לפחות קובץ מדריך אחד.")
    else:
        try:
            # --- 2. Analyze Guides ---
            combined_analysis = {
                "raw_title": params["course_name"],
                "description": "",
                "sections": [],
                "teasers": [],
            }
            all_guide_names = params["guide_files"]

            for guide_file in all_guide_names:
                log_area.info(f"מנתח את המדריך: {guide_file}...")
                single_guide_analysis = analyze_guide(guide_file)

                if not combined_analysis["description"]:
                    combined_analysis["description"] = single_guide_analysis[
                        "description"
                    ]
                else:
                    combined_analysis[
                        "description"
                    ] += f" {single_guide_analysis['description']}"

                combined_analysis["sections"].extend(single_guide_analysis["sections"])
                combined_analysis["teasers"].extend(single_guide_analysis["teasers"])

            if not combined_analysis["sections"]:
                raise ValueError("לא נמצאו סעיפים (H2) באף אחד מהמדריכים שסופקו.")

            # --- 3. Create Course JSON ---
            log_area.info("יוצר את מבנה הקורס...")
            course_json_data = create_course_json(
                analysis=combined_analysis,
                guide_names=all_guide_names,
                num_sessions=params["num_sessions"],
                total_hours=params["total_hours"],
                density=params["density"],
                api_key=params["api_key"],  # Pass the API key to the core function
                system_prompt=params["system_prompt"],
            )

            # --- 4. Save File and Provide Download ---
            output_filename = f"course_{'_'.join([f.replace('_guide.html', '') for f in all_guide_names])}.json"
            json_string = json.dumps(course_json_data, ensure_ascii=False, indent=4)

            log_area.success(f"הצלחה! קובץ הקורס '{output_filename}' מוכן להורדה.")

            st.download_button(
                label=f"הורד את {output_filename}",
                data=json_string,
                file_name=output_filename,
                mime="application/json",
            )

        except FileNotFoundError:
            st.error(
                f"שגיאה: אחד או יותר מקבצי המדריך לא נמצאו. אנא ודא שהקבצים קיימים באותה התיקייה."
            )
        except Exception as e:
            st.error(f"אירעה שגיאה בלתי צפויה: {e}")

st.info("כל הפרמטרים להגדרת הקורס נמצאים בסרגל הצד (sidebar) משמאל.")

st.subheader("איך זה עובד?")
st.markdown(
    """
1.  **הגדר את הפרמטרים** בסרגל הצד.
2.  **לחץ על כפתור 'צור קובץ קורס'**.
3.  הסקריפט ינתח את מדריכי ה-HTML שציינת.
4.  הוא יבנה קובץ JSON שלם על בסיס התוכן הפדגוגי וההגדרות שלך.
5.  **כפתור הורדה יופיע** ותוכל לשמור את קובץ הקורס המוכן.
"""
)
