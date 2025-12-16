from textual.app import App, ComposeResult
from textual.containers import ScrollableContainer, Horizontal, Vertical
from textual.widgets import (
    Header,
    Footer,
    Static,
    Label,
    Input,
    Button,
    Select,
    Checkbox,
)
from textual.binding import Binding
import json
from datetime import datetime

# Import the core logic from your generator script
from generate_course import analyze_guide, create_course_json


class CourseDashboardApp(App):
    """A Textual app to generate courses."""

    CSS_PATH = "course_dashboard.css"
    BINDINGS = [Binding(key="q", action="quit", description="צא מהתוכנית")]

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header(name="🚀 Course Generator Dashboard")
        with ScrollableContainer(id="main_container"):
            yield Label(
                "פרטי קורס כלליים (General Course Details)", classes="group_header"
            )
            yield Input(placeholder="שם הקורס (Course Name)", id="course_name")
            yield Input(
                placeholder="קבצי מדריך (מופרדים בפסיקים)",
                id="guide_files",
                value="web_scraping_guide.html",
            )
            with Horizontal():
                yield Input(
                    placeholder="מס' מפגשים",
                    id="num_sessions",
                    value="4",
                    type="integer",
                )
                yield Input(
                    placeholder='סה"כ שעות',
                    id="total_hours",
                    value="16",
                    type="integer",
                )
            yield Select(
                [
                    ("צפיפות נמוכה (Low)", "low"),
                    ("צפיפות בינונית (Medium)", "medium"),
                    ("צפיפות גבוהה (High)", "high"),
                ],
                prompt="צפיפות תוכן (Content Density)",
                id="density",
                value="medium",
            )

            yield Label("הגדרות מתקדמות (Advanced Settings)", classes="group_header")
            yield Checkbox(
                "השתמש בתאריכים מותאמים אישית (Use custom dates)",
                id="custom_dates_toggle",
            )
            yield Static(id="status_log", classes="log")
            yield Button(
                "צור קובץ קורס (Generate Course File)",
                variant="success",
                id="generate_button",
            )
        yield Footer()

    def log_message(self, message: str, type: str = "info"):
        log = self.query_one("#status_log")
        log.add_class(type)
        log.update(message)

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Event handler called when a button is pressed."""
        if event.button.id == "generate_button":
            self.log_message("מעבד בקשה...", "info")
            try:
                # --- Gather all parameters from inputs ---
                params = {
                    "course_name": self.query_one("#course_name").value,
                    "guide_files": [
                        f.strip()
                        for f in self.query_one("#guide_files").value.split(",")
                    ],
                    "num_sessions": int(self.query_one("#num_sessions").value),
                    "total_hours": int(self.query_one("#total_hours").value),
                    "density": self.query_one("#density").value,
                }

                # --- Call the generation logic ---
                self.generate_course_json(params)

            except Exception as e:
                self.log_message(f"שגיאה: {e}", "error")

    def generate_course_json(self, parameters):
        """Analyzes the guide and creates the course JSON file."""
        combined_analysis = {
            "raw_title": parameters["course_name"],
            "description": "",
            "sections": [],
            "teasers": [],
        }
        all_guide_names = parameters["guide_files"]

        if not all_guide_names or all_guide_names == [""]:
            self.log_message("שגיאה: יש לספק לפחות קובץ מדריך אחד.", "error")
            return

        try:
            for guide_file in all_guide_names:
                self.log_message(f"מנתח את המדריך: {guide_file}...", "info")
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

            self.log_message("יוצר את מבנה הקורס...", "info")
            course_json_data = create_course_json(
                analysis=combined_analysis,
                guide_names=all_guide_names,
                num_sessions=parameters["num_sessions"],
                total_hours=parameters["total_hours"],
                density=parameters["density"],
            )

            output_filename = f"course_{'_'.join([f.replace('_guide.html', '') for f in all_guide_names])}.json"
            with open(output_filename, "w", encoding="utf-8") as f:
                json.dump(course_json_data, f, ensure_ascii=False, indent=4)

            self.log_message(
                f"הצלחה! קובץ הקורס נשמר בשם: {output_filename}", "success"
            )

        except FileNotFoundError:
            self.log_message(f"שגיאה: אחד או יותר מקבצי המדריך לא נמצאו.", "error")
        except Exception as e:
            self.log_message(f"אירעה שגיאה בלתי צפויה: {e}", "error")


if __name__ == "__main__":
    app = CourseDashboardApp()
    app.run()
