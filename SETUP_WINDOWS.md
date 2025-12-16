# 🚀 מדריך התקנה והפעלה - Windows 10/11

## 📋 דרישות מקדימות

לפני שמתחילים, ודא שיש לך:

1. **Node.js** גרסה 18 ומעלה
   - הורד מ: https://nodejs.org/
   - בחר בגרסת LTS (Long Term Support)
   - בדוק התקנה: פתח PowerShell והרץ:
     ```powershell
     node --version
     npm --version
     ```

2. **API Key** מאחד הספקים הבאים:
   - **Google Gemini** (מומלץ למתחילים - חינם!)
     - https://aistudio.google.com/apikey
   - **OpenRouter** (גישה למגוון רחב של מודלים)
     - https://openrouter.ai/keys

---

## 📥 שלב 1: הורדת הפרויקט

### אופציה א': עם Git
```powershell
git clone <repository-url>
cd EduGen-
```

### אופציה ב': ללא Git
1. הורד את הפרויקט כ-ZIP
2. חלץ לתיקייה
3. פתח PowerShell בתיקייה (Shift + Right Click → "Open PowerShell window here")

---

## ⚙️ שלב 2: התקנת תלויות

הרץ את הפקודות הבאות:

```powershell
# התקנת תלויות עבור ה-Client (React)
npm install

# התקנת תלויות עבור ה-Server (Backend)
cd server
npm install
cd ..
```

**זמן משוער:** 2-3 דקות (תלוי במהירות האינטרנט)

---

## 🔑 שלב 3: הגדרת API Keys

### 3.1 - צור קובץ .env.local

```powershell
# העתק את הקובץ לדוגמה
copy .env.local.example .env.local
```

### 3.2 - ערוך את הקובץ

פתח את `.env.local` בעורך טקסט (Notepad++, VSCode, או Notepad רגיל) והוסף את ה-API Keys שלך:

**אם אתה משתמש ב-Gemini:**
```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

**אם אתה משתמש ב-OpenRouter:**
```env
OPENROUTER_API_KEY=sk-or-v1-...your_actual_key_here
```

**אפשר גם את שניהם!**
```env
GEMINI_API_KEY=AIzaSy...
OPENROUTER_API_KEY=sk-or-v1-...
```

💾 **שמור את הקובץ**

---

## 🏃 שלב 4: הפעלת האפליקציה

יש לך 2 אופציות:

### אופציה א': הפעלה ידנית (2 חלונות)

**חלון 1 - Server (Backend):**
```powershell
npm run server
```

אתה אמור לראות:
```
🎓 ════════════════════════════════════════════════
   EduGen Backend Server
   ════════════════════════════════════════════════
   🌐 Server running on: http://localhost:5000
   ✅ Gemini provider initialized
   ✅ OpenRouter provider initialized
```

**חלון 2 - Client (Frontend):**
פתח PowerShell נוסף באותה תיקייה והרץ:
```powershell
npm run dev
```

אתה אמור לראות:
```
  VITE v6.2.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.X.X:3000/
```

### אופציה ב': הרצה אוטומטית (מומלץ ל-Windows)

צור קובץ `start.bat` בתיקיית הפרויקט:

```batch
@echo off
echo Starting EduGen...

echo.
echo [1/2] Starting Backend Server...
start "EduGen Server" cmd /k "npm run server"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Client...
start "EduGen Client" cmd /k "npm run dev"

echo.
echo ================================
echo   EduGen is starting!
echo ================================
echo   Server:  http://localhost:5000
echo   Client:  http://localhost:3000
echo ================================
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:3000
```

**הפעלה:**
1. שמור את הקובץ כ-`start.bat`
2. לחץ עליו פעמיים (Double-click)
3. ייפתחו 2 חלונות CMD - אחד לשרת ואחד לקליינט
4. הדפדפן ייפתח אוטומטית

---

## 🌐 שלב 5: פתיחת האפליקציה

פתח דפדפן (Chrome/Firefox/Edge) וגש ל:

```
http://localhost:3000
```

---

## 🎯 שימוש באפליקציה

### 1. בחר מודל AI
בחר מהרשימה הנפתחת:
- **DeepSeek Chat** - זול מאוד ואיכותי
- **Gemini 2.5 Flash** - מהיר ותומך טוב בעברית
- **GPT-4o Mini** - מאוזן (מחיר/איכות)
- ועוד...

### 2. הזן נושא
- הקלד נושא למדריך (למשל: "יסודות Python")
- או בחר מהרשימה המוכנה (84 רעיונות!)

### 3. הוסף הקשר (אופציונלי)
- למי המדריך מיועד?
- מה חשוב להדגיש?

### 4. צור מדריך
לחץ על "צור מדריך אוטומטי" וחכה 30-60 שניות

### 5. הורד
לחץ "הורד HTML" כדי לשמור את המדריך

---

## 🛑 עצירת האפליקציה

### אם הרצת ידנית:
לחץ `Ctrl + C` בכל אחד מחלונות ה-PowerShell

### אם השתמשת ב-start.bat:
פשוט סגור את 2 חלונות ה-CMD

---

## 🔧 פתרון בעיות נפוצות

### ❌ "Port 3000 is already in use"
**פתרון:**
```powershell
# מצא תהליך שתופס את הפורט
netstat -ano | findstr :3000

# סיים את התהליך (החלף XXXX ב-PID שנמצא)
taskkill /PID XXXX /F
```

### ❌ "Port 5000 is already in use"
**פתרון 1:** עצור תהליכים שתופסים פורט 5000
```powershell
netstat -ano | findstr :5000
taskkill /PID XXXX /F
```

**פתרון 2:** שנה פורט בקובץ `.env.local`:
```env
SERVER_PORT=5001
```
וב-`vite.config.ts` שנה ל:
```env
VITE_API_URL=http://localhost:5001
```

### ❌ "Backend not connected"
**סימנים:**
- הודעה אדומה בממשק: "השרת לא מחובר"

**פתרון:**
1. ודא שהשרת רץ (חלון ראשון עם `npm run server`)
2. בדוק שאין שגיאות בחלון השרת
3. בדוק שה-`.env.local` קיים עם API keys

### ❌ "No models available"
**סיבות:**
- לא הוגדר API key ב-`.env.local`
- API key לא תקין

**פתרון:**
1. פתח `.env.local`
2. ודא שיש `GEMINI_API_KEY=...` או `OPENROUTER_API_KEY=...`
3. ודא שה-key נכון (ללא רווחים)
4. הפעל מחדש את השרת (`Ctrl+C` ואז `npm run server`)

### ❌ שגיאות בעברית לא מוצגות כראוי
**פתרון:**
שנה את ה-encoding של PowerShell:
```powershell
chcp 65001
```

---

## 📊 השוואת מודלים - מחירים

| מודל | עלות למדריך | מהירות | איכות בעברית |
|------|-------------|--------|--------------|
| DeepSeek Chat | $0.01 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| Gemini 2.5 Flash | $0.075 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| GPT-4o Mini | $0.05 | ⚡⚡ | ⭐⭐⭐⭐ |
| Claude 3 Haiku | $0.08 | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| GPT-4o | $0.30 | ⚡ | ⭐⭐⭐⭐⭐ |

💡 **המלצה:** התחל עם DeepSeek או Gemini Flash

---

## 🎓 טיפים למשתמשים מתקדמים

### שינוי טמפרטורה (Creativity)
ערוך `server/providers/gemini.js` או `openrouter.js`:
```javascript
temperature: 0.7,  // 0.0 = דטרמיניסטי, 1.0 = יצירתי
```

### הוספת מודלים חדשים
ערוך `server/index.js` והוסף למערך `popularModels`:
```javascript
{
  id: 'model/name',
  name: 'Display Name',
  provider: 'openrouter',
  description: 'Description',
  cost: 'Low'
}
```

### שינוי פורט Client
ערוך `vite.config.ts`:
```typescript
server: {
  port: 3001,  // שנה ל-3001
  host: '0.0.0.0',
}
```

---

## 🆘 תמיכה נוספת

אם נתקלת בבעיה:
1. בדוק את הקונסול בחלון השרת לשגיאות
2. בדוק את הקונסול בדפדפן (F12 → Console)
3. ודא שכל ה-dependencies הותקנו (`npm install` ו-`cd server && npm install`)

---

## 📝 לסיכום - צ'קליסט הפעלה מהירה

- [ ] Node.js מותקן (v18+)
- [ ] `npm install` הורץ בתיקייה ראשית
- [ ] `cd server && npm install` הורץ
- [ ] קובץ `.env.local` נוצר ומכיל API key
- [ ] `npm run server` רץ בחלון אחד
- [ ] `npm run dev` רץ בחלון שני
- [ ] http://localhost:3000 פתוח בדפדפן
- [ ] מודל נבחר מהרשימה
- [ ] מדריך ראשון נוצר בהצלחה ✨

---

**בהצלחה!** 🎉
