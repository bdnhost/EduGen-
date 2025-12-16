# קורס מאסטר-פיס: IoT ואוטומציה למהנדסים

גרסה: 1.0 — נוצר אוטומטית בתאריך 2025-12-15

מטרה כללית:
לספק למהנדסים כלים תאורטיים ומעשיים לתכנון, פיתוח והטמעה של מערכות IoT מאובטחות ומוכוונות מוצר — החל מחיישן בודד ועד פריסת MVP בענן.

פורמט הקורס: 6 מפגשים שבועיים, כל מפגש 5 שעות (סדנאות מעשיות + הרצאה קצרה + בדיקות). רמת עומק: מעשי-בינוני עד מתקדם.

---

## מבנה כולל (קדימון)
- מפגש 1: יסודות, מטרות והגדרת בעיה
- מפגש 2: חומרה, חיווט ורגישות חומרתית
- מפגש 3: פיתוח קושחה מודולרית (Arduino/ESP)
- מפגש 4: איסוף נתונים, עיבוד זמן-אמת ו־dashboard (Python)
- מפגש 5: פרוטוקולים, ניהול מכשירים ואבטחה
- מפגש 6: פרויקט גמר — הצגה, מדידה ומשוב

---

הסגנון הפדגוגי:
- פעילויות מעשיות מבוססות בעיות (PBL)
- הערכת ביצוע על בסיס תוצרים (project-based assessment)
- משוב עמיתים מובנה + code review
- שילוב תרחישי אמת מהתעשייה ומהסביבה המקומית

---

## מפגשים — מה בפנים (Masterclass blueprint)

### s1 — מפגש 1: 🎯 הגדרת מטרות, היקף וסביבת פיתוח (5h)
- Learning Outcomes (measurable):
  1. הסטודנט יוכל להגדיר דרישות מערכת לבעיה מציאותית ולהסביר אילו חיישנים ופרוטוקולים נדרשים.
  2. הסטודנט יקים סביבת פיתוח ויבצע חיבור ראשוני למחשב (USB/Serial).
  3. הסטודנט ייצור מפת דרישות (MVP) ו־success criteria לפרויקט.
- Agenda (timed):
  - 00:00–00:30 — פתיחה, היכרות וציפיות
  - 00:30–01:15 — הרצאה: ארכיטקטורת IoT (edge/cloud/middleware)
  - 01:15–02:30 — Workshop: Problem framing — בונים מפת שימוש ותנאי הצלחה
  - 02:30–03:30 — Lab: התקנת Arduino IDE / PlatformIO + חיבור ובדיקה סיריאלית
  - 03:30–04:30 — Activity: בחירת חיישנים והערכת מגבלות (cost/power/accuracy)
  - 04:30–05:00 — Wrap-up: הגדרת פרויקט אישי/קבוצתי ומשימות להכנה
- Lab steps (concise):
  1. הורדה והתקנה של VS Code + PlatformIO או Arduino IDE
  2. חבר Arduino/ESP ללפטופ, בדוק פורט סיריאלי ב־Device Manager
  3. הרץ sketch דוגמה — קבלת ערכי Serial
- Assessment & Deliverables:
  - קצר: גיליון דרישות MVP (1‑page) + screenshot של serial output
- Resources: quick-start links, USB driver notes, PlatformIO templates

### s2 — מפגש 2: 🛠️ חומרה ועקרונות חיווט (5h)
- Outcomes:
  1. ליישם חיבור נכון לחיישנים אנלוגיים ודיגיטליים ולהבין מושגי ADC, pull-ups ו־debounce.
  2. לזהות מקורות רעש ולהציע מנגנוני קיבול/סינון.
  3. להכין schematic בסיסי ולתעד BOM פשוט.
- Agenda:
  - 00:00–00:30 — Quick recap + Q/A
  - 00:30–02:00 — Lecture+Demo: ADC, sampling, signal conditioning
  - 02:00–04:00 — Lab: חיבור DHT22, LDR, מדידת סיגנל וניתוח רעש
  - 04:00–05:00 — Team task: finalize BOM & take oscilloscope screenshots
- Lab steps:
  1. חיבור DHT22 (Power, Data, Pull-up)
  2. מדידת אות אנלוגי עם multimeter + sampling ב־Arduino
  3. השוואה: raw vs filtered (software rolling average)
- Deliverables: wiring photo, short log file, BOM (CSV)
- Resources: datasheets, Fritzing template, oscilloscope tips

### s3 — מפגש 3: 💾 פיתוח קושחה איכותית (5h)
- Outcomes:
  1. לבנות סקיצת Arduino/ESP מודולרית עם separation of concerns (sensors, comms, core).
  2. להטמיע מנגנון עוצמת הספק וניהול מצבי שינה (power management).
  3. להוסיף logging ו־OTA בסיסי (ESP32) או update flow.
- Agenda:
  - 00:00–00:30 — Code walkthrough: architecture patterns
  - 00:30–02:30 — Lab: modularize sketch, extract sensor interface
  - 02:30–03:30 — Lab: implement basic debounce + power saving
  - 03:30–04:30 — Demo: OTA update (ESP32) / Flash flow
  - 04:30–05:00 — Code review & merge checklist
- Lab steps (high level):
  1. Fork sample repo, implement Sensor class with read(), calibrate()
  2. Add Logger module writing to Serial + optional SD
  3. (ESP) Configure OTA server, test remote update
- Deliverables: repo link + PR, short code review notes
- Resources: PlatformIO templates, GitHub Actions example for CI

### s4 — מפגש 4: 🐍 Python — איסוף נתונים ו־visualization (5h)
- Outcomes:
  1. לבנות pipeline ל־data ingestion מן המכשיר ועד ל־visualization בזמן אמת.
  2. ליישם basic analytics (rolling average, threshold alert) ולשמור נתונים ל־CSV/Influx.
  3. להקים Dashboard פשוט עם Plotly/Grafana.
- Agenda:
  - 00:00–00:30 — Architecture: ingestion → processing → storage → viz
  - 00:30–02:00 — Lab: pyserial reader + parsing protocol
  - 02:00–03:30 — Lab: implement smoothing & event detection + save CSV
  - 03:30–04:30 — Lab: push to MQTT / Influx (optional)
  - 04:30–05:00 — Showcase: each team shows live plot
- Lab steps (concise):
  1. Run `serial_plot.py`, connect to device, verify real-time plot
  2. Implement rolling average window = 5 samples
  3. Save CSV and produce quick dashboard in Plotly
- Deliverables: CSV dataset + short README for reproducibility
- Resources: serial_plot.py, pyserial docs, Grafana docker-compose snippet

### s5 — מפגש 5: 🔗 פרוטוקולים, ניהול ואבטחה (5h)
- Outcomes:
  1. לעצב MQTT topic hierarchy ולהסביר QoS ו־retained messages.
  2. להטמיע TLS/basic cert provisioning ו־token-based auth.
  3. להכין threat model והמלצות mitigation.
- Agenda:
  - 00:00–00:30 — Threat modeling primer
  - 00:30–02:00 — Lab: Mosquitto local + TLS client certs
  - 02:00–03:30 — Demo: secure device provisioning (simulated)
  - 03:30–04:30 — Team exercise: shrink attack surface + checklist
  - 04:30–05:00 — Q/A + compliance notes
- Lab steps:
  1. Setup Mosquitto with self-signed CA (docker-compose)
  2. Generate client cert, configure device to use TLS
  3. Validate connection and test QoS modes
- Deliverables: short threat-model doc + checklist
- Resources: mosquitto TLS guide, JWT provisioning patterns

### s6 — מפגש 6: 📋 פרויקט גמר — דמו, מדידה ומשוב (5h)
- Outcomes:
  1. להציג פרוטוטייפ עובד עם מדדי הצלחה ומדדי שימוש (KPIs).
  2. לבצע peer review ולבסס roadmap להמשך לפיתוח או פריסה.
  3. להגיש deliverables: repo, docs, demo video (≤5min).
- Agenda:
  - 00:00–01:00 — Quick demos (each קבוצה 7–10 דקות)
  - 01:00–02:00 — Peer review + scorecards
  - 02:00–03:30 — Iteration time (apply feedback)
  - 03:30–04:30 — Final show-and-tell + PM pitches
  - 04:30–05:00 — Closing: next steps, deployment, commercialization tips
- Deliverables: final repo + demo video + final report (A4)
- Grading: use rubric (technical correctness, UX, security, documentation, demo)

---

## Rubrics & Assessment (concise)
- Project rubric (total 100): Technical correctness 50, Working demo 20, Security & Reliability 15, Documentation 10, Presentation 5.
- Weekly labs: pass/fail checklist (environment, basic functionality, deliverable uploaded).
- Peer review: 10% of final grade (structured form — clarity, originality, collaboration).

---

## כיווני העמקה ושלבי פריסה
- שילוב Cloud: AWS IoT / Azure IoT Hub pipelines
- CI/CD עבור firmware (PlatformIO + GitHub Actions)
- שוק: סקירה של business model canvas עבור ה-MVP

---

רוצה שאמיין את התכנים כ־slides-outline לכל מפגש, או שאכין תבניות ready-to-use: 1) lab instructions (PDF) 2) rubric CSV לייבוא ל־LMS?