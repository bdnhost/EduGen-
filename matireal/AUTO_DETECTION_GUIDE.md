# 🤖 Auto-Detection & Classification Guide

## מהו זה?

סקריפט חכם שמגלה מדריכים חדשים בפורטל ומסווג אותם **אוטומטית** לקטגוריה הנכונה.

---

## 🚀 איך להשתמש?

### **שלב 1: צור קובץ HTML חדש**

בחר אחד מ-2 דרכים:

#### **אפשרות A: עם סיווג ידני (מומלץ)**

1. העתק את `master_guide_template.html`
2. בתחילת הקובץ, אתה תראה את זה:
   ```html
   <!--
   {
     "guide_metadata": {
       "name": "[שם המדריך]",
       "icon": "[emoji]",
       "category": "[קטגוריה]",
       "description": "[תיאור קצר]"
     }
   }
   -->
   ```
3. **מלא את הפרטים:**
   - `name`: "React Pro - בנייה ליישומים מודרניים"
   - `icon`: "⚛️"
   - `category`: "AI & Automation"
   - `description`: "מדריך לבנייה אפליקציות React עם Hooks"

#### **אפשרות B: בלי סיווג ידני (אוטומטי)**

- פשוט כתוב את המדריך ללא מודיפיקציה ל-JSON
- הסקריפט יחשב את הקטגוריה בעצמו

### **שלב 2: הרץ את האוטו-דטקטור**

```bash
npm run auto
```

זה יעשה:
- 🔍 סורק את כל קבצי ה-HTML בתיקייה
- 📋 קורא JSON metadata אם קיים
- 🤖 מסווג אוטומטית אם אין metadata
- ✅ מעדכן את `categories.html`, `sitemap.html`, `sitemap.xml`

---

## 🎯 קטגוריות זמינות

| Emoji | קטגוריה | תיאור |
|-------|---------|--------|
| 🧠 | AI & Automation | AI, ChatGPT, Machine Learning, Automation, Web Scraping, React, Python |
| 💼 | Career | Career Prep, CV, Presentations, Skills, Professional Development |
| 🎨 | Creative Studio | Design, Canva, Video Editing, Midjourney, UI/UX, Graphics |
| 📊 | Data & Business | Data Analysis, Power BI, Excel, Marketing, SQL, Analytics |
| 📚 | Digital Basics | Terminal, GitHub, Internet, File Management, Fundamentals |
| 🚀 | Technology | Docker, IoT, Automotive, Cloud, DevOps, Infrastructure |

---

## 📊 דוגמה מעשית

### **יצירת מדריך "TypeScript Advanced"**

**קובץ: `typescript-advanced-guide.html`**

```html
<!--
{
  "guide_metadata": {
    "name": "TypeScript Advanced - טיפים למהנדסים",
    "icon": "📘",
    "category": "AI & Automation",
    "description": "טיפים מתקדמים ל-TypeScript עם Generics, Decorators, ו-Advanced Types"
  }
}
-->

<!DOCTYPE html>
<html lang="he" dir="rtl">
...
```

**הרצה:**
```bash
npm run auto
```

**תוצאה:**
- ✅📋 מדריך זוהה כ"סיווג ידני"
- ✅ מופיע בקטגוריה "AI & Automation"
- ✅ מעודכן בקטלוג ובמפת האתר

---

## 🔍 איך הסקריפט עובד?

### **Metadata Priority (סדר עדיפויות)**

1. **JSON Comment בתחילת הקובץ** (אם קיים)
   ```html
   <!-- {"guide_metadata": {...}} -->
   ```
   ✅ משומש אם קיים וחוקי

2. **Auto-Detection** (אם אין JSON)
   - סורק את `title`, `meta description`, `keywords`
   - משווה כנגד keyword mapping בקטגוריות
   - בוחר בקטגוריה עם הניקוד הגבוה ביותר

3. **Default Fallback**
   - אם לא מוצא שום אפילו מסוג, משתמש ב-"Digital Basics"

---

## 🎯 Status Icons בפלט

כשמריצים `npm run auto`, אתה תראה:

```
✅🤖 📖 שם המדריך     (זוהה אוטומטית)
✅📋 ⚛️  React Pro      (סיווג ידני דרך JSON)
```

- **🤖**: Auto-detected (אוטומטי)
- **📋**: Manual JSON metadata (ידני)

---

## 📈 סטטיסטיקה

כל פעם ש-`npm run auto` רץ, אתה תראה:

```
📊 נמצאו 30 מדריכים
📝 יצירת categories.html...
📍 יצירת sitemap.html...
🔗 יצירת sitemap.xml...

📊 סטטיסטיקה:
   📚 סה"כ מדריכים: 30
   🏷️  קטגוריות: 6
      🧠 AI & Automation: 8
      💼 Career: 2
      🎨 Creative Studio: 6
      📊 Data & Business: 5
      📚 Digital Basics: 7
      🚀 Technology: 2
```

---

## ⚠️ חשוב!

- **JSON חייב להיות חוקי** - אם יש שגיאה, הסקריפט חוזר ל-auto-detection
- **קטגוריה חייבת להיות מדויקת** - חייב להיות אחת מ-6 הקטגוריות לעיל
- **Emoji אופציונלי** - אם לא מוגדר, הסקריפט יחפש בכותרת

---

## 🚀 אוטומציה קבוע

אם אתה רוצה שהסקריפט ירוץ כל בוקר או כל שעה:

### **Windows Task Scheduler:**
```cmd
schtasks /create /tn "LearningHub-Auto-Detect" /tr "cd C:\Path\To\matireal && npm run auto" /sc daily /st 08:00
```

### **Linux/Mac Cron:**
```bash
0 8 * * * cd /path/to/matireal && npm run auto
```

---

## 📚 קישורים שימושיים

- `generate-manifest-auto.js` - הסקריפט הראשי
- `master_guide_template.html` - התבנית עם הנחיות
- `package.json` - מגדיר `npm run auto`

---

**Happy Creating! 🎓**
