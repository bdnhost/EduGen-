# 🚀 LearningHub Manifest Generator

## מה זה?
**`generate-manifest.js`** הוא Node.js script שמעדכן אוטומטית את:
- ✅ `categories.html` - דף הקטגוריות עם כל המדריכים
- ✅ `sitemap.html` - מפת האתר הוויזואלית
- ✅ `sitemap.xml` - Sitemap עבור מנועי חיפוש

## 🎯 למה צריך את זה?

כל פעם שאתה מוסיף/מסיר קובץ HTML חדש:
```
❌ ללא script: צריך לעדכן ידנית 3 קבצים שונים 😞
✅ עם script: כל דבר מתעדכן בשניה אחת ⚡
```

## 📋 דרישות מוקדמות

- **Node.js** מותקן על המחשב ([הורד מכאן](https://nodejs.org))
- תיקייה `matireal/` עם כל קבצי ה-HTML

## 📖 איך להשתמש?

### 🔧 הרצה ידנית:
```bash
# באמצעות npm
npm run generate

# או ישירות עם node
node generate-manifest.js
```

### ⚙️ הרצה אוטומטית (Advanced):

#### **Windows - Task Scheduler**
```powershell
# פתח Task Scheduler
taskschd.msc

# יצור Task חדש:
# - שם: "UpdateLearningHubManifest"
# - Trigger: Daily בשעה 00:00
# - Action: Start program = "C:\Program Files\nodejs\node.exe"
#   Arguments: "generate-manifest.js"
#   Start in: "C:\Users\User\Desktop\matireal"
```

#### **Mac/Linux - Cron Job**
```bash
# פתח crontab editor
crontab -e

# הוסף את השורה הזו (כל יום בחצות):
0 0 * * * cd /path/to/matireal && node generate-manifest.js >> manifest.log 2>&1
```

#### **GitHub Actions (ל-GitHub Pages)**
```yaml
# .github/workflows/generate-manifest.yml
name: Generate Manifest

on:
  push:
    paths:
      - '**.html'
  schedule:
    - cron: '0 0 * * *'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node generate-manifest.js
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: '♻️ Update manifest files'
          file_pattern: 'categories.html sitemap.html sitemap.xml'
```

## 🔄 איך להוסיף מדריך חדש?

### 1️⃣ עדכן את `generate-manifest.js`:
```javascript
CONFIG.guides = [
    // ... קבצים קיימים ...
    { 
        file: 'new_guide.html', 
        name: 'New Guide', 
        icon: '📚', 
        category: 'Category Name', 
        description: 'תיאור המדריך' 
    }
];
```

### 2️⃣ הרץ את ה-script:
```bash
npm run generate
```

### 3️⃣ בדוק את הקבצים המעודכנים:
```bash
# תראה את ההבדלים
git diff categories.html sitemap.html sitemap.xml
```

## 📊 מבנה המדריכים (CONFIG.guides)

כל מדריך צריך:
- `file`: שם הקובץ (בדיוק כמו בתיקיה)
- `name`: שם מקצועי להצגה
- `icon`: emoji לייצוג
- `category`: קטגוריה (צריכה להיות קיימת)
- `description`: תיאור קצר בעברית

**דוגמה:**
```javascript
{
    file: 'python_guide.html',
    name: 'Python Pro',
    icon: '🐍',
    category: 'Digital Basics',
    description: 'Python עם קוד'
}
```

## 🗂️ קטגוריות זמינות:

- 🤖 **AI & Automation** - בינה מלאכותית, ChatGPT, Prompts
- 💻 **Digital Basics** - אינטרנט, Python, Git, Terminal
- 📊 **Data & Business** - Excel, SQL, Power BI, Analytics
- 🎨 **Creative Studio** - Figma, Video Editing, CAD
- 💼 **Career** - CV, Interview Prep, Presentation Skills
- ⚙️ **Technology** - IoT, Automotive, Mechanical Design

## ✨ יתרונות

| תכונה | תיאור |
|--------|--------|
| 🚀 **מהירות** | עדכון בשניה אחת |
| 🎯 **דיוק** | אין טעויות ידניות |
| 🔄 **אוטומציה** | יכול להריץ בתזמון קבוע |
| 📱 **SEO** | sitemap.xml מעודכן ל-Google |
| 🌍 **גמישות** | קל להוסיף/הסיר מדריכים |

## 🐛 פתרון בעיות

### ❌ "Node is not found"
```bash
# בדוק שNode.js מותקן
node --version

# אם לא, הורד מ: nodejs.org
```

### ❌ "Permission denied"
```bash
# תן הרשאות בـ Mac/Linux
chmod +x generate-manifest.js

# הרץ עם sudo אם צריך
sudo node generate-manifest.js
```

### ❌ הקבצים לא מתעדכנים
```bash
# בדוק אם יש שגיאות
node generate-manifest.js 2>&1 | tee output.log

# או הריץ עם debug
DEBUG=* node generate-manifest.js
```

## 📝 Logs

הscript מודפיס:
- ✅ קבצים שהתעדכנו בהצלחה
- 📊 סטטיסטיקה (כמה מדריכים, קטגוריות וכו')
- ❌ שגיאות אם היו

## 🔐 Security

- ✅ Script קורא רק קבצים, לא משנה אם לא צריך
- ✅ Config מוגן ב-JavaScript, לא בקובץ נפרד
- ✅ Sitemap.xml כולל רק URLs, ללא תוכן סודי

## 🤝 תרומות

אם רוצה לשפר את ה-script:
1. בדוק את `generate-manifest.js`
2. עשה שינויים
3. בדוק עם `npm run generate`
4. שלח Pull Request

## 📄 License

MIT - בחופשיות להשתמש, לשנות ולהפיץ.

---

**עודכן לאחרונה:** December 15, 2025  
**גרסה:** 1.0.0  
**מחליף:** עדכון ידני של 3 קבצים 😅
