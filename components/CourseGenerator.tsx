import React, { useState, useCallback } from 'react';

// Rich course templates with full content
const COURSE_TEMPLATES = {
    ai_engineering: {
        name: 'AI להנדסאים',
        color: 'from-purple-600 via-pink-600 to-red-600',
        sessions: [
            {
                title: 'מבוא ל-AI ויישומים תעשייתיים',
                description: 'היכרות עם מושגי בינה מלאכותית בסיסיים, סקירת כלים (ChatGPT, Claude, Gemini), והבנת יישומי AI בתעשייה.',
                objectives: '1. הסטודנט יבין מהי בינה מלאכותית.\n2. הסטודנט יכיר את הכלים המרכזיים.\n3. הסטודנט יזהה יישומים פוטנציאליים.',
                topics: ['מושגי יסוד ב-AI', 'כלי AI מודרניים', 'יישומים תעשייתיים'],
                guides: ['ai_basics.html', 'chatgpt_guide.html'],
                teacher_notes: 'להכין דמו של ChatGPT. להביא דוגמאות מהתעשייה.',
                quiz_questions: [
                    { q: 'מהי בינה מלאכותית?', options: ['תוכנה שמחקה חשיבה אנושית', 'רובוט פיזי', 'מחשב מהיר'], correct: 0 },
                    { q: 'מהו LLM?', options: ['מודל שפה גדול', 'מכונת לייזר', 'תוכנת עיצוב'], correct: 0 },
                    { q: 'איזה כלי AI פותח על ידי OpenAI?', options: ['ChatGPT', 'Gemini', 'Claude'], correct: 0 },
                    { q: 'מהו Prompt?', options: ['הנחיה למודל AI', 'סוג מכונה', 'שפת תכנות'], correct: 0 },
                    { q: 'מהו יתרון מרכזי של AI בתעשייה?', options: ['אוטומציה וחיזוי', 'החלפת עובדים', 'הורדת מחירים'], correct: 0 }
                ],
                class_assignment: { title: 'היכרות עם ChatGPT', desc: 'פתחו חשבון ונסו 5 שאלות מקצועיות' },
                homework: { title: 'זיהוי יישומי AI', desc: 'זהו 5 תהליכים בעבודה שיכולים להשתפר עם AI' }
            },
            {
                title: 'Prompt Engineering מתקדם',
                description: 'למידת טכניקות לכתיבת פרומפטים יעילים. יצירת בנק פרומפטים לשימוש יומיומי.',
                objectives: '1. שליטה בכתיבת פרומפטים.\n2. יצירת תבניות לשימוש חוזר.\n3. הבנת ההבדלים בין מודלים.',
                topics: ['טכניקות Prompt', 'Chain of Thought', 'Role Prompting'],
                guides: ['prompt-engineering-guide.html', 'prompts.html'],
                teacher_notes: 'להכין 10 תקלות אמיתיות לתרגול.',
                quiz_questions: [
                    { q: 'מהו עיקרון ה-Context בפרומפט?', options: ['מתן רקע רלוונטי', 'כתיבה קצרה', 'שימוש באנגלית'], correct: 0 },
                    { q: 'מה עדיף בפרומפט?', options: ['להיות ספציפי ומפורט', 'להיות כללי', 'מילה אחת'], correct: 0 },
                    { q: 'מהי טכניקת Chain of Thought?', options: ['חשיבה צעד אחר צעד', 'שרשרת שאלות', 'חיבור מודלים'], correct: 0 },
                    { q: 'מתי לתת דוגמאות בפרומפט?', options: ['כשרוצים פורמט מסוים', 'תמיד', 'אף פעם'], correct: 0 },
                    { q: 'מהו Role Prompting?', options: ['הגדרת תפקיד למודל', 'שינוי שם', 'יצירת משתמש'], correct: 0 }
                ],
                class_assignment: { title: 'אבחון תקלות עם AI', desc: 'כתבו פרומפט מפורט ל-5 תקלות והשוו תוצאות' },
                homework: { title: 'בנק פרומפטים אישי', desc: 'צרו 10 פרומפטים לשימוש יומיומי בעבודה' }
            },
            {
                title: 'Python בסיסי למהנדסים',
                description: 'מבוא לתכנות Python. משתנים, לולאות, תנאים, פונקציות. דגש על חישובים הנדסיים.',
                objectives: '1. כתיבת סקריפטים בסיסיים.\n2. חישוב פרמטרים הנדסיים.\n3. קריאת נתונים מקובץ.',
                topics: ['משתנים וטיפוסים', 'לולאות ותנאים', 'פונקציות'],
                guides: ['python_guide.html', 'terminal_guide.html'],
                teacher_notes: 'לוודא שלכולם מותקן Python ו-VS Code.',
                quiz_questions: [
                    { q: 'מהו משתנה ב-Python?', options: ['מקום לאחסון נתונים', 'פונקציה', 'לולאה'], correct: 0 },
                    { q: 'איך מדפיסים טקסט?', options: ['print()', 'echo()', 'write()'], correct: 0 },
                    { q: 'מה עושה לולאת for?', options: ['חוזרת על פעולה', 'בודקת תנאי', 'מגדירה פונקציה'], correct: 0 },
                    { q: 'מהו הסוג של 3.14?', options: ['float', 'int', 'str'], correct: 0 },
                    { q: 'איך מגדירים פונקציה?', options: ['def name():', 'function name():', 'create()'], correct: 0 }
                ],
                class_assignment: { title: 'מחשבון הנדסי', desc: 'כתבו תוכנית שמחשבת מומנט, מהירות זוויתית והספק' },
                homework: { title: 'מחשבון OEE', desc: 'כתבו תוכנית שמחשבת OEE מנתוני ייצור' }
            },
            {
                title: 'ניתוח נתונים עם Pandas',
                description: 'עבודה עם ספריית Pandas לניתוח נתוני ייצור. קריאת Excel/CSV, ניקוי נתונים, חישובים סטטיסטיים.',
                objectives: '1. טעינה ועיבוד נתונים.\n2. חישוב סטטיסטיקות.\n3. זיהוי מגמות ובעיות.',
                topics: ['Pandas DataFrame', 'ניתוח סטטיסטי', 'ויזואליזציה'],
                guides: ['data_analysis_guide.html', 'excel_student.html'],
                teacher_notes: 'להכין dataset ייצור אמיתי.',
                quiz_questions: [
                    { q: 'מהו DataFrame?', options: ['טבלת נתונים דו-ממדית', 'רשימה', 'מספר'], correct: 0 },
                    { q: 'איך קוראים CSV?', options: ['pd.read_csv()', 'pd.load_csv()', 'pd.open_csv()'], correct: 0 },
                    { q: 'מה עושה describe()?', options: ['סטטיסטיקות בסיסיות', 'מציג 5 שורות', 'שומר קובץ'], correct: 0 },
                    { q: 'איך מסננים שורות?', options: ['df[df["col"] > val]', 'df.filter()', 'df.select()'], correct: 0 },
                    { q: 'מהו OEE?', options: ['מדד יעילות ציוד', 'סוג מכונה', 'שפת תכנות'], correct: 0 }
                ],
                class_assignment: { title: 'ניתוח נתוני ייצור', desc: 'טענו קובץ CSV, חשבו ממוצע יומי וצרו גרף' },
                homework: { title: 'דוח OEE אוטומטי', desc: 'כתבו סקריפט שמייצר דוח Excel עם גרפים' }
            },
            {
                title: 'אינטגרציה עם OpenAI API',
                description: 'חיבור למערכת OpenAI API. שליחת נתונים לניתוח, קבלת המלצות, אוטומציה של תהליכים.',
                objectives: '1. קבלת API key והגדרת סביבה.\n2. שליחת בקשות ל-API.\n3. ניתוח נתונים אוטומטי.',
                topics: ['API Key', 'HTTP Requests', 'JSON'],
                guides: ['understanding-llms-how-it-works.html', 'chatgpt_guide.html'],
                teacher_notes: 'לוודא שלכולם יש API key פעיל.',
                quiz_questions: [
                    { q: 'מהו API Key?', options: ['מפתח אימות לשירות', 'סיסמה', 'שם משתמש'], correct: 0 },
                    { q: 'מהו Rate Limiting?', options: ['הגבלת בקשות', 'מהירות חיבור', 'גודל קובץ'], correct: 0 },
                    { q: 'באיזה פורמט נשלחים נתונים?', options: ['JSON', 'CSV', 'TXT'], correct: 0 },
                    { q: 'מהו Token ב-LLM?', options: ['יחידת טקסט', 'מטבע', 'סיסמה'], correct: 0 },
                    { q: 'מה עושה temperature?', options: ['שולט ביצירתיות', 'מודד חום', 'קובע מהירות'], correct: 0 }
                ],
                class_assignment: { title: 'שליחת בקשות ל-API', desc: 'כתבו סקריפט ששולח נתוני חיישן ומקבל ניתוח' },
                homework: { title: 'מערכת אבחון אוטומטית', desc: 'בנו סקריפט שמנתח חריגות ושומר המלצות' }
            },
            {
                title: 'Web Scraping ואיסוף מידע',
                description: 'למידת טכניקות לאיסוף מידע מאתרי אינטרנט. BeautifulSoup, שילוב עם AI לניתוח.',
                objectives: '1. הבנת Web Scraping.\n2. למידת BeautifulSoup.\n3. שילוב AI לניתוח.',
                topics: ['HTML Parsing', 'BeautifulSoup', 'Data Extraction'],
                guides: ['web_scraping_guide.html', 'python_guide.html'],
                teacher_notes: 'להסביר שיקולים משפטיים ואתיים.',
                quiz_questions: [
                    { q: 'מהו Web Scraping?', options: ['איסוף מידע מאתרים', 'יצירת אתרים', 'עיצוב גרפי'], correct: 0 },
                    { q: 'מהו BeautifulSoup?', options: ['ספרייה לחילוץ מידע', 'מסד נתונים', 'שפת תכנות'], correct: 0 },
                    { q: 'מהו robots.txt?', options: ['קובץ הרשאות סריקה', 'סוג רובוט', 'שפת תכנות'], correct: 0 },
                    { q: 'מהו Selenium?', options: ['כלי אוטומציה דפדפן', 'מסד נתונים', 'שפת תכנות'], correct: 0 },
                    { q: 'למה לבדוק תנאי שימוש?', options: ['לא להפר חוקים', 'לא חשוב', 'לחסוך זמן'], correct: 0 }
                ],
                class_assignment: { title: 'סריקת אתר', desc: 'סרקו אתר חדשות ואספו 10 כותרות עם קישורים' },
                homework: { title: 'מאסף מחירים', desc: 'בנו סקריפט שאוסף מחירים ומנתח עם AI' }
            },
            {
                title: 'עבודה עם מסמכים - PDF, Word, Excel',
                description: 'עיבוד מסמכים באמצעות AI. קריאת PDF, יצירת Word אוטומטית, עבודה עם Excel.',
                objectives: '1. קריאת קבצי PDF.\n2. יצירת Word אוטומטית.\n3. עבודה עם Excel.',
                topics: ['PyPDF2', 'python-docx', 'openpyxl'],
                guides: ['excel_student.html', 'data_analysis_guide.html'],
                teacher_notes: 'להכין קבצי דוגמה מהתחום.',
                quiz_questions: [
                    { q: 'איזו ספרייה קוראת PDF?', options: ['PyPDF2', 'pandas', 'numpy'], correct: 0 },
                    { q: 'איזו ספרייה יוצרת Word?', options: ['python-docx', 'pandas', 'matplotlib'], correct: 0 },
                    { q: 'איזו ספרייה עובדת עם Excel?', options: ['openpyxl', 'PyPDF2', 'docx'], correct: 0 },
                    { q: 'מהו OCR?', options: ['זיהוי תווים אופטי', 'סוג קובץ', 'שפת תכנות'], correct: 0 },
                    { q: 'למה לשלב AI בעיבוד מסמכים?', options: ['ניתוח חכם', 'לא צריך', 'לחסוך מקום'], correct: 0 }
                ],
                class_assignment: { title: 'קריאת PDF', desc: 'חלצו טקסט מקטלוג טכני ונתחו עם AI' },
                homework: { title: 'דוח אוטומטי', desc: 'בנו מערכת שמייצרת דוח Word מנתוני Excel' }
            },
            {
                title: 'בניית Chatbot מותאם אישית',
                description: 'בניית Chatbot שעונה על שאלות ספציפיות. RAG, אימון על מסמכים, ממשק Streamlit.',
                objectives: '1. הבנת ארכיטקטורת Chatbot.\n2. למידת RAG.\n3. יצירת ממשק Web.',
                topics: ['RAG', 'Vector Database', 'Streamlit'],
                guides: ['chatgpt_guide.html', 'ui_ux_guide.html'],
                teacher_notes: 'להכין מדריך טכני להדגמה.',
                quiz_questions: [
                    { q: 'מהו RAG?', options: ['Retrieval Augmented Generation', 'Random AI Generator', 'Real AI Guide'], correct: 0 },
                    { q: 'מהו Vector Database?', options: ['מסד לאחסון embeddings', 'מסד רגיל', 'קובץ טקסט'], correct: 0 },
                    { q: 'מהו Streamlit?', options: ['ספרייה ליצירת web apps', 'מסד נתונים', 'חיישן'], correct: 0 },
                    { q: 'מהו Embedding?', options: ['ייצוג וקטורי של טקסט', 'סוג קובץ', 'שפת תכנות'], correct: 0 },
                    { q: 'למה להשתמש ב-RAG?', options: ['לתת ידע מותאם', 'לחסוך כסף', 'לא צריך'], correct: 0 }
                ],
                class_assignment: { title: 'Chatbot בסיסי', desc: 'בנו בוט שעונה על שאלות מתוך מסמך טכני' },
                homework: { title: 'הרחבת הבוט', desc: 'הוסיפו ממשק Streamlit ואימון על מסמכים נוספים' }
            },
            {
                title: 'Computer Vision בסיסי',
                description: 'מבוא לראיית מכונה. זיהוי עצמים, OpenAI Vision API, יישומים: בקרת איכות, זיהוי פגמים.',
                objectives: '1. הבנת Computer Vision.\n2. שימוש ב-Vision API.\n3. זיהוי עצמים בתמונות.',
                topics: ['Image Recognition', 'OpenAI Vision', 'Object Detection'],
                guides: ['ai_basics.html', 'understanding-llms-how-it-works.html'],
                teacher_notes: 'להכין תמונות לדוגמה מהתחום.',
                quiz_questions: [
                    { q: 'מהו Computer Vision?', options: ['ראיית מכונה', 'מסך מחשב', 'מצלמה'], correct: 0 },
                    { q: 'מהו Object Detection?', options: ['זיהוי עצמים בתמונה', 'יצירת עצמים', 'מחיקת עצמים'], correct: 0 },
                    { q: 'מהו OCR?', options: ['זיהוי טקסט בתמונה', 'סוג מצלמה', 'שפת תכנות'], correct: 0 },
                    { q: 'מהו יישום של CV בתעשייה?', options: ['בקרת איכות', 'כתיבת קוד', 'ניהול פרויקטים'], correct: 0 },
                    { q: 'מהו Image Classification?', options: ['סיווג תמונות', 'עריכת תמונות', 'מחיקת תמונות'], correct: 0 }
                ],
                class_assignment: { title: 'זיהוי עצמים', desc: 'השתמשו ב-Vision API לזיהוי רכיבים בתמונות' },
                homework: { title: 'מערכת זיהוי פגמים', desc: 'בנו מערכת שמזהה פגמים בחלקי ייצור' }
            },
            {
                title: 'פרויקט גמר - הצגות וסיכום',
                description: 'הצגת פרויקטי הגמר. כל תלמיד מציג את הפרויקט שלו. משוב, סיכום הקורס, משאבים להמשך.',
                objectives: '1. הצגת פרויקטי גמר.\n2. קבלת משוב בונה.\n3. תכנון המשך למידה.',
                topics: ['הצגת פרויקט', 'משוב', 'סיכום'],
                guides: ['career_prep.html', 'cv_guide.html'],
                teacher_notes: 'להכין משוב מסודר לכל תלמיד.',
                quiz_questions: [
                    { q: 'מה חשוב בהצגת פרויקט?', options: ['בהירות ומקצועיות', 'אורך', 'צבעים'], correct: 0 },
                    { q: 'מהו משוב בונה?', options: ['הערות לשיפור', 'ביקורת שלילית', 'שבחים בלבד'], correct: 0 },
                    { q: 'למה חשוב לתעד פרויקט?', options: ['לשימוש עתידי', 'לא חשוב', 'לחסוך מקום'], correct: 0 },
                    { q: 'מה לכלול ב-README?', options: ['הוראות התקנה והפעלה', 'קוד בלבד', 'תמונות בלבד'], correct: 0 },
                    { q: 'איך להמשיך ללמוד?', options: ['פרויקטים אישיים', 'לא צריך', 'רק קורסים'], correct: 0 }
                ],
                class_assignment: { title: 'הצגת פרויקט', desc: 'הציגו את הפרויקט שלכם ב-10 דקות' },
                homework: { title: 'תיעוד סופי', desc: 'כתבו README מפורט והעלו לגיטהאב' }
            }
        ]
    },
    programming_python: {
        name: 'תכנות Python מקיף',
        color: 'from-blue-600 via-cyan-600 to-teal-600',
        sessions: [
            {
                title: 'יסודות Python - משתנים וטיפוסים',
                description: 'התקנת סביבת עבודה, משתנים, טיפוסי נתונים בסיסיים, קלט ופלט.',
                objectives: '1. התקנת Python ו-VS Code.\n2. הבנת טיפוסי נתונים.\n3. כתיבת תוכנית ראשונה.',
                topics: ['התקנת סביבה', 'משתנים', 'טיפוסי נתונים', 'קלט/פלט'],
                guides: ['python_guide.html', 'terminal_guide.html'],
                teacher_notes: 'לוודא שלכולם יש הרשאות התקנה.',
                quiz_questions: [
                    { q: 'מהו משתנה?', options: ['מקום לאחסון נתונים', 'פונקציה', 'לולאה'], correct: 0 },
                    { q: 'מהו הסוג של "hello"?', options: ['str', 'int', 'float'], correct: 0 },
                    { q: 'מהו הסוג של 42?', options: ['int', 'str', 'float'], correct: 0 },
                    { q: 'איך מקבלים קלט?', options: ['input()', 'print()', 'read()'], correct: 0 },
                    { q: 'מהו IDE?', options: ['סביבת פיתוח', 'שפת תכנות', 'מערכת הפעלה'], correct: 0 }
                ],
                class_assignment: { title: 'Hello World', desc: 'כתבו תוכנית שמקבלת שם ומדפיסה ברכה' },
                homework: { title: 'מחשבון בסיסי', desc: 'כתבו תוכנית שמחשבת שטח מלבן' }
            },
            {
                title: 'בקרת זרימה - תנאים ולולאות',
                description: 'שימוש ב-if/elif/else, לולאות for ו-while, break ו-continue.',
                objectives: '1. שליטה בתנאים.\n2. שימוש בלולאות.\n3. בקרת זרימה מתקדמת.',
                topics: ['if/else', 'for loop', 'while loop', 'break/continue'],
                guides: ['python_guide.html', 'algorithmic_thinking.html'],
                teacher_notes: 'להכין תרגילים מדורגים.',
                quiz_questions: [
                    { q: 'מה עושה if?', options: ['בודק תנאי', 'חוזר על פעולה', 'מגדיר פונקציה'], correct: 0 },
                    { q: 'מה הפלט של range(3)?', options: ['0,1,2', '1,2,3', '0,1,2,3'], correct: 0 },
                    { q: 'מתי משתמשים ב-while?', options: ['כשלא יודעים כמה פעמים', 'תמיד', 'אף פעם'], correct: 0 },
                    { q: 'מה עושה break?', options: ['יוצא מהלולאה', 'ממשיך לאיטרציה הבאה', 'מתחיל מחדש'], correct: 0 },
                    { q: 'מה עושה continue?', options: ['קופץ לאיטרציה הבאה', 'יוצא מהלולאה', 'עוצר'], correct: 0 }
                ],
                class_assignment: { title: 'משחק ניחוש', desc: 'כתבו משחק שמנחש מספר אקראי' },
                homework: { title: 'FizzBuzz', desc: 'כתבו תוכנית FizzBuzz קלאסית' }
            },
            {
                title: 'מבני נתונים - רשימות ומילונים',
                description: 'עבודה עם Lists, Tuples, Dictionaries, Sets. שיטות ופעולות.',
                objectives: '1. שליטה ברשימות.\n2. עבודה עם מילונים.\n3. בחירת מבנה נתונים מתאים.',
                topics: ['Lists', 'Tuples', 'Dictionaries', 'Sets'],
                guides: ['python_guide.html'],
                teacher_notes: 'להדגיש מתי להשתמש בכל מבנה.',
                quiz_questions: [
                    { q: 'מהו List?', options: ['רשימה מסודרת', 'מילון', 'קבוצה'], correct: 0 },
                    { q: 'איך מוסיפים לרשימה?', options: ['append()', 'add()', 'insert()'], correct: 0 },
                    { q: 'מהו Dictionary?', options: ['מיפוי key-value', 'רשימה', 'מספר'], correct: 0 },
                    { q: 'מהו Set?', options: ['קבוצה ללא כפילויות', 'רשימה', 'מילון'], correct: 0 },
                    { q: 'מהו Tuple?', options: ['רשימה לא ניתנת לשינוי', 'מילון', 'קבוצה'], correct: 0 }
                ],
                class_assignment: { title: 'ניהול רשימת קניות', desc: 'כתבו תוכנית לניהול רשימת קניות' },
                homework: { title: 'ספירת מילים', desc: 'כתבו תוכנית שסופרת מילים בטקסט' }
            },
            {
                title: 'פונקציות ומודולריות',
                description: 'הגדרת פונקציות, פרמטרים, ערכי החזרה, scope, מודולים וייבוא.',
                objectives: '1. כתיבת פונקציות.\n2. הבנת scope.\n3. שימוש במודולים.',
                topics: ['def', 'parameters', 'return', 'import'],
                guides: ['python_guide.html', 'github_guide.html'],
                teacher_notes: 'להדגיש DRY principle.',
                quiz_questions: [
                    { q: 'איך מגדירים פונקציה?', options: ['def name():', 'function name():', 'func name():'], correct: 0 },
                    { q: 'מה עושה return?', options: ['מחזיר ערך', 'מדפיס', 'קולט'], correct: 0 },
                    { q: 'מהו scope?', options: ['טווח הכרה של משתנה', 'סוג פונקציה', 'שם משתנה'], correct: 0 },
                    { q: 'איך מייבאים מודול?', options: ['import', 'include', 'require'], correct: 0 },
                    { q: 'מהו DRY?', options: ['Dont Repeat Yourself', 'Do Run Yourself', 'Data Ready Yet'], correct: 0 }
                ],
                class_assignment: { title: 'ספריית פונקציות', desc: 'כתבו 5 פונקציות שימושיות' },
                homework: { title: 'מודול אישי', desc: 'צרו מודול עם פונקציות וייבאו אותו' }
            },
            {
                title: 'עבודה עם קבצים',
                description: 'קריאה וכתיבה לקבצים, עבודה עם JSON, CSV, טיפול בשגיאות.',
                objectives: '1. קריאת קבצים.\n2. כתיבה לקבצים.\n3. עבודה עם JSON.',
                topics: ['open/read/write', 'JSON', 'CSV', 'try/except'],
                guides: ['python_guide.html', 'data_analysis_guide.html'],
                teacher_notes: 'להכין קבצי דוגמה.',
                quiz_questions: [
                    { q: 'איך פותחים קובץ?', options: ['open()', 'read()', 'file()'], correct: 0 },
                    { q: 'מהו JSON?', options: ['פורמט נתונים', 'שפת תכנות', 'מסד נתונים'], correct: 0 },
                    { q: 'מה עושה try/except?', options: ['טיפול בשגיאות', 'לולאה', 'תנאי'], correct: 0 },
                    { q: 'מהו CSV?', options: ['קובץ מופרד בפסיקים', 'תמונה', 'וידאו'], correct: 0 },
                    { q: 'למה להשתמש ב-with?', options: ['סגירה אוטומטית', 'מהירות', 'יופי'], correct: 0 }
                ],
                class_assignment: { title: 'קורא JSON', desc: 'כתבו תוכנית שקוראת ומעבדת JSON' },
                homework: { title: 'יומן אישי', desc: 'כתבו תוכנית שמנהלת יומן בקובץ' }
            },
            {
                title: 'תכנות מונחה עצמים',
                description: 'מחלקות, אובייקטים, תכונות, שיטות, ירושה, אנקפסולציה.',
                objectives: '1. הגדרת מחלקות.\n2. יצירת אובייקטים.\n3. הבנת ירושה.',
                topics: ['class', 'objects', 'inheritance', '__init__'],
                guides: ['python_guide.html'],
                teacher_notes: 'להשתמש בדוגמאות מוחשיות.',
                quiz_questions: [
                    { q: 'מהי מחלקה?', options: ['תבנית ליצירת אובייקטים', 'פונקציה', 'משתנה'], correct: 0 },
                    { q: 'מהו __init__?', options: ['בנאי', 'הורס', 'שיטה רגילה'], correct: 0 },
                    { q: 'מהו self?', options: ['הפניה לאובייקט', 'משתנה גלובלי', 'פונקציה'], correct: 0 },
                    { q: 'מהי ירושה?', options: ['העברת תכונות למחלקה חדשה', 'מחיקה', 'העתקה'], correct: 0 },
                    { q: 'מהי אנקפסולציה?', options: ['הסתרת מימוש', 'הצגת מימוש', 'מחיקת מימוש'], correct: 0 }
                ],
                class_assignment: { title: 'מחלקת רכב', desc: 'צרו מחלקה שמייצגת רכב עם תכונות ושיטות' },
                homework: { title: 'מערכת ניהול', desc: 'בנו מערכת ניהול עובדים עם ירושה' }
            },
            {
                title: 'ספריות חיצוניות ו-pip',
                description: 'התקנת ספריות עם pip, virtualenv, requirements.txt, ספריות פופולריות.',
                objectives: '1. התקנת ספריות.\n2. ניהול סביבות.\n3. שימוש בספריות פופולריות.',
                topics: ['pip', 'virtualenv', 'requirements.txt', 'packages'],
                guides: ['python_guide.html', 'terminal_guide.html'],
                teacher_notes: 'להסביר חשיבות סביבות וירטואליות.',
                quiz_questions: [
                    { q: 'מהו pip?', options: ['מנהל חבילות', 'שפת תכנות', 'עורך קוד'], correct: 0 },
                    { q: 'למה virtualenv?', options: ['בידוד סביבות', 'מהירות', 'יופי'], correct: 0 },
                    { q: 'מהו requirements.txt?', options: ['רשימת תלויות', 'קוד', 'תיעוד'], correct: 0 },
                    { q: 'איך מתקינים ספרייה?', options: ['pip install', 'pip add', 'pip get'], correct: 0 },
                    { q: 'מהו PyPI?', options: ['מאגר חבילות', 'שפת תכנות', 'עורך'], correct: 0 }
                ],
                class_assignment: { title: 'התקנת ספריות', desc: 'צרו סביבה וירטואלית והתקינו 5 ספריות' },
                homework: { title: 'פרויקט עם ספריות', desc: 'בנו פרויקט שמשתמש ב-3 ספריות חיצוניות' }
            },
            {
                title: 'בסיסי נתונים ו-SQL',
                description: 'מבוא ל-SQL, SQLite, חיבור מ-Python, CRUD operations.',
                objectives: '1. הבנת SQL בסיסי.\n2. עבודה עם SQLite.\n3. ביצוע CRUD.',
                topics: ['SQL', 'SQLite', 'CRUD', 'sqlite3'],
                guides: ['sql_guide.html', 'python_guide.html'],
                teacher_notes: 'להכין מסד נתונים לדוגמה.',
                quiz_questions: [
                    { q: 'מהו SQL?', options: ['שפת שאילתות', 'שפת תכנות', 'מסד נתונים'], correct: 0 },
                    { q: 'מהו SELECT?', options: ['שליפת נתונים', 'הוספת נתונים', 'מחיקת נתונים'], correct: 0 },
                    { q: 'מהו INSERT?', options: ['הוספת נתונים', 'שליפת נתונים', 'עדכון נתונים'], correct: 0 },
                    { q: 'מהו SQLite?', options: ['מסד נתונים קל', 'שפת תכנות', 'ספרייה'], correct: 0 },
                    { q: 'מהו CRUD?', options: ['Create Read Update Delete', 'Code Run Use Debug', 'Copy Rename Update Delete'], correct: 0 }
                ],
                class_assignment: { title: 'מסד נתונים', desc: 'צרו מסד נתונים לניהול מוצרים' },
                homework: { title: 'אפליקציית CRUD', desc: 'בנו אפליקציה מלאה עם כל פעולות CRUD' }
            },
            {
                title: 'APIs ו-Web',
                description: 'קריאה ל-APIs עם requests, יצירת API עם Flask, JSON.',
                objectives: '1. קריאה ל-APIs.\n2. יצירת API בסיסי.\n3. עבודה עם JSON.',
                topics: ['requests', 'Flask', 'REST API', 'JSON'],
                guides: ['python_guide.html', 'web_scraping_guide.html'],
                teacher_notes: 'להכין API לדוגמה.',
                quiz_questions: [
                    { q: 'מהו API?', options: ['ממשק תכנות', 'שפת תכנות', 'מסד נתונים'], correct: 0 },
                    { q: 'מהו GET?', options: ['בקשת נתונים', 'שליחת נתונים', 'מחיקת נתונים'], correct: 0 },
                    { q: 'מהו POST?', options: ['שליחת נתונים', 'בקשת נתונים', 'עדכון נתונים'], correct: 0 },
                    { q: 'מהו Flask?', options: ['framework ל-web', 'מסד נתונים', 'ספרייה'], correct: 0 },
                    { q: 'מהו REST?', options: ['סגנון ארכיטקטורה', 'שפת תכנות', 'מסד נתונים'], correct: 0 }
                ],
                class_assignment: { title: 'קריאה ל-API', desc: 'קראו נתונים מ-API ציבורי והציגו אותם' },
                homework: { title: 'API משלכם', desc: 'צרו API פשוט עם Flask' }
            },
            {
                title: 'פרויקט גמר',
                description: 'הצגת פרויקטי הגמר. יישום כל החומר הנלמד בפרויקט מעשי.',
                objectives: '1. הצגת פרויקט.\n2. קבלת משוב.\n3. סיכום הקורס.',
                topics: ['פרויקט', 'הצגה', 'סיכום'],
                guides: ['github_guide.html', 'cv_guide.html'],
                teacher_notes: 'להכין משוב לכל תלמיד.',
                quiz_questions: [
                    { q: 'מה חשוב בפרויקט?', options: ['פונקציונליות ותיעוד', 'אורך הקוד', 'צבעים'], correct: 0 },
                    { q: 'למה README?', options: ['תיעוד הפרויקט', 'קוד', 'עיצוב'], correct: 0 },
                    { q: 'מהו Git?', options: ['ניהול גרסאות', 'שפת תכנות', 'עורך'], correct: 0 },
                    { q: 'למה GitHub?', options: ['שיתוף קוד', 'כתיבת קוד', 'הרצת קוד'], correct: 0 },
                    { q: 'מה הלאה?', options: ['פרויקטים אישיים', 'לא כלום', 'רק קורסים'], correct: 0 }
                ],
                class_assignment: { title: 'הצגת פרויקט', desc: 'הציגו את הפרויקט שלכם' },
                homework: { title: 'העלאה לגיטהאב', desc: 'העלו את הפרויקט לגיטהאב עם README' }
            }
        ]
    },
    data_analysis: {
        name: 'ניתוח נתונים ו-BI',
        color: 'from-green-600 via-emerald-600 to-teal-600',
        sessions: [
            {
                title: 'מבוא לניתוח נתונים',
                description: 'מושגי יסוד בניתוח נתונים, סוגי נתונים, תהליך הניתוח, כלים.',
                objectives: '1. הבנת תהליך ניתוח נתונים.\n2. הכרת כלים.\n3. זיהוי סוגי נתונים.',
                topics: ['Data Analysis Process', 'Data Types', 'Tools Overview'],
                guides: ['data_analysis_guide.html', 'excel_student.html'],
                teacher_notes: 'להביא דוגמאות מעשיות.',
                quiz_questions: [
                    { q: 'מהו ניתוח נתונים?', options: ['תהליך הפקת תובנות', 'כתיבת קוד', 'עיצוב'], correct: 0 },
                    { q: 'מהם נתונים כמותיים?', options: ['מספרים', 'טקסט', 'תמונות'], correct: 0 },
                    { q: 'מהם נתונים איכותניים?', options: ['קטגוריות', 'מספרים', 'תאריכים'], correct: 0 },
                    { q: 'מהו ETL?', options: ['Extract Transform Load', 'Edit Test Learn', 'Enter Type Leave'], correct: 0 },
                    { q: 'למה לנקות נתונים?', options: ['לשפר איכות', 'לחסוך מקום', 'לא צריך'], correct: 0 }
                ],
                class_assignment: { title: 'זיהוי נתונים', desc: 'נתחו dataset וזהו סוגי נתונים' },
                homework: { title: 'איסוף נתונים', desc: 'אספו נתונים מ-3 מקורות שונים' }
            },
            {
                title: 'Excel מתקדם לניתוח',
                description: 'פונקציות מתקדמות, Pivot Tables, גרפים, ניתוח What-If.',
                objectives: '1. שליטה בפונקציות.\n2. יצירת Pivot.\n3. ויזואליזציה.',
                topics: ['VLOOKUP/XLOOKUP', 'Pivot Tables', 'Charts', 'What-If'],
                guides: ['excel_student.html', 'data_analysis_guide.html'],
                teacher_notes: 'להכין קובץ Excel לתרגול.',
                quiz_questions: [
                    { q: 'מהו VLOOKUP?', options: ['חיפוש אנכי', 'חיפוש אופקי', 'סכום'], correct: 0 },
                    { q: 'מהו Pivot Table?', options: ['טבלת סיכום דינמית', 'גרף', 'נוסחה'], correct: 0 },
                    { q: 'מהו SUMIF?', options: ['סכום מותנה', 'סכום רגיל', 'ממוצע'], correct: 0 },
                    { q: 'מהו Conditional Formatting?', options: ['עיצוב מותנה', 'גרף', 'נוסחה'], correct: 0 },
                    { q: 'מהו Data Validation?', options: ['אימות קלט', 'גרף', 'נוסחה'], correct: 0 }
                ],
                class_assignment: { title: 'Pivot Table', desc: 'צרו Pivot Table מנתוני מכירות' },
                homework: { title: 'דשבורד Excel', desc: 'בנו דשבורד עם גרפים ו-Pivot' }
            },
            {
                title: 'Python לניתוח - NumPy ו-Pandas',
                description: 'מבוא ל-NumPy ו-Pandas, DataFrame, Series, פעולות בסיסיות.',
                objectives: '1. עבודה עם NumPy.\n2. יצירת DataFrame.\n3. פעולות בסיסיות.',
                topics: ['NumPy arrays', 'Pandas DataFrame', 'Series', 'Basic operations'],
                guides: ['python_guide.html', 'data_analysis_guide.html'],
                teacher_notes: 'להכין Jupyter Notebook.',
                quiz_questions: [
                    { q: 'מהו NumPy?', options: ['ספרייה למערכים', 'שפת תכנות', 'מסד נתונים'], correct: 0 },
                    { q: 'מהו DataFrame?', options: ['טבלה דו-ממדית', 'רשימה', 'מספר'], correct: 0 },
                    { q: 'מהו Series?', options: ['עמודה אחת', 'טבלה', 'מספר'], correct: 0 },
                    { q: 'איך קוראים CSV?', options: ['pd.read_csv()', 'pd.load()', 'pd.open()'], correct: 0 },
                    { q: 'מהו index?', options: ['מזהה שורה', 'עמודה', 'ערך'], correct: 0 }
                ],
                class_assignment: { title: 'DataFrame ראשון', desc: 'טענו CSV וחקרו את הנתונים' },
                homework: { title: 'ניתוח בסיסי', desc: 'בצעו ניתוח בסיסי על dataset' }
            },
            {
                title: 'ניקוי ועיבוד נתונים',
                description: 'טיפול בערכים חסרים, חריגים, טרנספורמציות, מיזוג נתונים.',
                objectives: '1. זיהוי בעיות בנתונים.\n2. טיפול בחסרים.\n3. מיזוג datasets.',
                topics: ['Missing values', 'Outliers', 'Transformations', 'Merge/Join'],
                guides: ['data_analysis_guide.html', 'python_guide.html'],
                teacher_notes: 'להכין dataset עם בעיות.',
                quiz_questions: [
                    { q: 'מהו NaN?', options: ['ערך חסר', 'מספר', 'טקסט'], correct: 0 },
                    { q: 'איך מטפלים בחסרים?', options: ['fillna או dropna', 'מתעלמים', 'מוחקים הכל'], correct: 0 },
                    { q: 'מהו Outlier?', options: ['ערך חריג', 'ערך רגיל', 'ערך חסר'], correct: 0 },
                    { q: 'מהו merge?', options: ['מיזוג טבלאות', 'מחיקה', 'סינון'], correct: 0 },
                    { q: 'מהו groupby?', options: ['קיבוץ לפי עמודה', 'מיון', 'סינון'], correct: 0 }
                ],
                class_assignment: { title: 'ניקוי נתונים', desc: 'נקו dataset עם בעיות' },
                homework: { title: 'מיזוג datasets', desc: 'מזגו 2 datasets ונקו' }
            },
            {
                title: 'ויזואליזציה עם Matplotlib ו-Seaborn',
                description: 'יצירת גרפים, התאמה אישית, Seaborn לגרפים סטטיסטיים.',
                objectives: '1. יצירת גרפים בסיסיים.\n2. התאמה אישית.\n3. גרפים סטטיסטיים.',
                topics: ['Matplotlib', 'Seaborn', 'Chart types', 'Customization'],
                guides: ['data_analysis_guide.html', 'python_guide.html'],
                teacher_notes: 'להדגיש בחירת גרף מתאים.',
                quiz_questions: [
                    { q: 'מתי להשתמש בגרף עמודות?', options: ['השוואת קטגוריות', 'מגמה בזמן', 'התפלגות'], correct: 0 },
                    { q: 'מתי להשתמש בגרף קו?', options: ['מגמה בזמן', 'השוואת קטגוריות', 'יחסים'], correct: 0 },
                    { q: 'מהו Histogram?', options: ['התפלגות', 'השוואה', 'מגמה'], correct: 0 },
                    { q: 'מהו Scatter plot?', options: ['קשר בין משתנים', 'התפלגות', 'השוואה'], correct: 0 },
                    { q: 'מהו Heatmap?', options: ['מפת חום', 'גרף קו', 'עוגה'], correct: 0 }
                ],
                class_assignment: { title: 'גרפים', desc: 'צרו 5 סוגי גרפים שונים' },
                homework: { title: 'דוח ויזואלי', desc: 'צרו דוח עם 10 גרפים' }
            },
            {
                title: 'סטטיסטיקה תיאורית',
                description: 'מדדי מרכז ופיזור, התפלגויות, קורלציה.',
                objectives: '1. חישוב מדדים סטטיסטיים.\n2. הבנת התפלגויות.\n3. ניתוח קורלציה.',
                topics: ['Mean/Median/Mode', 'Standard Deviation', 'Correlation', 'Distribution'],
                guides: ['data_analysis_guide.html'],
                teacher_notes: 'להסביר משמעות המדדים.',
                quiz_questions: [
                    { q: 'מהו ממוצע?', options: ['סכום חלקי מספר', 'הערך האמצעי', 'הערך הנפוץ'], correct: 0 },
                    { q: 'מהו חציון?', options: ['הערך האמצעי', 'הממוצע', 'הערך הנפוץ'], correct: 0 },
                    { q: 'מהי סטיית תקן?', options: ['מדד פיזור', 'מדד מרכז', 'מדד מיקום'], correct: 0 },
                    { q: 'מהי קורלציה?', options: ['קשר בין משתנים', 'ממוצע', 'סכום'], correct: 0 },
                    { q: 'מהי התפלגות נורמלית?', options: ['פעמון', 'קו ישר', 'עיגול'], correct: 0 }
                ],
                class_assignment: { title: 'ניתוח סטטיסטי', desc: 'חשבו מדדים סטטיסטיים ל-dataset' },
                homework: { title: 'דוח סטטיסטי', desc: 'כתבו דוח עם כל המדדים' }
            },
            {
                title: 'Power BI - יסודות',
                description: 'מבוא ל-Power BI, ייבוא נתונים, יצירת דשבורדים.',
                objectives: '1. התקנת Power BI.\n2. ייבוא נתונים.\n3. יצירת דשבורד.',
                topics: ['Power BI Desktop', 'Data Import', 'Visualizations', 'Dashboard'],
                guides: ['powerbi_guide.html', 'data_analysis_guide.html'],
                teacher_notes: 'לוודא שלכולם מותקן Power BI.',
                quiz_questions: [
                    { q: 'מהו Power BI?', options: ['כלי BI', 'שפת תכנות', 'מסד נתונים'], correct: 0 },
                    { q: 'מהו DAX?', options: ['שפת נוסחאות', 'שפת תכנות', 'מסד נתונים'], correct: 0 },
                    { q: 'מהו Measure?', options: ['חישוב דינמי', 'עמודה', 'טבלה'], correct: 0 },
                    { q: 'מהו Slicer?', options: ['מסנן אינטראקטיבי', 'גרף', 'טבלה'], correct: 0 },
                    { q: 'מהו Report?', options: ['דוח ויזואלי', 'קוד', 'נתונים'], correct: 0 }
                ],
                class_assignment: { title: 'דשבורד ראשון', desc: 'צרו דשבורד עם 5 ויזואליזציות' },
                homework: { title: 'דשבורד מכירות', desc: 'בנו דשבורד מכירות מלא' }
            },
            {
                title: 'Power BI - DAX מתקדם',
                description: 'נוסחאות DAX מתקדמות, Measures, Calculated Columns, Time Intelligence.',
                objectives: '1. כתיבת DAX.\n2. יצירת Measures.\n3. Time Intelligence.',
                topics: ['DAX Functions', 'Measures', 'Calculated Columns', 'Time Intelligence'],
                guides: ['powerbi_guide.html'],
                teacher_notes: 'להכין דוגמאות DAX.',
                quiz_questions: [
                    { q: 'מהו CALCULATE?', options: ['שינוי הקשר', 'סכום', 'ממוצע'], correct: 0 },
                    { q: 'מהו SUMX?', options: ['סכום איטרטיבי', 'סכום רגיל', 'ממוצע'], correct: 0 },
                    { q: 'מהו FILTER?', options: ['סינון טבלה', 'סכום', 'ממוצע'], correct: 0 },
                    { q: 'מהו YTD?', options: ['Year to Date', 'Yesterday', 'Your Total Data'], correct: 0 },
                    { q: 'מהו RELATED?', options: ['שליפה מטבלה קשורה', 'סכום', 'ממוצע'], correct: 0 }
                ],
                class_assignment: { title: 'Measures', desc: 'צרו 10 Measures שימושיים' },
                homework: { title: 'Time Intelligence', desc: 'הוסיפו חישובי זמן לדשבורד' }
            },
            {
                title: 'SQL לניתוח נתונים',
                description: 'שאילתות SQL מתקדמות, JOINs, Aggregations, Subqueries.',
                objectives: '1. כתיבת שאילתות.\n2. שימוש ב-JOINs.\n3. Aggregations.',
                topics: ['SELECT', 'JOIN', 'GROUP BY', 'Subqueries'],
                guides: ['sql_guide.html', 'data_analysis_guide.html'],
                teacher_notes: 'להכין מסד נתונים לתרגול.',
                quiz_questions: [
                    { q: 'מהו JOIN?', options: ['חיבור טבלאות', 'סינון', 'מיון'], correct: 0 },
                    { q: 'מהו GROUP BY?', options: ['קיבוץ', 'מיון', 'סינון'], correct: 0 },
                    { q: 'מהו HAVING?', options: ['סינון אחרי קיבוץ', 'סינון לפני', 'מיון'], correct: 0 },
                    { q: 'מהו LEFT JOIN?', options: ['כל השמאלית + התאמות', 'רק התאמות', 'הכל'], correct: 0 },
                    { q: 'מהו Subquery?', options: ['שאילתה בתוך שאילתה', 'שאילתה רגילה', 'פונקציה'], correct: 0 }
                ],
                class_assignment: { title: 'שאילתות', desc: 'כתבו 10 שאילתות מורכבות' },
                homework: { title: 'דוח SQL', desc: 'צרו דוח מלא עם SQL' }
            },
            {
                title: 'פרויקט גמר - ניתוח מקיף',
                description: 'פרויקט ניתוח נתונים מקיף. איסוף, ניקוי, ניתוח, ויזואליזציה, הצגה.',
                objectives: '1. ביצוע ניתוח מקיף.\n2. יצירת דשבורד.\n3. הצגת תובנות.',
                topics: ['End-to-end Analysis', 'Dashboard', 'Presentation'],
                guides: ['data_analysis_guide.html', 'powerbi_guide.html', 'cv_guide.html'],
                teacher_notes: 'להכין משוב לכל תלמיד.',
                quiz_questions: [
                    { q: 'מה חשוב בניתוח?', options: ['תובנות אקשנביליות', 'גרפים יפים', 'הרבה נתונים'], correct: 0 },
                    { q: 'מהו KPI?', options: ['מדד ביצוע', 'גרף', 'טבלה'], correct: 0 },
                    { q: 'למה Storytelling?', options: ['להעביר מסר', 'ליופי', 'לא צריך'], correct: 0 },
                    { q: 'מה לכלול בדשבורד?', options: ['KPIs ומגמות', 'הכל', 'רק גרפים'], correct: 0 },
                    { q: 'איך להציג תובנות?', options: ['ברור ופשוט', 'מורכב', 'ארוך'], correct: 0 }
                ],
                class_assignment: { title: 'הצגת פרויקט', desc: 'הציגו את הפרויקט שלכם' },
                homework: { title: 'תיעוד', desc: 'כתבו דוח מסכם' }
            }
        ]
    }
};


// Available guides from bdnhost.net/Resources
const AVAILABLE_GUIDES = [
    { id: 'ai_basics.html', name: 'יסודות AI' },
    { id: 'chatgpt_guide.html', name: 'מדריך ChatGPT' },
    { id: 'python_guide.html', name: 'מדריך Python' },
    { id: 'prompt-engineering-guide.html', name: 'הנדסת פרומפטים' },
    { id: 'data_analysis_guide.html', name: 'ניתוח נתונים' },
    { id: 'excel_student.html', name: 'Excel' },
    { id: 'powerbi_guide.html', name: 'Power BI' },
    { id: 'sql_guide.html', name: 'SQL' },
    { id: 'github_guide.html', name: 'GitHub' },
    { id: 'terminal_guide.html', name: 'Terminal' },
    { id: 'web_scraping_guide.html', name: 'Web Scraping' },
    { id: 'iot_guide.html', name: 'IoT' },
    { id: 'ui_ux_guide.html', name: 'UI/UX' },
    { id: 'docker-usage-guide.html', name: 'Docker' },
    { id: 'understanding-llms-how-it-works.html', name: 'הבנת LLMs' },
    { id: 'prompts.html', name: 'ספריית פרומפטים' },
    { id: 'cv_guide.html', name: 'קורות חיים' },
    { id: 'career_prep.html', name: 'הכנה לקריירה' },
    { id: 'algorithmic_thinking.html', name: 'חשיבה אלגוריתמית' }
];

const DAYS_OF_WEEK = [
    { value: 'Sunday', label: 'ראשון', he: 'ראשון' },
    { value: 'Monday', label: 'שני', he: 'שני' },
    { value: 'Tuesday', label: 'שלישי', he: 'שלישי' },
    { value: 'Wednesday', label: 'רביעי', he: 'רביעי' },
    { value: 'Thursday', label: 'חמישי', he: 'חמישי' },
    { value: 'Friday', label: 'שישי', he: 'שישי' }
];

const MATERIAL_TYPES = [
    { value: 'presentation', label: 'מצגת' },
    { value: 'document', label: 'מסמך' },
    { value: 'video', label: 'וידאו' },
    { value: 'link', label: 'קישור' },
    { value: 'code', label: 'קוד' }
];

interface SessionData {
    title: string;
    description: string;
    objectives: string;
    topics: string[];
    guides: string[];
    teacher_notes: string;
    quiz_questions: { q: string; options: string[]; correct: number }[];
    class_assignment: { title: string; desc: string };
    homework: { title: string; desc: string };
}

interface CourseFormData {
    name: string;
    code: string;
    description: string;
    institution: string;
    semester: string;
    year: string;
    startDate: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    totalSessions: number;
    room: string;
    template: string;
    color: string;
    attendanceThreshold: number;
    sessions: SessionData[];
    generateQuizzes: boolean;
    generateClassAssignments: boolean;
    generateHomework: boolean;
    generateMaterials: boolean;
    generateAnnouncements: boolean;
    generateProject: boolean;
}

const initialFormData: CourseFormData = {
    name: '',
    code: '',
    description: '',
    institution: '',
    semester: 'סמסטר א',
    year: '2025',
    startDate: '',
    dayOfWeek: 'Tuesday',
    startTime: '17:00',
    endTime: '20:30',
    totalSessions: 10,
    room: '',
    template: '',
    color: 'from-purple-600 via-pink-600 to-red-600',
    attendanceThreshold: 80,
    sessions: [],
    generateQuizzes: true,
    generateClassAssignments: true,
    generateHomework: true,
    generateMaterials: true,
    generateAnnouncements: true,
    generateProject: true
};

// Helper: Calculate session dates
function calculateSessionDates(startDate: string, dayOfWeek: string, count: number): string[] {
    const dates: string[] = [];
    if (!startDate || count <= 0) {
        // Return placeholder dates if no start date
        const today = new Date();
        for (let i = 0; i < Math.max(count, 1); i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + (i * 7));
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }
    const dayMap: Record<string, number> = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
        // Invalid date, return today-based dates
        const today = new Date();
        for (let i = 0; i < count; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + (i * 7));
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }
    const targetDay = dayMap[dayOfWeek] ?? 2; // Default to Tuesday
    let current = new Date(start);
    while (current.getDay() !== targetDay) {
        current.setDate(current.getDate() + 1);
    }
    for (let i = 0; i < count; i++) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 7);
    }
    return dates;
}

// Helper: Add days to date
function addDays(dateStr: string, days: number): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Main component
export default function CourseGenerator() {
    const [formData, setFormData] = useState<CourseFormData>(initialFormData);
    const [generatedJson, setGeneratedJson] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'basic' | 'sessions' | 'options' | 'preview'>('basic');
    const [editingSession, setEditingSession] = useState<number | null>(null);

    // Apply template
    const applyTemplate = useCallback((templateKey: string) => {
        const template = COURSE_TEMPLATES[templateKey as keyof typeof COURSE_TEMPLATES];
        if (!template) return;

        const sessions: SessionData[] = template.sessions.map((s) => ({
            title: s.title,
            description: s.description,
            objectives: s.objectives,
            topics: s.topics,
            guides: s.guides,
            teacher_notes: s.teacher_notes,
            quiz_questions: s.quiz_questions,
            class_assignment: s.class_assignment,
            homework: s.homework
        }));

        setFormData(prev => ({
            ...prev,
            template: templateKey,
            sessions,
            totalSessions: sessions.length,
            color: template.color
        }));
    }, []);

    const updateField = (field: keyof CourseFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateSession = (index: number, field: keyof SessionData, value: any) => {
        setFormData(prev => {
            const newSessions = [...prev.sessions];
            newSessions[index] = { ...newSessions[index], [field]: value };
            return { ...prev, sessions: newSessions };
        });
    };

    const addSession = () => {
        const newSession: SessionData = {
            title: `מפגש ${formData.sessions.length + 1}`,
            description: '',
            objectives: '',
            topics: [],
            guides: [],
            teacher_notes: '',
            quiz_questions: [],
            class_assignment: { title: '', desc: '' },
            homework: { title: '', desc: '' }
        };
        setFormData(prev => ({
            ...prev,
            sessions: [...prev.sessions, newSession],
            totalSessions: prev.totalSessions + 1
        }));
    };

    const removeSession = (index: number) => {
        setFormData(prev => ({
            ...prev,
            sessions: prev.sessions.filter((_, i) => i !== index),
            totalSessions: prev.totalSessions - 1
        }));
    };

    // Generate the full course JSON with all parameters
    const generateCourse = useCallback(() => {
        const sessionDates = calculateSessionDates(formData.startDate, formData.dayOfWeek, formData.totalSessions);
        const dayHe = DAYS_OF_WEEK.find(d => d.value === formData.dayOfWeek)?.he || '';
        const startParts = formData.startTime.split(':').map(Number);
        const endParts = formData.endTime.split(':').map(Number);
        const durationHours = (endParts[0] + endParts[1] / 60) - (startParts[0] + startParts[1] / 60);

        // Build sessions array
        const sessions = formData.sessions.map((s, i) => ({
            temp_id: `s${i + 1}`,
            session_number: i + 1,
            title: s.title,
            description: s.description,
            objectives: s.objectives,
            date: sessionDates[i],
            start_time: formData.startTime,
            end_time: formData.endTime,
            duration_hours: durationHours,
            location: formData.room,
            video_conference_link: `https://zoom.us/j/${formData.code}-session${i + 1}`,
            teacher_notes: s.teacher_notes,
            status: 'planned',
            resource_links: s.guides.map(g => ({
                title: AVAILABLE_GUIDES.find(ag => ag.id === g)?.name || g,
                url: `https://bdnhost.net/Resources/${g}`
            }))
        }));

        // Build assignments array
        const assignments: any[] = [];

        formData.sessions.forEach((session, i) => {
            const sessionId = `s${i + 1}`;
            const sessionDate = sessionDates[i];
            const nextDate = sessionDates[i + 1] || addDays(sessionDate, 7);

            // Quiz with full questions
            if (formData.generateQuizzes && session.quiz_questions.length > 0) {
                assignments.push({
                    title: `בוחן מפגש ${i + 1}: ${session.title}`,
                    description: `בוחן קצר לבדיקת הבנת החומר של מפגש ${i + 1}: ${session.title}`,
                    type: 'quiz',
                    session_temp_id: sessionId,
                    due_date: sessionDate,
                    max_score: 100,
                    weight: 5,
                    content_data: {
                        time_limit: 10,
                        questions: session.quiz_questions.map(q => ({
                            question: q.q,
                            options: q.options,
                            correct: q.correct
                        }))
                    }
                });
            }

            // Class assignment with rubric
            if (formData.generateClassAssignments && session.class_assignment.title) {
                assignments.push({
                    title: `תרגול בכיתה ${i + 1}: ${session.class_assignment.title}`,
                    description: session.class_assignment.desc,
                    type: 'assignment',
                    session_temp_id: sessionId,
                    due_date: sessionDate,
                    max_score: 100,
                    weight: 0,
                    key_concepts: session.topics.slice(0, 3).map(t => ({
                        term: t,
                        definition: `מושג מרכזי במפגש ${i + 1}`
                    }))
                });
            }

            // Homework with rubric
            if (formData.generateHomework && session.homework.title && i < formData.sessions.length - 1) {
                assignments.push({
                    title: `שיעורי בית ${i + 1}: ${session.homework.title}`,
                    description: session.homework.desc,
                    type: 'assignment',
                    session_temp_id: sessionId,
                    due_date: nextDate,
                    max_score: 100,
                    weight: 10,
                    rubric: {
                        name: `מחוון שיעורי בית ${i + 1}`,
                        criteria: [
                            { title: 'שלמות', description: 'כל הדרישות מולאו', max_points: 40 },
                            { title: 'נכונות', description: 'התוצאות נכונות', max_points: 40 },
                            { title: 'איכות', description: 'עבודה מסודרת ומתועדת', max_points: 20 }
                        ]
                    }
                });
            }
        });

        // Final project with milestones
        if (formData.generateProject && formData.sessions.length > 0) {
            const lastDate = sessionDates[sessionDates.length - 1];
            const midDate = sessionDates[Math.floor(sessionDates.length * 0.6)] || lastDate;
            const lateDate = sessionDates[Math.floor(sessionDates.length * 0.8)] || lastDate;

            assignments.push({
                title: `פרויקט גמר: ${formData.name}`,
                description: `פרויקט מסכם המשלב את כל החומר הנלמד בקורס ${formData.name}. הפרויקט יוצג במפגש האחרון.`,
                type: 'project',
                session_temp_id: `s${formData.sessions.length}`,
                due_date: lastDate,
                max_score: 100,
                weight: 30,
                content_data: {
                    milestones: [
                        { title: 'הגדרת הפרויקט ואישור נושא', deadline: midDate },
                        { title: 'פיתוח ובדיקות', deadline: lateDate },
                        { title: 'הגשה סופית והצגה', deadline: lastDate }
                    ]
                },
                resource_links: ['https://bdnhost.net/Resources/github_guide.html'],
                rubric: {
                    name: 'מחוון פרויקט גמר',
                    criteria: [
                        { title: 'פונקציונליות', description: 'הפרויקט עובד לפי הדרישות', max_points: 30 },
                        { title: 'יישום החומר הנלמד', description: 'שימוש נכון בטכניקות מהקורס', max_points: 25 },
                        { title: 'איכות קוד/עבודה', description: 'קוד נקי, מתועד ומאורגן', max_points: 20 },
                        { title: 'תיעוד', description: 'README מפורט והוראות', max_points: 15 },
                        { title: 'הצגה', description: 'הצגה ברורה ומקצועית', max_points: 10 }
                    ]
                }
            });
        }

        // Build materials array
        const materials: any[] = [];

        if (formData.generateMaterials) {
            // Global materials
            materials.push({
                title: 'מאגר המדריכים של הקורס',
                description: 'כל המדריכים המקוונים הרלוונטיים לקורס',
                type: 'link',
                file_url: 'https://bdnhost.net/Resources/',
                course_global: true
            });

            // Session-specific materials
            formData.sessions.forEach((session, i) => {
                // Presentation placeholder
                materials.push({
                    title: `מצגת מפגש ${i + 1}: ${session.title}`,
                    description: `שקופיות השיעור למפגש ${i + 1}`,
                    type: 'presentation',
                    file_url: `https://example.com/presentations/session${i + 1}.pdf`,
                    session_temp_id: `s${i + 1}`
                });

                // Guide links
                session.guides.forEach(guide => {
                    materials.push({
                        title: AVAILABLE_GUIDES.find(g => g.id === guide)?.name || guide,
                        description: `מדריך מקוון למפגש ${i + 1}`,
                        type: 'link',
                        file_url: `https://bdnhost.net/Resources/${guide}`,
                        session_temp_id: `s${i + 1}`
                    });
                });
            });
        }

        // Build announcements array
        const announcements: any[] = [];

        if (formData.generateAnnouncements) {
            // Welcome announcement
            announcements.push({
                title: `ברוכים הבאים לקורס ${formData.name}!`,
                content: `מתרגשים להתחיל! הקורס יתקיים בימי ${dayHe} בשעות ${formData.startTime}-${formData.endTime} ב${formData.room}. נא להגיע עם מחשבים ניידים.`,
                priority: 'high',
                session_temp_id: 's1'
            });

            // Mid-course announcement
            if (formData.sessions.length >= 5) {
                announcements.push({
                    title: 'אמצע הקורס - סיכום ביניים',
                    content: 'הגענו לאמצע הקורס! זה הזמן לסכם את מה שלמדנו ולהתחיל לחשוב על פרויקט הגמר.',
                    priority: 'normal',
                    session_temp_id: `s${Math.floor(formData.sessions.length / 2)}`
                });
            }

            // Project announcement
            if (formData.generateProject) {
                announcements.push({
                    title: 'תזכורת: פרויקט גמר',
                    content: 'אל תשכחו להתחיל לעבוד על פרויקט הגמר! יש להגיש הצעת נושא עד המפגש הבא.',
                    priority: 'high',
                    session_temp_id: `s${Math.floor(formData.sessions.length * 0.6)}`
                });
            }

            // Tips announcements
            formData.sessions.slice(0, 5).forEach((session, i) => {
                if (session.guides.length > 0) {
                    const guide = AVAILABLE_GUIDES.find(g => g.id === session.guides[0]);
                    announcements.push({
                        title: `טיפ למפגש ${i + 1}: ${guide?.name || 'מדריך מומלץ'}`,
                        content: `לקראת המפגש, מומלץ לעיין במדריך: https://bdnhost.net/Resources/${session.guides[0]}`,
                        priority: 'normal',
                        session_temp_id: `s${i + 1}`
                    });
                }
            });
        }

        // Build final course object
        const course = {
            _DOCUMENTATION: {
                title: formData.name,
                version: '1.0',
                created: new Date().toISOString().split('T')[0],
                overview: formData.description,
                total_sessions: formData.totalSessions,
                hours_per_session: durationHours,
                total_hours: durationHours * formData.totalSessions,
                course_dates: `${sessionDates[0]} - ${sessionDates[sessionDates.length - 1]}, ימי ${dayHe}`,
                created_by: 'Course Generator - EduGen',
                resource_hub: 'https://bdnhost.net/Resources/',
                entities_guide: {
                    sessions: `${sessions.length} מפגשים`,
                    assignments: `${assignments.length} מטלות (${assignments.filter(a => a.type === 'quiz').length} בחנים, ${assignments.filter(a => a.type === 'assignment').length} תרגילים, ${assignments.filter(a => a.type === 'project').length} פרויקטים)`,
                    materials: `${materials.length} חומרי לימוד`,
                    announcements: `${announcements.length} הודעות`
                }
            },
            course: {
                name: formData.name,
                code: formData.code,
                description: formData.description,
                institution: formData.institution,
                semester: formData.semester,
                year: formData.year,
                start_date: formData.startDate,
                day_of_week: dayHe,
                start_time: formData.startTime,
                end_time: formData.endTime,
                total_sessions: formData.totalSessions,
                total_hours: durationHours * formData.totalSessions,
                weekly_hours: durationHours,
                room: formData.room,
                status: 'active',
                attendance_threshold: formData.attendanceThreshold,
                color: formData.color,
                allow_self_registration: true
            },
            schedule: {
                recurrence_type: 'weekly',
                days_of_week: [formData.dayOfWeek],
                start_time: formData.startTime,
                end_time: formData.endTime,
                start_date: formData.startDate,
                location: formData.room
            },
            sessions,
            assignments,
            materials,
            announcements
        };

        const json = JSON.stringify(course, null, 2);
        setGeneratedJson(json);
        setActiveTab('preview');
    }, [formData]);

    const downloadJson = () => {
        const blob = new Blob([generatedJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `course_${formData.code || 'new'}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedJson);
        alert('הועתק ללוח!');
    };

    // Calculate stats for preview
    const getStats = () => {
        if (!generatedJson) return null;
        try {
            const data = JSON.parse(generatedJson);
            return {
                sessions: data.sessions?.length || 0,
                quizzes: data.assignments?.filter((a: any) => a.type === 'quiz').length || 0,
                assignments: data.assignments?.filter((a: any) => a.type === 'assignment').length || 0,
                projects: data.assignments?.filter((a: any) => a.type === 'project').length || 0,
                materials: data.materials?.length || 0,
                announcements: data.announcements?.length || 0,
                totalHours: data.course?.total_hours || 0
            };
        } catch { return null; }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🎓 גנרטור קורסים מתקדם</h1>
                    <p className="text-white/60">צור קורסים מלאים עם מטלות, בחנים, חומרי לימוד והודעות</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {[
                        { id: 'basic', label: '📋 פרטי קורס', icon: '1' },
                        { id: 'sessions', label: '📚 מפגשים', icon: '2' },
                        { id: 'options', label: '⚙️ אפשרויות', icon: '3' },
                        { id: 'preview', label: '👁️ תצוגה מקדימה', icon: '4' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            <span className="hidden md:inline">{tab.label}</span>
                            <span className="md:hidden">{tab.icon}</span>
                        </button>
                    ))}
                </div>

                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 space-y-6">
                        {/* Template Selection */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4">
                            <label className="block text-white font-medium mb-3">🎯 בחר תבנית קורס מוכנה</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {Object.entries(COURSE_TEMPLATES).map(([key, template]) => (
                                    <button
                                        key={key}
                                        onClick={() => applyTemplate(key)}
                                        className={`p-4 rounded-xl text-right transition-all border-2 ${formData.template === key
                                            ? 'border-purple-400 bg-purple-600/30 shadow-lg'
                                            : 'border-transparent bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <div className="font-bold text-white text-lg">{template.name}</div>
                                        <div className="text-white/70 text-sm mt-1">{template.sessions.length} מפגשים מלאים</div>
                                        <div className="text-white/50 text-xs mt-2">כולל בחנים, מטלות ומדריכים</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Course Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 mb-1">שם הקורס *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => updateField('name', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40"
                                    placeholder="לדוגמה: בינה מלאכותית למהנדסים"
                                    aria-label="שם הקורס"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-1">קוד קורס *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={e => updateField('code', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40"
                                    placeholder="לדוגמה: AI-2025"
                                    aria-label="קוד קורס"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/80 mb-1">תיאור הקורס</label>
                            <textarea
                                value={formData.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 h-24"
                                placeholder="תיאור מפורט של הקורס, מטרות ויעדים..."
                                aria-label="תיאור הקורס"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-white/80 mb-1">מוסד לימודים</label>
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={e => updateField('institution', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                    placeholder="שם המוסד"
                                    aria-label="מוסד לימודים"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 mb-1">סמסטר</label>
                                <select
                                    value={formData.semester}
                                    onChange={e => updateField('semester', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                    aria-label="סמסטר"
                                >
                                    <option value="סמסטר א">סמסטר א</option>
                                    <option value="סמסטר ב">סמסטר ב</option>
                                    <option value="קיץ">קיץ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/80 mb-1">שנה</label>
                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={e => updateField('year', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                    aria-label="שנה"
                                />
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="bg-blue-500/20 rounded-xl p-4">
                            <h3 className="text-white font-medium mb-4 text-lg">📅 לוח זמנים</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-white/80 mb-1">תאריך התחלה *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => updateField('startDate', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        aria-label="תאריך התחלה"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-1">יום בשבוע *</label>
                                    <select
                                        value={formData.dayOfWeek}
                                        onChange={e => updateField('dayOfWeek', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        aria-label="יום בשבוע"
                                    >
                                        {DAYS_OF_WEEK.map(day => (
                                            <option key={day.value} value={day.value}>{day.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-1">שעת התחלה</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => updateField('startTime', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        aria-label="שעת התחלה"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-1">שעת סיום</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={e => updateField('endTime', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        aria-label="שעת סיום"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-white/80 mb-1">מספר מפגשים</label>
                                    <input
                                        type="number"
                                        value={formData.totalSessions}
                                        onChange={e => updateField('totalSessions', parseInt(e.target.value) || 1)}
                                        min={1}
                                        max={20}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        aria-label="מספר מפגשים"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-1">חדר/מיקום</label>
                                    <input
                                        type="text"
                                        value={formData.room}
                                        onChange={e => updateField('room', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        placeholder="מעבדת מחשבים 2"
                                        aria-label="חדר או מיקום"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/80 mb-1">אחוז נוכחות מינימלי</label>
                                    <input
                                        type="number"
                                        value={formData.attendanceThreshold}
                                        onChange={e => updateField('attendanceThreshold', parseInt(e.target.value) || 80)}
                                        min={0}
                                        max={100}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                        aria-label="אחוז נוכחות"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveTab('sessions')}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-medium transition-all shadow-lg"
                        >
                            המשך לעריכת מפגשים ←
                        </button>
                    </div>
                )}

                {/* Sessions Tab */}
                {activeTab === 'sessions' && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                            <h2 className="text-xl font-bold text-white">📚 עריכת מפגשים ({formData.sessions.length})</h2>
                            <button
                                onClick={addSession}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <span>+</span> הוסף מפגש
                            </button>
                        </div>

                        {formData.sessions.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-xl">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-white/80 text-lg mb-2">אין מפגשים עדיין</p>
                                <p className="text-white/50">בחר תבנית בלשונית "פרטי קורס" או הוסף מפגשים ידנית</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {formData.sessions.map((session, index) => (
                                    <div
                                        key={index}
                                        className={`bg-white/5 rounded-xl overflow-hidden transition-all ${editingSession === index ? 'ring-2 ring-purple-500' : ''
                                            }`}
                                    >
                                        <div
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => setEditingSession(editingSession === index ? null : index)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <span className="text-white font-medium block">{session.title}</span>
                                                    <span className="text-white/50 text-sm">
                                                        {session.topics.length} נושאים | {session.quiz_questions.length} שאלות בוחן
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeSession(index); }}
                                                    className="text-red-400 hover:text-red-300 p-2"
                                                    title="מחק מפגש"
                                                >
                                                    🗑️
                                                </button>
                                                <span className="text-white/50">{editingSession === index ? '▲' : '▼'}</span>
                                            </div>
                                        </div>

                                        {editingSession === index && (
                                            <div className="p-4 border-t border-white/10 space-y-4 bg-white/5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-white/80 mb-1">כותרת המפגש</label>
                                                        <input
                                                            type="text"
                                                            value={session.title}
                                                            onChange={e => updateSession(index, 'title', e.target.value)}
                                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                                                            aria-label="כותרת המפגש"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-white/80 mb-1">נושאים (מופרדים בפסיק)</label>
                                                        <input
                                                            type="text"
                                                            value={session.topics.join(', ')}
                                                            onChange={e => updateSession(index, 'topics', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                                                            placeholder="נושא 1, נושא 2, נושא 3"
                                                            aria-label="נושאים"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 mb-1">תיאור</label>
                                                    <textarea
                                                        value={session.description}
                                                        onChange={e => updateSession(index, 'description', e.target.value)}
                                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-20"
                                                        aria-label="תיאור המפגש"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 mb-1">מטרות למידה</label>
                                                    <textarea
                                                        value={session.objectives}
                                                        onChange={e => updateSession(index, 'objectives', e.target.value)}
                                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-20"
                                                        placeholder="1. הסטודנט יבין...\n2. הסטודנט יישם..."
                                                        aria-label="מטרות למידה"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-white/80 mb-1">הערות למרצה</label>
                                                    <input
                                                        type="text"
                                                        value={session.teacher_notes}
                                                        onChange={e => updateSession(index, 'teacher_notes', e.target.value)}
                                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                                                        placeholder="הערות והכנות למפגש"
                                                        aria-label="הערות למרצה"
                                                    />
                                                </div>

                                                {/* Guides selection */}
                                                <div>
                                                    <label className="block text-white/80 mb-2">מדריכים מקושרים</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {AVAILABLE_GUIDES.slice(0, 12).map(guide => (
                                                            <label
                                                                key={guide.id}
                                                                className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all ${session.guides.includes(guide.id)
                                                                    ? 'bg-purple-600 text-white'
                                                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={session.guides.includes(guide.id)}
                                                                    onChange={e => {
                                                                        const newGuides = e.target.checked
                                                                            ? [...session.guides, guide.id]
                                                                            : session.guides.filter(g => g !== guide.id);
                                                                        updateSession(index, 'guides', newGuides);
                                                                    }}
                                                                    className="sr-only"
                                                                />
                                                                {guide.name}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Class assignment */}
                                                <div className="bg-green-500/10 rounded-lg p-3">
                                                    <label className="block text-green-300 font-medium mb-2">📝 תרגיל כיתה</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={session.class_assignment.title}
                                                            onChange={e => updateSession(index, 'class_assignment', { ...session.class_assignment, title: e.target.value })}
                                                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                                            placeholder="כותרת התרגיל"
                                                            aria-label="כותרת תרגיל כיתה"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={session.class_assignment.desc}
                                                            onChange={e => updateSession(index, 'class_assignment', { ...session.class_assignment, desc: e.target.value })}
                                                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                                            placeholder="תיאור התרגיל"
                                                            aria-label="תיאור תרגיל כיתה"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Homework */}
                                                <div className="bg-blue-500/10 rounded-lg p-3">
                                                    <label className="block text-blue-300 font-medium mb-2">📚 שיעורי בית</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={session.homework.title}
                                                            onChange={e => updateSession(index, 'homework', { ...session.homework, title: e.target.value })}
                                                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                                            placeholder="כותרת המטלה"
                                                            aria-label="כותרת שיעורי בית"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={session.homework.desc}
                                                            onChange={e => updateSession(index, 'homework', { ...session.homework, desc: e.target.value })}
                                                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                                                            placeholder="תיאור המטלה"
                                                            aria-label="תיאור שיעורי בית"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Quiz questions summary */}
                                                <div className="bg-yellow-500/10 rounded-lg p-3">
                                                    <label className="block text-yellow-300 font-medium mb-2">
                                                        📋 שאלות בוחן ({session.quiz_questions.length} שאלות)
                                                    </label>
                                                    {session.quiz_questions.length > 0 ? (
                                                        <ul className="text-white/70 text-sm space-y-1">
                                                            {session.quiz_questions.slice(0, 3).map((q, qi) => (
                                                                <li key={qi}>• {q.q}</li>
                                                            ))}
                                                            {session.quiz_questions.length > 3 && (
                                                                <li className="text-white/50">...ועוד {session.quiz_questions.length - 3} שאלות</li>
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-white/50 text-sm">אין שאלות בוחן (יווצרו אוטומטית מהנושאים)</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setActiveTab('basic')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
                            >
                                → חזרה
                            </button>
                            <button
                                onClick={() => setActiveTab('options')}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-medium transition-all"
                            >
                                המשך לאפשרויות ←
                            </button>
                        </div>
                    </div>
                )}

                {/* Options Tab */}
                {activeTab === 'options' && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">⚙️ אפשרויות יצירה אוטומטית</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Generation options */}
                            <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                <h3 className="text-white font-medium mb-2">📝 מטלות ובחנים</h3>

                                <label className="flex items-center gap-3 text-white cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={formData.generateQuizzes}
                                        onChange={e => updateField('generateQuizzes', e.target.checked)}
                                        className="w-5 h-5 rounded accent-purple-600"
                                    />
                                    <div>
                                        <span className="block">📋 בחנים לכל מפגש</span>
                                        <span className="text-white/50 text-sm">5 שאלות אמריקאיות לכל מפגש</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 text-white cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={formData.generateClassAssignments}
                                        onChange={e => updateField('generateClassAssignments', e.target.checked)}
                                        className="w-5 h-5 rounded accent-purple-600"
                                    />
                                    <div>
                                        <span className="block">✏️ תרגילי כיתה</span>
                                        <span className="text-white/50 text-sm">תרגול מעשי בכל מפגש</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 text-white cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={formData.generateHomework}
                                        onChange={e => updateField('generateHomework', e.target.checked)}
                                        className="w-5 h-5 rounded accent-purple-600"
                                    />
                                    <div>
                                        <span className="block">📚 שיעורי בית</span>
                                        <span className="text-white/50 text-sm">מטלות עם מחוון הערכה (Rubric)</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 text-white cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={formData.generateProject}
                                        onChange={e => updateField('generateProject', e.target.checked)}
                                        className="w-5 h-5 rounded accent-purple-600"
                                    />
                                    <div>
                                        <span className="block">🎯 פרויקט גמר</span>
                                        <span className="text-white/50 text-sm">כולל אבני דרך ומחוון מפורט</span>
                                    </div>
                                </label>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                <h3 className="text-white font-medium mb-2">📦 תוכן נוסף</h3>

                                <label className="flex items-center gap-3 text-white cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={formData.generateMaterials}
                                        onChange={e => updateField('generateMaterials', e.target.checked)}
                                        className="w-5 h-5 rounded accent-purple-600"
                                    />
                                    <div>
                                        <span className="block">📁 חומרי לימוד</span>
                                        <span className="text-white/50 text-sm">מצגות, מדריכים וקישורים</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 text-white cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                    <input
                                        type="checkbox"
                                        checked={formData.generateAnnouncements}
                                        onChange={e => updateField('generateAnnouncements', e.target.checked)}
                                        className="w-5 h-5 rounded accent-purple-600"
                                    />
                                    <div>
                                        <span className="block">📢 הודעות</span>
                                        <span className="text-white/50 text-sm">הודעות פתיחה, תזכורות וטיפים</span>
                                    </div>
                                </label>

                                <div className="pt-4 border-t border-white/10">
                                    <label className="block text-white/80 mb-2">🎨 צבע הקורס</label>
                                    <select
                                        value={formData.color}
                                        onChange={e => updateField('color', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                                        aria-label="צבע הקורס"
                                    >
                                        <option value="from-purple-600 via-pink-600 to-red-600">סגול-ורוד</option>
                                        <option value="from-blue-600 via-cyan-600 to-teal-600">כחול-טורקיז</option>
                                        <option value="from-green-600 via-emerald-600 to-teal-600">ירוק</option>
                                        <option value="from-orange-600 via-red-600 to-yellow-600">כתום-אדום</option>
                                        <option value="from-indigo-600 via-purple-600 to-pink-600">אינדיגו</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Summary before generation */}
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4">
                            <h3 className="text-white font-medium mb-3">📊 סיכום לפני יצירה</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-white">{formData.sessions.length}</div>
                                    <div className="text-white/60 text-sm">מפגשים</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-white">
                                        {formData.generateQuizzes ? formData.sessions.length : 0}
                                    </div>
                                    <div className="text-white/60 text-sm">בחנים</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-white">
                                        {(formData.generateClassAssignments ? formData.sessions.length : 0) +
                                            (formData.generateHomework ? formData.sessions.length - 1 : 0) +
                                            (formData.generateProject ? 1 : 0)}
                                    </div>
                                    <div className="text-white/60 text-sm">מטלות</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-white">
                                        {formData.generateMaterials ? formData.sessions.length * 2 + 1 : 0}
                                    </div>
                                    <div className="text-white/60 text-sm">חומרים</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('sessions')}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
                            >
                                → חזרה
                            </button>
                            <button
                                onClick={generateCourse}
                                disabled={!formData.name || !formData.startDate || formData.sessions.length === 0}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg text-lg"
                            >
                                🚀 צור קורס מלא!
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                            <h2 className="text-xl font-bold text-white">👁️ תצוגה מקדימה</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!generatedJson}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    📋 העתק
                                </button>
                                <button
                                    onClick={downloadJson}
                                    disabled={!generatedJson}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    💾 הורד JSON
                                </button>
                            </div>
                        </div>

                        {generatedJson ? (
                            <>
                                {/* Stats */}
                                {(() => {
                                    const stats = getStats();
                                    if (!stats) return null;
                                    return (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
                                            {[
                                                { label: 'מפגשים', value: stats.sessions, icon: '📅' },
                                                { label: 'שעות', value: stats.totalHours, icon: '⏱️' },
                                                { label: 'בחנים', value: stats.quizzes, icon: '📋' },
                                                { label: 'תרגילים', value: stats.assignments, icon: '✏️' },
                                                { label: 'פרויקטים', value: stats.projects, icon: '🎯' },
                                                { label: 'חומרים', value: stats.materials, icon: '📁' },
                                                { label: 'הודעות', value: stats.announcements, icon: '📢' }
                                            ].map(stat => (
                                                <div key={stat.label} className="bg-white/5 rounded-lg p-3 text-center">
                                                    <div className="text-2xl mb-1">{stat.icon}</div>
                                                    <div className="text-xl font-bold text-white">{stat.value}</div>
                                                    <div className="text-white/60 text-xs">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* JSON Preview */}
                                <div className="bg-slate-900 rounded-xl p-4 max-h-[50vh] overflow-auto">
                                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap" dir="ltr">
                                        {generatedJson}
                                    </pre>
                                </div>

                                {/* Success message */}
                                <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                                    <div className="text-3xl mb-2">✅</div>
                                    <p className="text-green-300 font-medium">הקורס נוצר בהצלחה!</p>
                                    <p className="text-white/60 text-sm mt-1">לחץ "הורד JSON" לשמירת הקובץ</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16 bg-white/5 rounded-xl">
                                <div className="text-6xl mb-4">📄</div>
                                <p className="text-white/80 text-lg mb-2">לא נוצר קורס עדיין</p>
                                <p className="text-white/50">מלא את הפרטים ולחץ "צור קורס מלא"</p>
                            </div>
                        )}

                        <button
                            onClick={() => setActiveTab('options')}
                            className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
                        >
                            → חזרה לעריכה
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
