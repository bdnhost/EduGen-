import React, { useState, useEffect } from 'react';
import { BookOpen, Code2, Download, Wand2, Loader2, Sparkles, LayoutTemplate, FileCode, Lightbulb, AlertCircle, Cpu, Settings, Plus, Trash2 } from 'lucide-react';
import { ApiService, ModelInfo } from './services/apiService';
import { generateGuideHtml } from './utils/template';
import { GuideData, GuideCategory, GuideTeasers, GuideAssignments } from './types';
import GuidePreview from './components/GuidePreview';

const GUIDE_IDEAS = [
    // --- AI & Generative Tech ---
    "הנדסת פרומפטים (Prompt Engineering) - המדריך המלא",
    "שימוש ב-ChatGPT למחקר וכתיבה אקדמית אתית",
    "יצירת תמונות מרהיבות עם Midjourney ו-DALL-E 3",
    "בניית צ'אטבוטים לשירות לקוחות ללא ידע בתכנות",
    "מבוא למודלי שפה גדולים (LLMs) - איך זה עובד?",
    "זיהוי פייק ניוז ותוכן גנרטיבי ברשת",
    "אתיקה וזכויות יוצרים בעידן הבינה המלאכותית",
    "שימוש ב-Copilot לייעול העבודה ב-Microsoft Office",
    "יצירת עוזרים אישיים (Custom GPTs) לצרכים עסקיים",
    "כלי AI לעריכת וידאו ושיפור סאונד אוטומטי",
    "שימוש ב-Perplexity למחקר מהיר ומדויק",
    "אוטומציה של יצירת תוכן לרשתות חברתיות עם AI",
    "בניית אתרים עם AI - מ-Framer עד Webflow",
    "Claude, Gemini ו-ChatGPT - השוואה ובחירת הכלי המתאים",
    "יצירת מצגות מרהיבות עם Gamma ו-Beautiful.ai",
    "AI לעריכת קוד ופתרון באגים - Cursor ו-Codeium",
    "תרגום חכם ולוקליזציה עם DeepL ו-AI",
    "שימוש ב-Stable Diffusion לייצור אמנות ייחודית",
    "אוטומציה של מחקר שוק באמצעות AI",
    "יצירת קול מלאכותי (Voice Cloning) ושימושיו",
    "בניית Agents אוטונומיים עם LangChain",
    "AI לניתוח סנטימנט וחוות דעת לקוחות",
    "שימוש ב-Runway ML ליצירת סרטוני AI",
    "אוטומציה של בדיקות תוכנה עם AI",

    // --- Productivity & Automation ---
    "אוטומציה של תהליכים עסקיים עם Zapier ו-Make",
    "ניהול ידע אישי (PKM) מתקדם ב-Notion",
    "ניהול זמן בשיטת Pomodoro ו-Time Blocking",
    "אימבוקס זירו (Inbox Zero): ניהול מיילים אפקטיבי",
    "עבודה עמוקה (Deep Work) בעידן ההפרעות הדיגיטליות",
    "ניהול משימות ופרויקטים ב-Monday/Asana לצוותים",
    "סיכום ישיבות ומסמכים ארוכים בשניות עם AI",
    "בניית דשבורד ניהולי אישי למעקב אחר יעדים",
    "טכניקות למידה מהירה (Super Learning) לסטודנטים",
    "ארגון התיקיות והקבצים בענן בצורה חכמה",
    "אוטומציה של הוצאות והנהלת חשבונות בעסק קטן",
    "בניית מערכת CRM אישית ב-Airtable או Notion",
    "שימוש ב-Obsidian לבניית מאגר ידע אישי",
    "אוטומציה של גיוס עובדים - מסינון קורות חיים עד תזמון ראיונות",
    "בניית מערכת ticketing לתמיכה טכנית",
    "שימוש ב-IFTTT לאוטומציה של חיי היומיום",
    "ניהול סיסמאות בטוח עם 1Password/Bitwarden",
    "שימוש ב-Todoist/TickTick לניהול משימות מתקדם",
    "אוטומציה של גיבויים ואבטחת מידע אישי",
    "בניית תהליך Onboarding אוטומטי לעובדים חדשים",

    // --- Data & Tech Literacy ---
    "ניתוח נתונים ב-Excel למתקדמים (כולל כלי AI)",
    "מבוא ל-Python לאנשי שיווק ומנהלים",
    "יסודות ה-SQL לשליפת נתונים ודוחות",
    "ויזואליזציה של נתונים (Data Storytelling)",
    "בניית אתר אינטרנט תדמיתי ללא קוד (Wix/WordPress)",
    "אבטחת מידע אישי וסייבר - הגנה מפני פישינג",
    "פתרון תקלות מחשב בסיסיות ללא טכנאי",
    "מבוא למחשוב ענן (Cloud Computing) - AWS/Azure",
    "בניית דשבורדים אינטראקטיביים ב-Power BI/Tableau",
    "מבוא ל-Git ו-GitHub לשיתוף פעולה בפרויקטים",
    "אוטומציה של דוחות עם Google Apps Script",
    "בניית API פשוט עם No-Code (Bubble/Xano)",
    "מבוא לבסיסי נתונים - מ-MySQL עד MongoDB",
    "שימוש ב-Google Analytics 4 למעקב אחר אתרים",
    "בניית Scraper לאיסוף נתונים מהאינטרנט",
    "מבוא ל-Docker ו-Containers למפתחים",
    "אבטחת רשתות Wi-Fi ביתיות מפני פריצות",
    "מבוא ל-Blockchain וטכנולוגיות מבוזרות",

    // --- Career & Branding ---
    "כתיבת קורות חיים מותאמים למערכות סינון (ATS)",
    "מיתוג אישי (Personal Branding) בלינקדאין",
    "הכנה לראיונות עבודה עם סימולציות AI",
    "בניית תיק עבודות (פורטפוליו) דיגיטלי מנצח",
    "נטוורקינג (Networking) יעיל בעידן הדיגיטלי",
    "משא ומתן על שכר ותנאי העסקה",
    "הסבה מקצועית להייטק מתחומים אחרים",
    "פרילנס 101: איך מתחילים לעבוד כעצמאי",
    "אנגלית עסקית: כתיבת מיילים ותקשורת בינלאומית",
    "חיפוש עבודה חכם באמצעות רשתות חברתיות",
    "בניית אתר תדמית אישי ל-Personal Brand",
    "כתיבת מכתב נלווה (Cover Letter) אפקטיבי",
    "שימוש ב-LinkedIn Sales Navigator לחיפוש הזדמנויות",
    "בניית נוכחות דיגיטלית משפיעה ב-X (Twitter)",
    "פיתוח קריירה במשאבי אנוש (HR) - מה צריך לדעת",
    "מנהל מוצר (Product Manager) - המסלול המלא",
    "קריירה בסייבר - איך מתחילים בתחום",
    "מעבר לתפקיד ניהולי - הכנה ומיומנויות",
    "עבודה מרחוק (Remote Work) - איך למצוא ולהצליח",
    "בניית קהילה מקצועית סביב המותג האישי",

    // --- Marketing & Content Creation ---
    "יסודות השיווק הדיגיטלי לעסקים קטנים",
    "כתיבה שיווקית (Copywriting) בסיוע כלי AI",
    "קידום אורגני (SEO) בעידן ה-Search Generative Experience",
    "עיצוב גרפי בסיסי ב-Canva ללא מעצבים",
    "שיווק בווידאו קצר (Reels/TikTok) - אסטרטגיה וביצוע",
    "הקמת פודקאסט: מהרעיון ועד ההפצה בספוטיפיי",
    "סטוריטלינג (Storytelling) עסקי והעברת מסרים",
    "בניית דפי נחיתה ממירים",
    "שיווק באמצעות ניוזלטרים ורשימות תפוצה",
    "אסטרטגיית תוכן (Content Strategy) מנצחת",
    "שיווק באינפלואנסרים - איך לבחור ולשתף פעולה",
    "Google Ads למתחילים - קמפיינים ראשונים",
    "Facebook & Instagram Ads - מדריך מעשי",
    "בניית משפך מכירות (Sales Funnel) אוטומטי",
    "שיווק בווטסאפ (WhatsApp Marketing) - אסטרטגיות",
    "אנליטיקה שיווקית - מדידת ROI ואופטימיזציה",
    "שיווק בדוא\"ל (Email Marketing) - Mailchimp למתקדמים",
    "יצירת Memes ותוכן ויראלי אפקטיבי",
    "שיווק שותפים (Affiliate Marketing) - מדריך התחלה",
    "בניית קמפיין קראודפאנדינג מוצלח",
    "שימוש ב-LinkedIn Ads לשיווק B2B",
    "עיצוב UX/UI למתחילים - חוויית משתמש",

    // --- Soft Skills & Leadership ---
    "חשיבה ביקורתית: איך לקבל החלטות טובות יותר",
    "פתרון בעיות מורכבות (Complex Problem Solving)",
    "אינטליגנציה רגשית (EQ) בניהול צוותים",
    "עמידה מול קהל ופרזנטציה אפקטיבית (Storytelling)",
    "ניהול קונפליקטים ותקשורת מקרבת (NVC)",
    "גמישות מחשבתית והסתגלות לשינויים (Adaptability)",
    "ניהול צוותים היברידיים (מרחוק ומקרוב)",
    "מתן וקבלת משוב (Feedback) בונה",
    "בניית תרבות ארגונית חיובית",
    "ניהול זמן מול ניהול אנרגיה",
    "מנהיגות שרותית (Servant Leadership) בעולם המודרני",
    "כלים לקבלת החלטות מהירות בלחץ",
    "בניית אמון בצוותים מבוזרים",
    "פיתוח חוסן נפשי (Mental Resilience) בעבודה",
    "מיומנויות משא ומתן מתקדמות",
    "הקשבה פעילה ותקשורת בין-אישית",
    "ניהול שינויים ארגוניים (Change Management)",
    "פיתוח יצירתיות וחשיבה lateral",

    // --- Finance & Life Skills ---
    "אוריינות פיננסית: ניהול תקציב אישי והשקעות",
    "מבוא לשוק ההון והשקעות פסיביות",
    "תזונה נכונה ואורח חיים בריא לסטודנטים עסוקים",
    "מיינדפולנס והפחתת לחצים בעבודה",
    "תכנון טיולים חכם וחסכוני עם כלי AI",
    "לימוד שפה חדשה בעזרת מורים וירטואליים",
    "השקעות בקריפטו - מדריך למתחילים",
    "תכנון פרישה והשקעות לטווח ארוך",
    "ביטוחים - מה באמת צריך ומה לא",
    "רכישת דירה ראשונה - המדריך השלם",
    "ניהול חובות והלוואות בצורה אופטימלית",
    "מיסוי לעצמאים ובעלי עסקים",
    "פסיבי אינקום - יצירת הכנסות נוספות",

    // --- E-commerce & Online Business ---
    "פתיחת חנות אונליין ב-Shopify - צעד אחר צעד",
    "דרופשיפינג (Dropshipping) - מדריך מעשי",
    "מכירת מוצרים דיגיטליים ב-Gumroad/Podia",
    "אמזון FBA - ייבוא ומכירה בפלטפורמה הגדולה",
    "בניית עסק SaaS - מהרעיון ועד השקה",
    "מכירות ב-Etsy לאמנים ויוצרים",
    "בניית Marketplace כמו Fiverr/Upwork",
    "אופטימיזציה של קטלוג מוצרים לממירה",
    "ניהול מלאי וחוויית לקוח באי-קומרס",
    "שימוש ב-WooCommerce לחנות וורדפרס",
    "פייסבוק שופס (Facebook Shops) - הקמה וניהול",
    "יצירת Subscription Box מרווח",
    "שיווק שותפים (Affiliate) באמזון",
    "מכירת קורסים אונליין - פלטפורמות וטיפים",

    // --- Real Estate & Property Tech ---
    "השקעות בנדל\"ן למתחילים - לאן השוק הולך",
    "שימוש ב-PropTech לניהול נכסים",
    "השכרת דירות לטווח קצר ב-Airbnb",
    "ניהול נכסי השקעה - מערכות ואוטומציה",
    "שיפוץ ודירוג נכסים לערך מוסף",
    "ניתוח עסקאות נדל\"ן ב-Excel",

    // --- Education & EdTech ---
    "הוראה אונליין ב-Zoom - טיפים פדגוגיים",
    "בניית קורסים דיגיטליים ב-Teachable/Thinkific",
    "גיימיפיקציה בחינוך - הפיכת למידה למשחק",
    "שימוש ב-Kahoot וכלי אינטראקטיביים בשיעור",
    "יצירת מבחנים אוטומטיים ומערכי שיעור עם AI",
    "למידה מבוססת פרויקטים (PBL) - יישום מעשי",
    "הערכה פורמטיבית עם טכנולוגיה",
    "בניית קהילת למידה מקוונת",

    // --- Health & Wellness Tech ---
    "טכנולוגיות לניטור בריאות - Wearables ואפליקציות",
    "מיינדפולנס ומדיטציה עם אפליקציות כמו Headspace",
    "תכנון אימונים מותאמים אישית עם AI",
    "מעקב אחר תזונה וקלוריות בצורה חכמה",
    "שינה טובה יותר - Biohacking וטכנולוגיה",
    "טלרפואה (Telemedicine) - איך להשתמש בשירותים",

    // --- Gaming & Streaming ---
    "בניית קריירה ב-Streaming (Twitch/YouTube)",
    "פיתוח משחקים ב-Unity למתחילים",
    "עריכת סרטוני גיימינג ב-DaVinci Resolve",
    "בניית קהילת Discord לגיימרים",
    "monetization של תוכן גיימינג",

    // --- Legal & Compliance ---
    "GDPR והגנת הפרטיות - מה חובה לדעת",
    "חוזים דיגיטליים - הכנה וניהול",
    "זכויות יוצרים ברשת - איך להגן על התוכן שלך",
    "תקנות נגישות (WCAG) לאתרי אינטרנט",
    "ייעוץ משפטי מקוון - פלטפורמות ושימושים",

    // --- Green Tech & Sustainability ---
    "טכנולוגיות ירוקות - מהפכת האנרגיה המתחדשת",
    "חישוב טביעת הרגל הפחמנית שלך",
    "עסקים בר-קיימא - אסטרטגיות ESG",
    "שימוש בטכנולוגיה להפחתת פסולת",

    // --- Freelancing & Gig Economy ---
    "עבודה באפוורק (Upwork) - בניית פרופיל מנצח",
    "Fiverr למתחילים - איך למכור שירותים",
    "מכירת יצירות אמנות NFT",
    "ניהול עסק פרילנס - מהגדרת מחיר ועד חשבוניות",
    "בניית חבילות שירות ממכרות",
    "תמחור שירותים - Value-based vs. Hourly",

    // --- Emerging Technologies ---
    "מציאות מדומה (VR) ומציאות רבודה (AR) - יישומים מעשיים",
    "אינטרנט של הדברים (IoT) לבית חכם",
    "הדפסת תלת-מימד (3D Printing) לפרויקטים אישיים",
    "רחפנים (Drones) - מתחביב לעסק",
    "Quantum Computing - מה זה ולמה זה חשוב",
    "Web3 ויישומי Blockchain מעשיים",

    // --- Government & Civic Tech ---
    "זכויות דיגיטליות - חופש ביטוי ופרטיות",
    "השתתפות אזרחית דיגיטלית בממשל",
    "GovTech - שיפור שירותים ציבוריים בטכנולוגיה",
    "הגשת תלונות ובקשות למוסדות ממשלתיים אונליין",

    // --- Special Israeli Context ---
    "ניווט במערכת הביטוח הלאומי דרך האינטרנט",
    "זכאויות ביטוח לאומי - איך לוודא שלא מפספסים",
    "מיסוי לעולים חדשים - המדריך השלם",
    "תמיכות ומענקים ממשלתיים לעסקים קטנים",
    "שירות לקוחות יעיל עם הבנקים בישראל",
    "ניהול תיק השקעות בבורסה בתל-אביב",
    "תכנון מס לפרילנסרים בישראל",
];

const LOADING_STEPS = [
    "מנתח את בקשתך...",
    "בונה את המבנה הפדגוגי...",
    "מנסח את התוכן המקצועי...",
    "מייצר דוגמאות ותרגילים...",
    "מעצב את המדריך...",
    "כמעט מוכן..."
];

const GUIDE_STRUCTURE = [
    {
        id: 'intro',
        title: 'מבוא ויסודות',
        icon: '🎯',
        description: 'הקדמה כללית ומטרות הלמידה',
        contextTypes: [
            { id: 'audience', label: 'קהל יעד', placeholder: 'למי המדריך מיועד? (סטודנטים, מקצוענים, מתחילים...)' },
            { id: 'prerequisites', label: 'ידע קודם נדרש', placeholder: 'איזה ידע או כישורים נדרשים מראש?' },
            { id: 'goals', label: 'מטרות למידה', placeholder: 'מה הלומד יוכל לעשות בסיום המדריך?' }
        ]
    },
    {
        id: 'theory',
        title: 'יסודות תיאורטיים',
        icon: '📚',
        description: 'הסבר מעמיק של המושגים הבסיסיים',
        contextTypes: [
            { id: 'depth', label: 'רמת עומק', placeholder: 'כמה מעמיק להיות? (סקירה כללית / הסבר מפורט / ניתוח מתקדם)' },
            { id: 'examples', label: 'סוג דוגמאות', placeholder: 'איזה סוג דוגמאות להביא? (מהחיים, טכניות, עסקיות...)' },
            { id: 'analogies', label: 'השוואות', placeholder: 'איזה השוואות או אנלוגיות יעזרו להבין?' }
        ]
    },
    {
        id: 'practice',
        title: 'יישום מעשי',
        icon: '🛠️',
        description: 'הדרכה צעד אחר צעד ותרגול',
        contextTypes: [
            { id: 'tools', label: 'כלים וטכנולוגיות', placeholder: 'איזה כלים או תוכנות להשתמש?' },
            { id: 'scenario', label: 'תרחיש מעשי', placeholder: 'איזה תרחיש או פרויקט לדוגמה?' },
            { id: 'difficulty', label: 'רמת קושי', placeholder: 'כמה מאתגר להיות? (בסיסי / בינוני / מתקדם)' }
        ]
    },
    {
        id: 'advanced',
        title: 'נושאים מתקדמים',
        icon: '🚀',
        description: 'טכניקות מתקדמות וטיפים מקצועיים',
        contextTypes: [
            { id: 'industry', label: 'פרספקטיבה תעשייתית', placeholder: 'איזה תחום או תעשייה להתמקד בו?' },
            { id: 'trends', label: 'טרנדים עדכניים', placeholder: 'איזה טרנדים או חידושים לכלול?' },
            { id: 'pitfalls', label: 'מלכודות נפוצות', placeholder: 'איזה טעויות נפוצות חשוב להזהיר מפניהן?' }
        ]
    },
    {
        id: 'summary',
        title: 'סיכום ומשך',
        icon: '✅',
        description: 'סיכום עיקרי הנקודות וצעדים הבאים',
        contextTypes: [
            { id: 'next_steps', label: 'צעדים הבאים', placeholder: 'מה כדאי ללמוד או לעשות אחר כך?' },
            { id: 'resources', label: 'משאבים נוספים', placeholder: 'איזה משאבים או קורסים להמליץ?' },
            { id: 'practice_ideas', label: 'רעיונות לתרגול', placeholder: 'איזה פרויקטים או תרגילים לעשות?' }
        ]
    }
];

const GUIDE_CATEGORIES: GuideCategory[] = [
    'AI & Automation',
    'Career',
    'Creative Studio',
    'Data & Business',
    'Digital Basics',
    'Technology'
];

const CATEGORY_EMOJIS: Record<GuideCategory, string> = {
    'AI & Automation': '🤖',
    'Career': '💼',
    'Creative Studio': '🎨',
    'Data & Business': '📊',
    'Digital Basics': '📚',
    'Technology': '🚀'
};

const CONTEXT_TEMPLATES = [
    {
        id: 'beginner',
        name: '🌱 למתחילים',
        description: 'מדריך בסיסי למי שמתחיל מאפס',
        contexts: {
            intro: {
                audience: 'מתחילים ללא ידע קודם',
                prerequisites: 'אין דרישות מוקדמות',
                goals: 'הבנה בסיסית ויכולת להתחיל'
            },
            theory: {
                depth: 'הסבר פשוט וברור עם הרבה דוגמאות',
                examples: 'דוגמאות מהחיים היומיומיים',
                analogies: 'השוואות לדברים מוכרים'
            },
            practice: {
                difficulty: 'בסיסי - צעדים קטנים וברורים',
                scenario: 'פרויקט פשוט ומעשי'
            }
        }
    },
    {
        id: 'professional',
        name: '💼 מקצועי',
        description: 'מדריך מתקדם לסביבה עסקית',
        contexts: {
            intro: {
                audience: 'אנשי מקצוע ומנהלים',
                prerequisites: 'ידע בסיסי בתחום',
                goals: 'יישום מיידי בעבודה'
            },
            theory: {
                depth: 'ניתוח מעמיק עם נתונים',
                examples: 'מקרי בוחן עסקיים',
                analogies: 'דוגמאות מהתעשייה'
            },
            practice: {
                tools: 'כלים מקצועיים נפוצים',
                scenario: 'פרויקט עסקי אמיתי',
                difficulty: 'מתקדם - פתרונות מורכבים'
            },
            advanced: {
                industry: 'מגמות תעשייתיות עדכניות',
                trends: 'טכנולוגיות חדשניות',
                pitfalls: 'טעויות יקרות נפוצות'
            }
        }
    },
    {
        id: 'academic',
        name: '🎓 אקדמי',
        description: 'מדריך מחקרי עם בסיס תיאורטי חזק',
        contexts: {
            intro: {
                audience: 'סטודנטים וחוקרים',
                prerequisites: 'רקע אקדמי רלוונטי',
                goals: 'הבנה עמוקה ויכולת מחקר'
            },
            theory: {
                depth: 'ניתוח תיאורטי מקיף',
                examples: 'מחקרים ומקורות אקדמיים',
                analogies: 'מודלים תיאורטיים'
            },
            practice: {
                scenario: 'ניסוי או מחקר מדעי',
                difficulty: 'מתקדם - גישה מחקרית'
            },
            advanced: {
                trends: 'מחקרים עדכניים בתחום',
                pitfalls: 'מגבלות מתודולוגיות'
            }
        }
    }
];

// תבניות מוכנות לטיזרים פדגוגיים
const TEASER_TEMPLATES = [
    {
        id: 'tech',
        name: '💻 טכנולוגיה',
        teasers: {
            idea: 'טכנולוגיה זו משנה את הדרך בה אנו עובדים ולומדים',
            warning: 'אל תתחילו בלי להבין את היסודות - זה יחסוך לכם שעות של תסכול',
            secret: 'רוב המומחים למדו מטעויות - אל תפחדו להתנסות',
            bonus: 'נסו ליישם את מה שלמדתם בפרויקט אישי קטן'
        }
    },
    {
        id: 'ai',
        name: '🤖 בינה מלאכותית',
        teasers: {
            idea: 'AI לא מחליף אנשים - הוא מעצים את היכולות שלהם',
            warning: 'תמיד בדקו את התוצאות של AI - הוא יכול לטעות',
            secret: 'הפרומפט הטוב ביותר הוא זה שמספק הקשר מלא',
            bonus: 'נסו להשוות תוצאות מכמה מודלים שונים'
        }
    },
    {
        id: 'career',
        name: '💼 קריירה',
        teasers: {
            idea: 'המיומנות החשובה ביותר היא היכולת ללמוד דברים חדשים',
            warning: 'אל תזניחו את הרשת המקצועית שלכם - היא שווה זהב',
            secret: 'רוב המשרות נמצאות דרך קשרים אישיים, לא דרך מודעות',
            bonus: 'עדכנו את הלינקדאין שלכם והתחילו לפרסם תוכן מקצועי'
        }
    },
    {
        id: 'data',
        name: '📊 נתונים',
        teasers: {
            idea: 'נתונים הם הנפט החדש - מי שיודע לנתח אותם מוביל',
            warning: 'נתונים ללא הקשר יכולים להטעות - תמיד שאלו "למה?"',
            secret: '80% מהעבודה בניתוח נתונים היא ניקוי והכנת הנתונים',
            bonus: 'צרו דשבורד פשוט עם הנתונים שלכם'
        }
    }
];

// תבניות מוכנות לשאלות נפוצות
const FAQ_TEMPLATES = [
    {
        id: 'beginner',
        name: '🌱 למתחילים',
        items: [
            { question: 'כמה זמן לוקח ללמוד את הנושא?', answer: 'תלוי ברקע שלכם, אבל בדרך כלל 2-4 שבועות של תרגול יומי יביאו אתכם לרמה טובה.' },
            { question: 'האם צריך ידע קודם?', answer: 'לא, המדריך מתחיל מהיסודות ומתקדם בהדרגה.' },
            { question: 'איפה אפשר לתרגל?', answer: 'יש הרבה פלטפורמות חינמיות לתרגול - המדריך כולל קישורים רלוונטיים.' }
        ]
    },
    {
        id: 'technical',
        name: '🔧 טכני',
        items: [
            { question: 'אילו כלים צריך להתקין?', answer: 'המדריך כולל רשימה מפורטת של כל הכלים הנדרשים עם הוראות התקנה.' },
            { question: 'מה עושים כשנתקעים?', answer: 'קודם כל חפשו בגוגל את הודעת השגיאה, ואם לא מצאתם - שאלו בפורומים מקצועיים.' },
            { question: 'איך יודעים שעשינו נכון?', answer: 'המדריך כולל דוגמאות לתוצאות צפויות בכל שלב.' }
        ]
    },
    {
        id: 'career',
        name: '💼 קריירה',
        items: [
            { question: 'האם זה רלוונטי לשוק העבודה?', answer: 'בהחלט! זהו אחד הכישורים המבוקשים ביותר כיום.' },
            { question: 'איך מוסיפים את זה לקורות החיים?', answer: 'הוסיפו את הפרויקטים שעשיתם ואת הכלים שאתם שולטים בהם.' },
            { question: 'כמה מרוויחים בתחום?', answer: 'השכר משתנה לפי ניסיון ומיקום, אבל התחום מציע שכר תחרותי.' }
        ]
    }
];

// תבניות מוכנות למשימות
const ASSIGNMENT_TEMPLATES = [
    {
        id: 'practical',
        name: '🛠️ מעשי',
        basic: [
            'קראו את כל המדריך והדגישו נקודות חשובות',
            'התקינו את הכלים הנדרשים על המחשב שלכם',
            'בצעו את התרגיל הראשון צעד אחר צעד'
        ],
        advanced: [
            'צרו פרויקט אישי שמשלב את מה שלמדתם',
            'שתפו את העבודה שלכם וקבלו משוב',
            'לימדו מישהו אחר את מה שלמדתם'
        ]
    },
    {
        id: 'research',
        name: '🔍 מחקרי',
        basic: [
            'חפשו 3 מקורות נוספים בנושא',
            'סכמו את הנקודות העיקריות בפסקה אחת',
            'מצאו דוגמה מהחיים האמיתיים'
        ],
        advanced: [
            'השוו בין גישות שונות לנושא',
            'כתבו סקירה קצרה עם המלצות',
            'הציגו את הממצאים שלכם בפני אחרים'
        ]
    },
    {
        id: 'creative',
        name: '🎨 יצירתי',
        basic: [
            'צרו מפת חשיבה של הנושא',
            'עצבו אינפוגרפיקה פשוטה',
            'כתבו 5 רעיונות ליישום'
        ],
        advanced: [
            'פתחו פתרון חדשני לבעיה קיימת',
            'צרו תוכן שיווקי לנושא',
            'בנו מצגת מקצועית להצגה'
        ]
    }
];

const App: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
    const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [backendConnected, setBackendConnected] = useState<boolean>(false);
    const [generatedHtml, setGeneratedHtml] = useState<string>('');
    const [guideData, setGuideData] = useState<GuideData | null>(null);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [error, setError] = useState<string | null>(null);
    const [showIdeas, setShowIdeas] = useState(false);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [tempApiKey, setTempApiKey] = useState('');
    const [apiKeyProvider, setApiKeyProvider] = useState<'gemini' | 'openrouter'>('gemini');
    const [showStructureView, setShowStructureView] = useState(false);
    const [contextInputs, setContextInputs] = useState<Record<string, Record<string, string>>>({});

    // New matireal-compatible fields
    const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('Technology');
    const [guideEmoji, setGuideEmoji] = useState('🎓');
    const [shortDescription, setShortDescription] = useState('');
    const [teasers, setTeasers] = useState<GuideTeasers>({
        idea: '',
        warning: '',
        secret: '',
        bonus: ''
    });
    const [assignments, setAssignments] = useState<GuideAssignments>({
        basic: [],
        advanced: []
    });
    const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([]);
    const [showAdvancedFields, setShowAdvancedFields] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [manifestLoading, setManifestLoading] = useState(false);

    // Check backend health and load models on mount
    useEffect(() => {
        const initializeBackend = async () => {
            try {
                const isHealthy = await ApiService.checkHealth();
                setBackendConnected(isHealthy);

                if (isHealthy) {
                    const models = await ApiService.getAvailableModels();
                    setAvailableModels(models);
                    if (models.length > 0) {
                        setSelectedModel(models[0].id);
                    }
                }
            } catch (error) {
                console.error('Failed to initialize backend:', error);
                setBackendConnected(false);
            }
        };

        initializeBackend();
    }, []);

    useEffect(() => {
        let interval: any;
        if (loading) {
            let stepIndex = 0;
            setLoadingText(LOADING_STEPS[0]);
            interval = setInterval(() => {
                stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
                setLoadingText(LOADING_STEPS[stepIndex]);
            }, 2500); // Change text every 2.5 seconds
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        if (!selectedModel) {
            setError("אנא בחר מודל LLM");
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedHtml(''); // Clear previous result to show loader clearly

        try {
            const selectedModelInfo = availableModels.find(m => m.id === selectedModel);
            if (!selectedModelInfo) {
                throw new Error("המודל שנבחר לא נמצא");
            }

            const contextualDescription = generateContextualDescription();
            const data = await ApiService.generateGuide({
                topic,
                description: contextualDescription,
                provider: selectedModelInfo.provider,
                modelId: selectedModelInfo.id,
                // Pass additional matireal-compatible data
                category: selectedCategory,
                emoji: guideEmoji,
                shortDescription: shortDescription,
                teasers: teasers,
                assignments: assignments,
                faq: faqItems
            });

            setGuideData(data);
            const html = generateGuideHtml(data);
            setGeneratedHtml(html);

            // Show completion message
            setSuccessMessage(`המדריך "${data.title}" נוצר בהצלחה! 🎉`);
        } catch (err: any) {
            setError(err.message || "שגיאה ביצירת המדריך. אנא ודא שהשרת פועל ונסה שנית.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedHtml || !guideData) return;

        try {
            const blob = new Blob([generatedHtml], { type: 'text/html; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Use the English filenameSlug from the AI, fallback to sanitized topic
            let filename = guideData.filenameSlug || 'guide';

            // Sanitize filename if needed
            filename = filename.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

            a.download = `${filename}.html`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success message
            setError(null);
            setSuccessMessage(`המדריך "${guideData.title}" הורד בהצלחה כ-${filename}.html`);
            console.log(`✅ המדריך "${guideData.title}" הורד בהצלחה כ-${filename}.html`);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

        } catch (err: any) {
            setError(`שגיאה בהורדת הקובץ: ${err.message}`);
            console.error('Download error:', err);
        }
    };

    const handleIdeaSelect = (idea: string) => {
        setTopic(idea);
        setShowIdeas(false);
        setError(null);
    };

    const handleApiKeySubmit = async () => {
        if (!tempApiKey.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/api/set-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: apiKeyProvider,
                    apiKey: tempApiKey
                }),
            });

            if (!response.ok) {
                throw new Error('שגיאה בהגדרת המפתח');
            }

            // Refresh models after setting API key
            const models = await ApiService.getAvailableModels();
            setAvailableModels(models);
            if (models.length > 0) {
                setSelectedModel(models[0].id);
            }

            setShowApiKeyInput(false);
            setTempApiKey('');
            setError(null);
        } catch (err: any) {
            setError(err.message || 'שגיאה בהגדרת המפתח');
        }
    };

    const handleContextChange = (sectionId: string, contextId: string, value: string) => {
        setContextInputs(prev => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [contextId]: value
            }
        }));
    };

    // Helper functions for new fields
    const addBasicAssignment = () => {
        setAssignments(prev => ({
            ...prev,
            basic: [...prev.basic, '']
        }));
    };

    const addAdvancedAssignment = () => {
        setAssignments(prev => ({
            ...prev,
            advanced: [...prev.advanced, '']
        }));
    };

    const updateBasicAssignment = (index: number, value: string) => {
        setAssignments(prev => ({
            ...prev,
            basic: prev.basic.map((item, i) => i === index ? value : item)
        }));
    };

    const updateAdvancedAssignment = (index: number, value: string) => {
        setAssignments(prev => ({
            ...prev,
            advanced: prev.advanced.map((item, i) => i === index ? value : item)
        }));
    };

    const removeBasicAssignment = (index: number) => {
        setAssignments(prev => ({
            ...prev,
            basic: prev.basic.filter((_, i) => i !== index)
        }));
    };

    const removeAdvancedAssignment = (index: number) => {
        setAssignments(prev => ({
            ...prev,
            advanced: prev.advanced.filter((_, i) => i !== index)
        }));
    };

    const addFaqItem = () => {
        setFaqItems(prev => [...prev, { question: '', answer: '' }]);
    };

    const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
        setFaqItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const removeFaqItem = (index: number) => {
        setFaqItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveToMatireal = () => {
        if (!generatedHtml || !guideData) return;

        try {
            // Create a more descriptive filename for matireal
            let filename = guideData.filenameSlug || 'guide';
            filename = filename.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

            const blob = new Blob([generatedHtml], { type: 'text/html; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.html`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setError(null);
            setSuccessMessage(`המדריך נשמר! העתק את ${filename}.html לתיקיית matireal והרץ: node generate-manifest-auto.js`);

            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);

        } catch (err: any) {
            setError(`שגיאה בשמירה: ${err.message}`);
        }
    };

    const handleRunManifest = async () => {
        setManifestLoading(true);
        setError(null);
        try {
            const result = await ApiService.runManifestGenerator();
            if (result.success) {
                setSuccessMessage(`✅ ${result.message}`);
            } else {
                setError(`❌ ${result.message}`);
            }
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            setError(`שגיאה בהרצת הסקריפט: ${err.message}`);
        } finally {
            setManifestLoading(false);
        }
    };

    const generateContextualDescription = () => {
        const contextParts: string[] = [];

        // Add basic description
        if (description.trim()) {
            contextParts.push(`תיאור כללי: ${description}`);
        }

        // Add metadata context
        contextParts.push(`קטגוריה: ${selectedCategory}`);
        contextParts.push(`אמוג'י: ${guideEmoji}`);
        if (shortDescription.trim()) {
            contextParts.push(`תיאור קצר: ${shortDescription}`);
        }

        // Add teasers context
        const teaserParts: string[] = [];
        if (teasers.idea.trim()) teaserParts.push(`רעיון: ${teasers.idea}`);
        if (teasers.warning.trim()) teaserParts.push(`אזהרה: ${teasers.warning}`);
        if (teasers.secret.trim()) teaserParts.push(`סוד מקצועי: ${teasers.secret}`);
        if (teasers.bonus.trim()) teaserParts.push(`בונוס: ${teasers.bonus}`);
        if (teaserParts.length > 0) {
            contextParts.push(`טיזרים פדגוגיים:\n${teaserParts.join('\n')}`);
        }

        // Add assignments context
        if (assignments.basic.length > 0) {
            contextParts.push(`משימות בסיסיות: ${assignments.basic.join(', ')}`);
        }
        if (assignments.advanced.length > 0) {
            contextParts.push(`משימות מתקדמות: ${assignments.advanced.join(', ')}`);
        }

        // Add FAQ context
        if (faqItems.length > 0) {
            const faqText = faqItems.map(item => `ש: ${item.question} ת: ${item.answer}`).join('\n');
            contextParts.push(`שאלות נפוצות:\n${faqText}`);
        }

        // Add structured context inputs
        Object.entries(contextInputs).forEach(([sectionId, contexts]) => {
            const section = GUIDE_STRUCTURE.find(s => s.id === sectionId);
            if (section && Object.keys(contexts).length > 0) {
                const sectionContexts = Object.entries(contexts)
                    .filter(([_, value]) => value.trim())
                    .map(([contextId, value]) => {
                        const contextType = section.contextTypes.find(ct => ct.id === contextId);
                        return `${contextType?.label}: ${value}`;
                    });

                if (sectionContexts.length > 0) {
                    contextParts.push(`${section.title}:\n${sectionContexts.join('\n')}`);
                }
            }
        });

        return contextParts.join('\n\n');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-800" dir="rtl">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">EduGen</h1>
                            <p className="text-xs text-gray-500">מחולל המדריכים המקצועי</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {guideData && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDownload}
                                        data-download-btn
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg hover:shadow-green-500/30 text-sm transform hover:scale-105"
                                        title={`הורד את המדריך "${guideData.title}" כקובץ HTML`}
                                    >
                                        <Download size={16} />
                                        הורד HTML
                                    </button>
                                    <button
                                        onClick={handleSaveToMatireal}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/30 text-xs"
                                        title="שמור למערכת matireal"
                                    >
                                        <Settings size={14} />
                                        matireal
                                    </button>
                                    <button
                                        onClick={handleRunManifest}
                                        disabled={manifestLoading}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-2 rounded-full font-medium transition-all shadow-lg hover:shadow-purple-500/30 text-xs"
                                        title="עדכן את manifest.json בתיקיית matireal"
                                    >
                                        {manifestLoading ? <Loader2 size={14} className="animate-spin" /> : <FileCode size={14} />}
                                        {manifestLoading ? 'מעדכן...' : 'עדכן Manifest'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([generatedHtml], { type: 'text/html' });
                                            const url = URL.createObjectURL(blob);
                                            navigator.clipboard.writeText(url);
                                            setSuccessMessage('קישור למדריך הועתק ללוח!');
                                            setTimeout(() => {
                                                setSuccessMessage(null);
                                                URL.revokeObjectURL(url);
                                            }, 3000);
                                        }}
                                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full font-medium transition-all text-xs"
                                        title="העתק קישור לשיתוף"
                                    >
                                        <Code2 size={14} />
                                        שתף
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <div className="font-medium">{guideData.filenameSlug}.html</div>
                                    <div className="text-xs text-gray-400 space-y-0.5">
                                        <div>📄 {Math.round(new Blob([generatedHtml]).size / 1024)} KB</div>
                                        <div>⏱️ {guideData.readingTime} דקות קריאה</div>
                                        <div>📊 {guideData.difficulty === 'Beginner' ? 'בסיסי' : guideData.difficulty === 'Intermediate' ? 'בינוני' : 'מתקדם'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6">

                {/* Left Panel: Inputs */}
                <aside className="w-full md:w-1/3 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-900">
                            <Sparkles className="text-indigo-500" size={20} />
                            פרטי המדריך
                        </h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">נושא המדריך</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="לדוגמה: יסודות Python..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Idea Dropdown Button */}
                                <div className="mt-2">
                                    <button
                                        onClick={() => setShowIdeas(!showIdeas)}
                                        className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800 transition-colors"
                                    >
                                        <Lightbulb size={12} />
                                        אין לך רעיון? בחר מהרשימה
                                    </button>

                                    {showIdeas && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                            {GUIDE_IDEAS.map((idea, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleIdeaSelect(idea)}
                                                    className="w-full text-right px-4 py-2 text-sm hover:bg-indigo-50 text-gray-700 transition-colors border-b border-gray-100 last:border-0"
                                                >
                                                    {idea}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Model Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Cpu size={16} className="text-indigo-500" />
                                    בחר מודל AI
                                </label>
                                {!backendConnected ? (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong>השרת לא מחובר!</strong>
                                            <p className="text-xs mt-1">
                                                הפעל את השרת עם: <code className="bg-red-100 px-1 rounded">npm run server</code>
                                            </p>
                                        </div>
                                    </div>
                                ) : availableModels.length === 0 ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                                        <div className="flex items-center justify-between">
                                            <span>אין מודלים זמינים</span>
                                            <button
                                                onClick={() => setShowApiKeyInput(true)}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                            >
                                                הוסף API Key
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                                            title="בחר מודל AI"
                                        >
                                            {availableModels.map((model) => (
                                                <option key={model.id} value={model.id}>
                                                    {model.name} - {model.description} ({model.cost})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setShowApiKeyInput(true)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                        >
                                            + הוסף ספק נוסף
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">התאמת תוכן המדריך</label>
                                    <div className="flex items-center gap-2">
                                        {Object.keys(contextInputs).length > 0 && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                {Object.values(contextInputs).reduce((total: number, section) =>
                                                    total + Object.values(section).filter(v => v.trim()).length, 0
                                                )} הנחיות
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setShowStructureView(!showStructureView)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
                                        >
                                            {showStructureView ? '📝 מצב פשוט' : '🎯 מצב מתקדם'}
                                        </button>
                                    </div>
                                </div>

                                {showStructureView && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-600 mb-2">תבניות מהירות:</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {CONTEXT_TEMPLATES.map((template) => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => setContextInputs(template.contexts)}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                                    title={template.description}
                                                >
                                                    {template.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!showStructureView ? (
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="למי המדריך מיועד? מה חשוב להדגיש? איזה כלים להשתמש?"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                                    />
                                ) : (
                                    <div className="space-y-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        {GUIDE_STRUCTURE.map((section) => (
                                            <div key={section.id} className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-lg">{section.icon}</span>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                                                        <p className="text-xs text-gray-500">{section.description}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {section.contextTypes.map((contextType) => (
                                                        <div key={contextType.id}>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                {contextType.label}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={contextInputs[section.id]?.[contextType.id] || ''}
                                                                onChange={(e) => handleContextChange(section.id, contextType.id, e.target.value)}
                                                                placeholder={contextType.placeholder}
                                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                            <div>
                                                <p className="text-xs text-indigo-700 font-medium mb-1">💡 טיפ:</p>
                                                <p className="text-xs text-indigo-600">
                                                    מלא רק את השדות הרלוונטיים. השדות הריקים יתעלמו ו-AI יחליט בעצמו.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setContextInputs({})}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                                            >
                                                🗑️ נקה הכל
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Advanced matireal-compatible fields */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">הגדרות מתקדמות (matireal)</label>
                                    <button
                                        onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                    >
                                        {showAdvancedFields ? '📝 הסתר' : '⚙️ הצג'}
                                    </button>
                                </div>

                                {showAdvancedFields && (
                                    <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        {/* Category and Emoji */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">קטגוריה</label>
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => {
                                                        const category = e.target.value as GuideCategory;
                                                        setSelectedCategory(category);
                                                        setGuideEmoji(CATEGORY_EMOJIS[category]);
                                                    }}
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                                    title="בחר קטגוריה"
                                                    aria-label="בחר קטגוריה"
                                                >
                                                    {GUIDE_CATEGORIES.map(category => (
                                                        <option key={category} value={category}>
                                                            {CATEGORY_EMOJIS[category]} {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">אמוג'י</label>
                                                <input
                                                    type="text"
                                                    value={guideEmoji}
                                                    onChange={(e) => setGuideEmoji(e.target.value)}
                                                    placeholder="🎓"
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Short Description */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">תיאור קצר (עד 50 תווים)</label>
                                            <input
                                                type="text"
                                                value={shortDescription}
                                                onChange={(e) => setShortDescription(e.target.value.slice(0, 50))}
                                                placeholder="תיאור קצר למטא-דאטה..."
                                                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                maxLength={50}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{shortDescription.length}/50 תווים</p>
                                        </div>

                                        {/* Teasers */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-medium text-gray-600">טיזרים פדגוגיים</label>
                                                <select
                                                    onChange={(e) => {
                                                        const template = TEASER_TEMPLATES.find(t => t.id === e.target.value);
                                                        if (template) setTeasers(template.teasers);
                                                    }}
                                                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 cursor-pointer"
                                                    defaultValue=""
                                                    aria-label="בחר תבנית טיזרים"
                                                >
                                                    <option value="" disabled>📋 בחר תבנית...</option>
                                                    {TEASER_TEMPLATES.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={teasers.idea}
                                                    onChange={(e) => setTeasers(prev => ({ ...prev, idea: e.target.value }))}
                                                    placeholder="💡 רעיון מעניין..."
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={teasers.warning}
                                                    onChange={(e) => setTeasers(prev => ({ ...prev, warning: e.target.value }))}
                                                    placeholder="⚠️ אזהרה חשובה..."
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={teasers.secret}
                                                    onChange={(e) => setTeasers(prev => ({ ...prev, secret: e.target.value }))}
                                                    placeholder="🤫 סוד מקצועי..."
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={teasers.bonus}
                                                    onChange={(e) => setTeasers(prev => ({ ...prev, bonus: e.target.value }))}
                                                    placeholder="😎 בונוס מעשי..."
                                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Assignments */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-medium text-gray-600">משימות מדורגות</label>
                                                <select
                                                    onChange={(e) => {
                                                        const template = ASSIGNMENT_TEMPLATES.find(t => t.id === e.target.value);
                                                        if (template) setAssignments({ basic: [...template.basic], advanced: [...template.advanced] });
                                                    }}
                                                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-gradient-to-r from-green-50 to-blue-50 cursor-pointer"
                                                    defaultValue=""
                                                    aria-label="בחר תבנית משימות"
                                                >
                                                    <option value="" disabled>📋 בחר תבנית...</option>
                                                    {ASSIGNMENT_TEMPLATES.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Basic Assignments */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-green-700 font-medium">🎯 משימות בסיסיות</span>
                                                    <button
                                                        onClick={addBasicAssignment}
                                                        className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> הוסף
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    {assignments.basic.map((assignment, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={assignment}
                                                                onChange={(e) => updateBasicAssignment(index, e.target.value)}
                                                                placeholder="משימה בסיסית..."
                                                                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                                                            />
                                                            <button
                                                                onClick={() => removeBasicAssignment(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                                title="הסר משימה בסיסית"
                                                                aria-label="הסר משימה בסיסית"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Advanced Assignments */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-blue-700 font-medium">⚡ משימות מתקדמות</span>
                                                    <button
                                                        onClick={addAdvancedAssignment}
                                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> הוסף
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    {assignments.advanced.map((assignment, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={assignment}
                                                                onChange={(e) => updateAdvancedAssignment(index, e.target.value)}
                                                                placeholder="משימה מתקדמת..."
                                                                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                            />
                                                            <button
                                                                onClick={() => removeAdvancedAssignment(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                                title="הסר משימה מתקדמת"
                                                                aria-label="הסר משימה מתקדמת"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* FAQ */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-medium text-gray-600">שאלות נפוצות (FAQ)</label>
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        onChange={(e) => {
                                                            const template = FAQ_TEMPLATES.find(t => t.id === e.target.value);
                                                            if (template) setFaqItems([...template.items]);
                                                        }}
                                                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-gradient-to-r from-amber-50 to-orange-50 cursor-pointer"
                                                        defaultValue=""
                                                        aria-label="בחר תבנית שאלות נפוצות"
                                                    >
                                                        <option value="" disabled>📋 תבנית...</option>
                                                        {FAQ_TEMPLATES.map(t => (
                                                            <option key={t.id} value={t.id}>{t.name}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={addFaqItem}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> הוסף
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {faqItems.map((item, index) => (
                                                    <div key={index} className="border border-gray-200 rounded p-2 bg-white">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-gray-500">שאלה {index + 1}</span>
                                                            <button
                                                                onClick={() => removeFaqItem(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                                title="הסר שאלה"
                                                                aria-label="הסר שאלה"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={item.question}
                                                            onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                                                            placeholder="השאלה..."
                                                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-1"
                                                        />
                                                        <textarea
                                                            value={item.answer}
                                                            onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                                                            placeholder="התשובה..."
                                                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                                            rows={2}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !topic}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95 ${loading || !topic
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        מעבד...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        צור מדריך אוטומטי
                                    </>
                                )}
                            </button>
                            {error && <div className="text-red-600 text-sm mt-2 text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
                            {successMessage && <div className="text-green-600 text-sm mt-2 text-center bg-green-50 p-3 rounded-lg border border-green-100 flex items-center justify-center gap-2">
                                <Download size={16} />
                                {successMessage}
                            </div>}
                        </div>
                    </div>

                    {/* API Key Input Modal */}
                    {showApiKeyInput && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowApiKeyInput(false)}>
                            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">הוסף API Key</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">בחר ספק</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setApiKeyProvider('gemini')}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${apiKeyProvider === 'gemini'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Google Gemini
                                            </button>
                                            <button
                                                onClick={() => setApiKeyProvider('openrouter')}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${apiKeyProvider === 'openrouter'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                OpenRouter
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                        <input
                                            type="password"
                                            value={tempApiKey}
                                            onChange={(e) => setTempApiKey(e.target.value)}
                                            placeholder={apiKeyProvider === 'gemini' ? 'AIzaSy...' : 'sk-or-v1-...'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {apiKeyProvider === 'gemini'
                                                ? 'קבל מפתח חינם מ-aistudio.google.com/apikey'
                                                : 'קבל מפתח מ-openrouter.ai/keys'
                                            }
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowApiKeyInput(false)}
                                            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            ביטול
                                        </button>
                                        <button
                                            onClick={handleApiKeySubmit}
                                            disabled={!tempApiKey.trim()}
                                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${tempApiKey.trim()
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            שמור
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-2 text-sm">איך זה עובד?</h3>
                        <ol className="list-decimal list-inside text-sm text-indigo-800 space-y-2">
                            <li>הזן נושא או בחר מהרשימה.</li>
                            <li>ה-AI יבנה מערך שיעור מלא כולל תרגול.</li>
                            <li>המערכת תשתמש בתבנית Master רשמית.</li>
                            <li>קבל קובץ HTML מוכן לפרסום!</li>
                        </ol>

                        {guideData && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-bold text-green-800 mb-1 text-xs">💡 אינטגרציה עם matireal:</h4>
                                <p className="text-xs text-green-700 mb-2">
                                    המדריך שנוצר תואם למערכת matireal (מערכת ניהול מדריכים אוטומטית).
                                </p>
                                <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                                    <strong>שלבים:</strong>
                                    <br />1. העתק את הקובץ לתיקיית matireal
                                    <br />2. הרץ: <code className="bg-green-200 px-1 rounded">node generate-manifest-auto.js</code>
                                    <br />3. המדריך יתווסף אוטומטית לקטלוג ולמפת האתר
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Panel: Preview */}
                <section className="w-full md:w-2/3 flex flex-col h-[calc(100vh-8rem)]">
                    {loading ? (
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center p-8">
                            <div className="bg-indigo-50 p-8 rounded-full mb-6 relative">
                                <Loader2 size={64} className="text-indigo-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={24} className="text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{loadingText}</h3>
                            <p className="text-gray-500 max-w-sm mb-8">ה-AI בונה עבורך מדריך מקצועי מותאם אישית. זה עשוי לקחת כדקה...</p>

                            {/* Progress visualization */}
                            <div className="w-full max-w-md">
                                <div className="space-y-3">
                                    {GUIDE_STRUCTURE.map((section, index) => {
                                        const currentStepIndex = LOADING_STEPS.findIndex(step => step === loadingText);
                                        const isCompleted = currentStepIndex > index;
                                        const isActive = currentStepIndex === index;

                                        return (
                                            <div key={section.id} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isActive ? 'bg-indigo-50 border border-indigo-200' :
                                                isCompleted ? 'bg-green-50 border border-green-200' :
                                                    'bg-gray-50 border border-gray-100'
                                                }`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-green-500 text-white' :
                                                    isActive ? 'bg-indigo-500 text-white animate-pulse' :
                                                        'bg-gray-300 text-gray-600'
                                                    }`}>
                                                    {isCompleted ? '✓' : section.icon}
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <span className={`text-sm font-medium ${isActive ? 'text-indigo-700' :
                                                        isCompleted ? 'text-green-700' :
                                                            'text-gray-500'
                                                        }`}>
                                                        {section.title}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : generatedHtml ? (
                        <div className="flex flex-col h-full animate-in fade-in duration-500">
                            {/* Tabs */}
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('preview')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <LayoutTemplate size={16} />
                                        תצוגה מקדימה
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('code')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'code' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <FileCode size={16} />
                                        קוד מקור
                                    </button>
                                </div>

                                {/* Secondary Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([generatedHtml], { type: 'text/html' });
                                            const url = URL.createObjectURL(blob);
                                            window.open(url, '_blank');
                                            setTimeout(() => URL.revokeObjectURL(url), 1000);
                                        }}
                                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-blue-200 hover:border-blue-300"
                                        title="פתח בחלון חדש"
                                    >
                                        <LayoutTemplate size={14} />
                                        פתח
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-green-200 hover:border-green-300"
                                        title="הורד מדריך מוכן"
                                    >
                                        <Download size={14} />
                                        הורד
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                                {activeTab === 'preview' ? (
                                    <GuidePreview htmlContent={generatedHtml} />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedHtml);
                                                setSuccessMessage('קוד HTML הועתק ללוח!');
                                                setTimeout(() => setSuccessMessage(null), 2000);
                                            }}
                                            className="absolute top-2 left-2 z-10 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
                                            title="העתק קוד HTML"
                                        >
                                            <Code2 size={12} />
                                            העתק קוד
                                        </button>
                                        <pre className="w-full h-full p-4 overflow-auto text-xs bg-gray-900 text-green-400 font-mono text-left pt-12" dir="ltr">
                                            {generatedHtml}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="text-center mb-8">
                                <div className="bg-indigo-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <BookOpen size={32} className="text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">מבנה המדריך</h3>
                                <p className="text-gray-600 text-sm">כל מדריך נבנה לפי המבנה הפדגוגי הבא:</p>
                            </div>

                            <div className="space-y-4 max-w-2xl mx-auto">
                                {GUIDE_STRUCTURE.map((section, index) => (
                                    <div key={section.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{section.icon}</span>
                                                <h4 className="font-semibold text-gray-900">{section.title}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {section.contextTypes.map((contextType) => (
                                                    <span key={contextType.id} className="text-xs bg-white px-2 py-1 rounded border text-gray-500">
                                                        {contextType.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                                    <p className="text-sm text-green-700">
                                        <strong>💡 רעיון:</strong> השתמש במצב המתקדם בצד שמאל כדי להתאים את התוכן לצרכים שלך!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
};

export default App;