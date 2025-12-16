# 🎓 EduGen - Professional Educational Guide Generator

<div align="center">

**Multi-LLM powered educational content generator with LMS integration**

[![Made with React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Powered by AI](https://img.shields.io/badge/AI-Multi--LLM-FF6B6B?style=flat)](https://openrouter.ai/)
[![Hebrew First](https://img.shields.io/badge/Hebrew-First-4A90E2?style=flat)]()

[English](#english) | [עברית](#hebrew)

</div>

---

## <a name="hebrew"></a>🇮🇱 עברית

### 📖 מה זה EduGen?

**EduGen** הוא מחולל מדריכים לימודיים מקצועיים המשתמש בבינה מלאכותית ליצירת תוכן חינוכי מובנה ואיכותי בעברית.

### ✨ יכולות מרכזיות

- 🤖 **תמיכה במגוון מודלי AI:**
  - Google Gemini (2.5 Flash, 2.5 Pro)
  - DeepSeek (Chat, R1)
  - OpenAI (GPT-4o, GPT-4o Mini)
  - Anthropic Claude (3.5 Sonnet, 3 Haiku)
  - Meta Llama, Mistral, Qwen, ועוד...

- 📚 **תוכן מובנה:**
  - מבוא ותיאוריה מעמיקה
  - דוגמאות מעשיות וקוד
  - דיאגרמות Mermaid.js
  - שאלות נפוצות (FAQ)
  - טיפים ומלכודות נפוצות

- 🎯 **אינטגרציה עם LMS:**
  - מטלות מובנות עם rubrics
  - קוד קורס ומוסד
  - מספר שיעור במערך השיעורים

- 💾 **ייצוא:**
  - HTML עצמאי מוכן לפרסום
  - SEO אופטימלי
  - תמונות AI-generated

### 🚀 התקנה מהירה (Windows 10/11)

1. **התקן Node.js** (גרסה 18+): https://nodejs.org/

2. **שכפל את הפרויקט:**
   ```bash
   git clone <repo-url>
   cd EduGen-
   ```

3. **התקן תלויות:**
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

4. **הגדר API Keys:**
   ```bash
   copy .env.local.example .env.local
   ```
   ערוך `.env.local` והוסף את ה-API keys שלך

5. **הפעל:**
   - **Windows:** לחץ פעמיים על `start.bat`
   - **ידני:**
     ```bash
     # Terminal 1
     npm run server

     # Terminal 2
     npm run dev
     ```

6. **פתח דפדפן:** http://localhost:3000

📘 **מדריך מפורט:** ראה [SETUP_WINDOWS.md](SETUP_WINDOWS.md)

### 🎯 שימוש

1. בחר מודל AI מהרשימה הנפתחת
2. הזן נושא למדריך (או בחר מ-84 רעיונות מוכנים)
3. הוסף הקשר נוסף (אופציונלי)
4. לחץ "צור מדריך אוטומטי"
5. המתן 30-60 שניות
6. הורד HTML או צפה בתצוגה מקדימה

### 💰 השוואת מודלים

| מודל | עלות למדריך | מהירות | עברית |
|------|-------------|--------|-------|
| DeepSeek Chat | ~$0.01 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| Gemini 2.5 Flash | ~$0.075 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| GPT-4o Mini | ~$0.05 | ⚡⚡ | ⭐⭐⭐⭐ |
| Claude 3 Haiku | ~$0.08 | ⚡⚡ | ⭐⭐⭐⭐⭐ |

💡 **המלצה:** DeepSeek Chat (זול + איכותי) או Gemini Flash (עברית מעולה)

### 🏗️ ארכיטקטורה

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React + Vite)                            │
│  http://localhost:3000                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ REST API
                   │
┌──────────────────▼──────────────────────────────────┐
│  Backend (Express)                                  │
│  http://localhost:5000                              │
│                                                      │
│  ┌────────────┐  ┌────────────┐                    │
│  │  Gemini    │  │ OpenRouter │                    │
│  │  Provider  │  │  Provider  │                    │
│  └────────────┘  └────────────┘                    │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼─────┐      ┌─────▼──────┐
    │  Gemini  │      │ OpenRouter │
    │   API    │      │    API     │
    └──────────┘      └────────────┘
```

### 🔒 אבטחה

- ✅ API keys מאוחסנים רק ב-`.env.local` (לא בקוד)
- ✅ Backend proxy מונע חשיפה לדפדפן
- ✅ CORS מוגבל ל-localhost
- ✅ אין שמירת נתונים - הכל local

### 📁 מבנה הפרויקט

```
EduGen-/
├── src/                    # Frontend React
│   ├── App.tsx            # Main component
│   ├── services/
│   │   └── apiService.ts  # Backend communication
│   ├── components/
│   └── utils/
├── server/                # Backend Express
│   ├── index.js          # Main server
│   └── providers/
│       ├── gemini.js     # Gemini integration
│       └── openrouter.js # OpenRouter integration
├── .env.local.example    # API keys template
├── start.bat             # Windows launcher
└── SETUP_WINDOWS.md      # Detailed setup guide
```

### 🛠️ טכנולוגיות

**Frontend:**
- React 19.2
- TypeScript 5.8
- Vite 6.2
- Lucide Icons

**Backend:**
- Node.js + Express
- Google Gemini API
- OpenRouter API
- CORS, dotenv

### 🎨 תבנית המדריך

כל מדריך כולל:
- ✅ כותרת ותיאור SEO
- ✅ תמונת header AI-generated
- ✅ מבנה פדגוגי (מבוא → תיאוריה → תרגול → מתקדמים)
- ✅ 2 דיאגרמות Mermaid.js
- ✅ דוגמאות קוד
- ✅ 2 מטלות LMS עם rubrics
- ✅ FAQ, טיפים, ושגיאות נפוצות
- ✅ מדריכים קשורים

### 📝 רישיון

MIT License - חופשי לשימוש אישי ומסחרי

---

## <a name="english"></a>🇬🇧 English

### 📖 What is EduGen?

**EduGen** is a professional educational guide generator powered by multiple AI models, designed to create structured, high-quality educational content in Hebrew.

### ✨ Key Features

- 🤖 **Multi-LLM Support:**
  - Google Gemini, DeepSeek, OpenAI GPT-4, Claude, Llama, Mistral, Qwen, and more
  - Choose the best model for your needs and budget

- 📚 **Structured Content:**
  - Introduction and deep theory
  - Practical examples with code
  - Mermaid.js diagrams
  - FAQ section
  - Common mistakes and tips

- 🎯 **LMS Integration:**
  - Structured assignments with grading rubrics
  - Course codes and institution metadata
  - Session numbering

- 💾 **Export:**
  - Self-contained HTML files
  - SEO optimized
  - AI-generated header images

### 🚀 Quick Start

See [SETUP_WINDOWS.md](SETUP_WINDOWS.md) for detailed installation instructions.

**TL;DR:**
1. Install Node.js 18+
2. Clone repo and run `npm install` in root and `server/`
3. Copy `.env.local.example` to `.env.local` and add API keys
4. Run `npm run server` and `npm run dev`
5. Open http://localhost:3000

### 💰 Model Comparison

| Model | Cost/Guide | Speed | Hebrew Quality |
|-------|-----------|-------|----------------|
| DeepSeek Chat | ~$0.01 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| Gemini 2.5 Flash | ~$0.075 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| GPT-4o Mini | ~$0.05 | ⚡⚡ | ⭐⭐⭐⭐ |
| Claude 3 Haiku | ~$0.08 | ⚡⚡ | ⭐⭐⭐⭐⭐ |

### 🛠️ Tech Stack

- **Frontend:** React 19.2, TypeScript, Vite
- **Backend:** Node.js, Express
- **AI:** Google Gemini API, OpenRouter API
- **Diagrams:** Mermaid.js
- **Images:** Pollinations.ai

### 📝 License

MIT License - Free for personal and commercial use

---

<div align="center">

**Made with ❤️ for Hebrew educators**

[Report Bug](https://github.com/yourusername/edugen/issues) · [Request Feature](https://github.com/yourusername/edugen/issues)

</div>
