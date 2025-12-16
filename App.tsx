import React, { useState, useEffect } from 'react';
import { BookOpen, Code2, Download, Wand2, Loader2, Sparkles, LayoutTemplate, FileCode, Lightbulb, AlertCircle, Cpu } from 'lucide-react';
import { ApiService, ModelInfo } from './services/apiService';
import { generateGuideHtml } from './utils/template';
import { GuideData } from './types';
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

  // --- Data & Tech Literacy ---
  "ניתוח נתונים ב-Excel למתקדמים (כולל כלי AI)",
  "מבוא ל-Python לאנשי שיווק ומנהלים",
  "יסודות ה-SQL לשליפת נתונים ודוחות",
  "ויזואליזציה של נתונים (Data Storytelling)",
  "בניית אתר אינטרנט תדמיתי ללא קוד (Wix/WordPress)",
  "אבטחת מידע אישי וסייבר - הגנה מפני פישינג",
  "פתרון תקלות מחשב בסיסיות ללא טכנאי",
  "מבוא למחשוב ענן (Cloud Computing) - AWS/Azure",

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

  // --- Soft Skills & Leadership ---
  "חשיבה ביקורתית: איך לקבל החלטות טובות יותר",
  "פתרון בעיות מורכבות (Complex Problem Solving)",
  "אינטליגנציה רגשית (EQ) בניהול צוותים",
  "עמידה מול קהל ופרזנטציה אפקטיבית (Storytelling)",
  "ניהול קונפליקטים ותקשורת מקרבת (NVC)",
  "גמישות מחשבתית והסתגלות לשינויים (Adaptability)",
  "ניהול צוותים היברידיים (מרחוק ומקרוב)",
  "מתן וקבלת משוב (Feedback) בונה",

  // --- Finance & Life Skills ---
  "אוריינות פיננסית: ניהול תקציב אישי והשקעות",
  "מבוא לשוק ההון והשקעות פסיביות",
  "תזונה נכונה ואורח חיים בריא לסטודנטים עסוקים",
  "מיינדפולנס והפחתת לחצים בעבודה",
  "תכנון טיולים חכם וחסכוני עם כלי AI",
  "לימוד שפה חדשה בעזרת מורים וירטואליים"
];

const LOADING_STEPS = [
  "מנתח את בקשתך...",
  "בונה את המבנה הפדגוגי...",
  "מנסח את התוכן המקצועי...",
  "מייצר דוגמאות ותרגילים...",
  "מעצב את המדריך...",
  "כמעט מוכן..."
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

      const data = await ApiService.generateGuide({
        topic,
        description,
        provider: selectedModelInfo.provider,
        modelId: selectedModelInfo.id
      });

      setGuideData(data);
      const html = generateGuideHtml(data);
      setGeneratedHtml(html);
    } catch (err: any) {
      setError(err.message || "שגיאה ביצירת המדריך. אנא ודא שהשרת פועל ונסה שנית.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedHtml || !guideData) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Use the English filenameSlug from the AI, fallback to 'guide' if missing (though schema requires it)
    const filename = guideData.filenameSlug || 'guide';
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleIdeaSelect = (idea: string) => {
    setTopic(idea);
    setShowIdeas(false);
    setError(null);
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
                <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-sm text-sm"
                >
                <Download size={16} />
                הורד HTML
                </button>
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
                                אין מודלים זמינים. הגדר API keys בקובץ .env.local
                            </div>
                        ) : (
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            >
                                {availableModels.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name} - {model.description} ({model.cost})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">הקשר נוסף (אופציונלי)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="למי המדריך מיועד? מה חשוב להדגיש?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                            loading || !topic
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
                </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-2 text-sm">איך זה עובד?</h3>
                <ol className="list-decimal list-inside text-sm text-indigo-800 space-y-2">
                    <li>הזן נושא או בחר מהרשימה.</li>
                    <li>ה-AI יבנה מערך שיעור מלא כולל תרגול.</li>
                    <li>המערכת תשתמש בתבנית Master רשמית.</li>
                    <li>קבל קובץ HTML מוכן לפרסום!</li>
                </ol>
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
                    <p className="text-gray-500 max-w-sm">ה-AI בונה עבורך מדריך מקצועי מותאם אישית. זה עשוי לקחת כדקה...</p>
                 </div>
            ) : generatedHtml ? (
                <div className="flex flex-col h-full animate-in fade-in duration-500">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <LayoutTemplate size={16} />
                            תצוגה מקדימה
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                                activeTab === 'code' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FileCode size={16} />
                            קוד מקור
                        </button>
                    </div>

                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                        {activeTab === 'preview' ? (
                            <GuidePreview htmlContent={generatedHtml} />
                        ) : (
                            <pre className="w-full h-full p-4 overflow-auto text-xs bg-gray-900 text-green-400 font-mono text-left" dir="ltr">
                                {generatedHtml}
                            </pre>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <Code2 size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">האזור ריק עדיין</h3>
                    <p className="max-w-xs mx-auto">הזן נושא בצד ימין ולחץ על "צור מדריך אוטומטי" כדי לראות את הקסם קורה.</p>
                </div>
            )}
        </section>

      </main>
    </div>
  );
};

export default App;