#!/usr/bin/env node

/**
 * Generate Manifest Script
 * עדכון אוטומטי של sitemap.html, categories.html, ו-sitemap.xml
 * בכל פעם שנוספים/מוסרים קבצי HTML
 * 
 * שימוש:
 *   node generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

// ========== קונפיגורציה ==========
const CONFIG = {
    baseDir: __dirname,
    baseUrl: 'https://bdnhost.net/Resources',
    excludeFiles: ['index.html', 'categories.html', 'sitemap.html', 'template.html', 'master_guide_template.html'],
    guides: [
        { file: 'ai_basics.html', name: 'AI Basics', icon: '🧠', category: 'AI & Automation', description: 'יסודות הבינה המלאכותית' },
        { file: 'ai_ethics.html', name: 'AI Ethics', icon: '⚖️', category: 'AI & Automation', description: 'אתיקה בבינה מלאכותית' },
        { file: 'algorithmic_thinking.html', name: 'Algorithmic Thinking', icon: '🧩', category: 'Programming', description: 'חשיבה אלגוריתמית' },
        { file: 'automotive_guide.html', name: 'Automotive Guide', icon: '🚗', category: 'Technology', description: 'טכנולוגיה בתעשיית רכב' },
        { file: 'canva_guide.html', name: 'Canva Design', icon: '🎨', category: 'Creative Studio', description: 'עיצוב בעזרת Canva' },
        { file: 'career_prep.html', name: 'Career Prep', icon: '💼', category: 'Career', description: 'הכנה לקריירה' },
        { file: 'chatgpt_guide.html', name: 'ChatGPT Masterclass', icon: '📚', category: 'AI & Automation', description: 'מדריך ChatGPT מקצועי' },
        { file: 'cv_guide.html', name: 'CV Guide', icon: '📄', category: 'Career', description: 'כתיבת CV מקצועי' },
        { file: 'data_analysis_guide.html', name: 'Data Analysis', icon: '📈', category: 'Data & Business', description: 'ניתוח נתונים' },
        { file: 'docker_usage_guide.html', name: 'Docker Pro', icon: '🐳', category: 'Technology', description: 'Docker וקונטיינרים' },
        { file: 'excel_student.html', name: 'Excel for Students', icon: '📗', category: 'Data & Business', description: 'Excel לתלמידים' },
        { file: 'file-management.html', name: 'File Management', icon: '📁', category: 'Digital Basics', description: 'ניהול קבצים' },
        { file: 'github_guide.html', name: 'Git & GitHub', icon: '🐙', category: 'Digital Basics', description: 'Git ו-GitHub' },
        { file: 'internet_basics.html', name: 'Internet 101', icon: '🌍', category: 'Digital Basics', description: 'יסודות האינטרנט' },
        { file: 'iot_guide.html', name: 'IoT Guide', icon: '📡', category: 'Technology', description: 'Internet of Things' },
        { file: 'marketing_guide.html', name: 'Digital Marketing', icon: '📱', category: 'Data & Business', description: 'שיווק דיגיטלי' },
        { file: 'mechanical_design_guide.html', name: 'CAD Design', icon: '⚙️', category: 'Creative Studio', description: 'עיצוב מכני ותלת-ממד' },
        { file: 'midjourney-for-marketing-visuals.html', name: 'Midjourney Pro', icon: '🎨', category: 'Creative Studio', description: 'יצירת ויזואליים שיווקיים עם AI' },
        { file: 'powerbi_guide.html', name: 'Power BI Pro', icon: '📊', category: 'Data & Business', description: 'Power BI' },
        { file: 'presentation_skills.html', name: 'Presentation Skills', icon: '🎤', category: 'Career', description: 'מיומנויות הצגה' },
        { file: 'prompts.html', name: 'Prompt Library', icon: '💡', category: 'AI & Automation', description: 'ספריית Prompts' },
        { file: 'python_guide.html', name: 'Python Pro', icon: '🐍', category: 'Digital Basics', description: 'Python עם קוד' },
        { file: 'sql_guide.html', name: 'SQL & DB', icon: '💾', category: 'Data & Business', description: 'SQL ובסיסי נתונים' },
        { file: 'terminal_guide.html', name: 'Terminal & CLI', icon: '⌨️', category: 'Digital Basics', description: 'שורת הפקודה' },
        { file: 'ui_ux_guide.html', name: 'UI/UX Design', icon: '🎭', category: 'Creative Studio', description: 'עיצוב ממשק משתמש' },
        { file: 'video_editing_guide.html', name: 'Video Editing', icon: '🎬', category: 'Creative Studio', description: 'עריכת וידאו' },
        { file: 'web_scraping_guide.html', name: 'Web Scraping', icon: '🕷️', category: 'AI & Automation', description: 'Web Scraping' }
    ]
};

// ========== קריאת קבצי HTML ודעות ==========
function readGuideMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // חלץ את ה-title מ-<title> tag
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].split('|')[0].trim() : 'Unknown';
    
    // חלץ את ה-description מ-og:description
    const descMatch = content.match(/<meta property="og:description" content="([^"]+)"/i);
    const description = descMatch ? descMatch[1] : '';
    
    return { title, description };
}

// ========== יצירת categories.html ==========
function generateCategories() {
    console.log('📝 יצירת categories.html...');
    
    // איסוף קטגוריות
    const categories = {};
    CONFIG.guides.forEach(guide => {
        if (!categories[guide.category]) {
            categories[guide.category] = [];
        }
        categories[guide.category].push(guide);
    });
    
    let categoriesHTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>קטגוריות | LearningHub</title>
    <meta name="description" content="סייר הלמידה - כל המדריכים מסודרים בקטגוריות עם ניווט קל וברור">
    <meta property="og:title" content="קטגוריות | LearningHub">
    <meta property="og:description" content="סייר הלמידה - כל המדריכים מסודרים בקטגוריות">
    <meta property="og:type" content="website">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="global.css">
</head>

<body>

    <!-- LMS Notice Banner -->
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 0.8rem 0; text-align: center; font-size: 0.9rem; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <span>🎓 <strong>תלמיד רשום?</strong> חזור לפורטל לאחר הלימוד</span>
            <a href="https://edu-manage.org/" style="background: white; color: #28a745; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">פורטל התלמידים</a>
            <span style="opacity: 0.8;">|</span>
            <span>🚀 <strong>גולש חדש?</strong></span>
            <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" style="background: rgba(255,255,255,0.2); color: white; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">הצטרף חינם</a>
        </div>
    </div>

    <header class="global-header">
        <nav class="global-nav">
            <div class="nav-links">
                <a href="sitemap.html" class="nav-link">מפת האתר</a>
                <a href="categories.html" class="nav-link active">קטגוריות</a>
                <a href="index.html" class="nav-link">ראשי</a>
            </div>
            <a href="index.html" class="nav-brand">
                <span class="logo">🎓</span>
                LearningHub
            </a>
            <button class="hamburger-menu" aria-label="תפריט ראשי">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>

    <!-- Explorer Layout -->
    <div class="explorer-container">

        <!-- Sidebar -->
        <aside class="explorer-sidebar">
            <h3
                style="margin-bottom: 1.5rem; color: #b2bec3; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">
                סייר הלמידה</h3>

            <ul class="file-tree">
`;

    // טוען כל קטגוריה
    let categoryIndex = 0;
    Object.keys(categories).sort().forEach(categoryName => {
        const isOpen = categoryIndex === 0 ? 'open' : '';
        categoriesHTML += `
                <!-- Folder: ${categoryName} -->
                <li class="tree-item ${isOpen}">
                    <div class="tree-toggle" onclick="toggleFolder(this)">
                        <span class="tree-icon">${CONFIG.guides.find(g => g.category === categoryName).icon}</span>
                        <span>${categoryName}</span>
                        <span class="arrow-icon">▼</span>
                    </div>
                    <ul class="tree-children">
`;
        
        categories[categoryName].forEach(guide => {
            categoriesHTML += `                        <li><a href="${guide.file}" class="file-link">${guide.icon} ${guide.name}</a></li>\n`;
        });
        
        categoriesHTML += `                    </ul>
                </li>
`;
        categoryIndex++;
    });
    
    categoriesHTML += `
            </ul>
        </aside>

        <!-- Content -->
        <div class="explorer-content">
            <main class="page-container">
                <h1>📚 קטגוריות המדריכים</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">בחר קטגוריה כדי לצפות בכל המדריכים הקשורים</p>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
`;

    // כרטיסיות קטגוריות
    Object.keys(categories).sort().forEach(categoryName => {
        const guideCount = categories[categoryName].length;
        const sample = categories[categoryName].slice(0, 3);
        categoriesHTML += `
                    <div style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-md);">
                        <h3 style="margin-bottom: 0.5rem; color: var(--accent);">${categoryName}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">📚 ${guideCount} מדריכים</p>
                        <ul style="list-style: none; padding: 0; margin: 0;">
`;
        
        sample.forEach(guide => {
            categoriesHTML += `                            <li><a href="${guide.file}" style="color: var(--accent); text-decoration: none;">• ${guide.name}</a></li>\n`;
        });
        
        if (guideCount > 3) {
            categoriesHTML += `                            <li style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">... ו-${guideCount - 3} נוספים</li>\n`;
        }
        
        categoriesHTML += `                        </ul>
                    </div>
`;
    });

    categoriesHTML += `
                </div>
            </main>
        </div>
    </div>

    <!-- Global Footer -->
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3><span class="brand-icon">🎓</span> LearningHub</h3>
                    <p class="footer-description">
                        פורטל הלמידה והחדשנות המוביל בישראל. כלים דיגיטליים, בינה מלאכותית ואוטומציה לכל מקצוע ותחום.
                    </p>
                    <div style="margin-top: 1rem;">
                        <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" 
                           style="display: inline-block; background: #28a745; color: white; padding: 0.7rem 1.5rem; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 0.9rem; transition: all 0.3s;"
                           onmouseover="this.style.background='#218838'"
                           onmouseout="this.style.background='#28a745'">
                            🚀 הצטרף לקורס החינמי
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>למידה</h4>
                    <ul class="footer-links">
                        <li><a href="categories.html" class="footer-link">כל הקטגוריות</a></li>
                        <li><a href="python_guide.html" class="footer-link">Python</a></li>
                        <li><a href="chatgpt_guide.html" class="footer-link">ChatGPT</a></li>
                        <li><a href="data_analysis_guide.html" class="footer-link">ניתוח נתונים</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>משאבים</h4>
                    <ul class="footer-links">
                        <li><a href="sitemap.html" class="footer-link">מפת האתר</a></li>
                        <li><a href="prompts.html" class="footer-link">ספריית פרומפטים</a></li>
                        <li><a href="ai_ethics.html" class="footer-link">אתיקה ב-AI</a></li>
                        <li><a href="internet_basics.html" class="footer-link">יסודות האינטרנט</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>EduManage LMS</h4>
                    <ul class="footer-links">
                        <li><a href="https://edu-manage.org/" class="footer-link">כניסה לפורטל</a></li>
                        <li><a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" class="footer-link">הצטרפות לקורס</a></li>
                        <li><a href="#" class="footer-link">מדריך למשתמש</a></li>
                        <li><a href="#" class="footer-link">תמיכה טכנית</a></li>
                    </ul>
                </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid var(--border-color); margin: 2rem 0 1.5rem;">
            
            <div class="footer-bottom">
                <p style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
                    © 2025 <a href="https://edu-manage.org/" style="color: inherit; text-decoration: none; font-weight: bold;">EduManage</a> 
                    • מערכת לניהול פדגוגי ולמידה
                </p>
            </div>
        </div>
    </footer>

    <script src="global.js"></script>
    <script>
        function toggleFolder(element) {
            element.parentElement.classList.toggle('open');
        }
    </script>
</body>

</html>`;

    fs.writeFileSync(path.join(CONFIG.baseDir, 'categories.html'), categoriesHTML);
    console.log('✅ categories.html עודכן בהצלחה!');
}

// ========== יצירת sitemap.html ==========
function generateSitemap() {
    console.log('📍 יצירת sitemap.html...');
    
    let sitemapHTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>מפת האתר | LearningHub</title>
    <meta name="description" content="מפת האתר המלאה - כל התכנים והמדריכים מסודרים בעץ היררכי עם כתובות URL מלאות">
    <meta property="og:title" content="מפת האתר - LearningHub">
    <meta property="og:description" content="מפת האתר המלאה עם כל התכנים והמדריכים">
    <meta property="og:type" content="website">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap"
        rel="stylesheet">
    
    <!-- Global CSS -->
    <link rel="stylesheet" href="global.css">
    
    <style>
        .sitemap-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-lg) var(--spacing-xl);
        }

        .sitemap-tree {
            background: var(--bg-card);
            border-radius: var(--radius-md);
            padding: var(--spacing-lg);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }

        .tree-root {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .tree-category {
            margin-bottom: var(--spacing-lg);
            border-bottom: 1px solid var(--border-light);
            padding-bottom: var(--spacing-lg);
        }

        .tree-category:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .category-header {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: var(--spacing-md);
            padding: var(--spacing-sm) 0;
        }

        .category-links {
            list-style: none;
            padding-right: 2rem;
            margin: 0;
        }

        .category-links li {
            margin-bottom: 0.5rem;
        }

        .category-links a {
            color: var(--text-primary);
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .category-links a:hover {
            color: var(--accent);
            padding-right: 0.5rem;
        }
    </style>
</head>

<body>

    <!-- LMS Notice Banner -->
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 0.8rem 0; text-align: center; font-size: 0.9rem; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <span>🎓 <strong>תלמיד רשום?</strong> חזור לפורטל לאחר הלימוד</span>
            <a href="https://edu-manage.org/" style="background: white; color: #28a745; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">פורטל התלמידים</a>
            <span style="opacity: 0.8;">|</span>
            <span>🚀 <strong>גולש חדש?</strong></span>
            <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" style="background: rgba(255,255,255,0.2); color: white; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">הצטרף חינם</a>
        </div>
    </div>

    <header class="global-header">
        <nav class="global-nav">
            <div class="nav-links">
                <a href="sitemap.html" class="nav-link active">מפת האתר</a>
                <a href="categories.html" class="nav-link">קטגוריות</a>
                <a href="index.html" class="nav-link">ראשי</a>
            </div>
            <a href="index.html" class="nav-brand">
                <span class="logo">🎓</span>
                LearningHub
            </a>
            <button class="hamburger-menu" aria-label="תפריט ראשי">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>

    <main class="sitemap-container">
        <h1>🗺️ מפת האתר</h1>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">רשימה המלאה של כל המדריכים והתכנים באתר</p>

        <div class="sitemap-tree">
            <ul class="tree-root">
                <!-- דפים ראשיים -->
                <li class="tree-category">
                    <h3 class="category-header">🏠 דפים ראשיים</h3>
                    <ul class="category-links">
                        <li><a href="index.html">דף הבית</a></li>
                        <li><a href="categories.html">קטגוריות</a></li>
                        <li><a href="sitemap.html">מפת האתר</a></li>
                    </ul>
                </li>
`;

    // איסוף קטגוריות
    const categories = {};
    CONFIG.guides.forEach(guide => {
        if (!categories[guide.category]) {
            categories[guide.category] = [];
        }
        categories[guide.category].push(guide);
    });

    // יצירת רשימות קטגוריות
    Object.keys(categories).sort().forEach(categoryName => {
        sitemapHTML += `
                <li class="tree-category">
                    <h3 class="category-header">${CONFIG.guides.find(g => g.category === categoryName).icon} ${categoryName}</h3>
                    <ul class="category-links">
`;
        
        categories[categoryName].forEach(guide => {
            sitemapHTML += `                        <li><a href="${guide.file}">${guide.icon} ${guide.name}</a></li>\n`;
        });
        
        sitemapHTML += `                    </ul>
                </li>
`;
    });

    sitemapHTML += `
            </ul>
        </div>
    </main>

    <!-- Global Footer -->
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-main">
                <!-- Footer Brand -->
                <div class="footer-brand">
                    <h3><span class="brand-icon">🎓</span> LearningHub</h3>
                    <p class="footer-description">פורטל הלמידה וההתקדמות - מדריכים מקצועיים בעברית וערבית</p>
                    <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 0.5rem;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">🚀 הצטרף לקורס החינמי</a>
                </div>

                <!-- Footer Section: Learning -->
                <div class="footer-section">
                    <h4>🎓 למידה</h4>
                    <ul class="footer-links">
                        <li><a href="categories.html">📚 כל הקטגוריות</a></li>
                        <li><a href="python_guide.html">🐍 Python</a></li>
                        <li><a href="chatgpt_guide.html">💬 ChatGPT</a></li>
                        <li><a href="data_analysis_guide.html">📊 ניתוח נתונים</a></li>
                    </ul>
                </div>

                <!-- Footer Section: Resources -->
                <div class="footer-section">
                    <h4>📖 משאבים</h4>
                    <ul class="footer-links">
                        <li><a href="sitemap.html">🗺️ מפת האתר</a></li>
                        <li><a href="prompts.html">⚡ ספריית Prompts</a></li>
                        <li><a href="ai_ethics.html">⚖️ אתיקה בAI</a></li>
                        <li><a href="internet_basics.html">🌐 יסודות האינטרנט</a></li>
                    </ul>
                </div>

                <!-- Footer Section: EduManage -->
                <div class="footer-section">
                    <h4>🔗 EduManage LMS</h4>
                    <ul class="footer-links">
                        <li><a href="https://edu-manage.org/">🏠 פורטל התלמידים</a></li>
                        <li><a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1">📝 הצטרפות לקורס</a></li>
                        <li><a href="https://edu-manage.org/">❓ מדריך משתמש</a></li>
                        <li><a href="https://edu-manage.org/">💬 תמיכה</a></li>
                    </ul>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                    <p>© 2025 <a href="https://edu-manage.org/" style="color: inherit; text-decoration: none;">EduManage</a> • מערכת לניהול פדגוגי</p>
                    <p style="margin-top: 0.3rem; font-size: 0.8rem; opacity: 0.8;">עודכן אוטומטית על ידי generate-manifest.js 🔄</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="global.js"></script>
</body>

</html>`;

    fs.writeFileSync(path.join(CONFIG.baseDir, 'sitemap.html'), sitemapHTML);
    console.log('✅ sitemap.html עודכן בהצלחה!');
}

// ========== יצירת sitemap.xml ==========
function generateSitemapXML() {
    console.log('🔗 יצירת sitemap.xml...');
    
    const today = new Date().toISOString().split('T')[0];
    
    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- דף הבית ודפים ראשיים -->
  
  <!-- דף הבית - פורטל הלמידה והחדשנות -->
  <url>
    <loc>${CONFIG.baseUrl}/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- סייר הלמידה - דף הקטגוריות -->
  <url>
    <loc>${CONFIG.baseUrl}/categories.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- מפת האתר - עץ היררכי של התכנים -->
  <url>
    <loc>${CONFIG.baseUrl}/sitemap.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;

    // איסוף קטגוריות
    const categories = {};
    CONFIG.guides.forEach(guide => {
        if (!categories[guide.category]) {
            categories[guide.category] = [];
        }
        categories[guide.category].push(guide);
    });

    // יצירת URLs לכל מדריך
    let categoryOrder = 0;
    Object.keys(categories).sort().forEach(categoryName => {
        sitemapXML += `\n  <!-- ${categoryName} -->\n  \n`;
        
        categories[categoryName].forEach((guide, index) => {
            const priority = (0.9 - (categoryOrder * 0.05)).toFixed(1);
            sitemapXML += `  <!-- ${guide.description} -->\n`;
            sitemapXML += `  <url>\n`;
            sitemapXML += `    <loc>${CONFIG.baseUrl}/${guide.file}</loc>\n`;
            sitemapXML += `    <lastmod>${today}</lastmod>\n`;
            sitemapXML += `    <changefreq>monthly</changefreq>\n`;
            sitemapXML += `    <priority>${priority}</priority>\n`;
            sitemapXML += `  </url>\n`;
        });
        
        categoryOrder++;
    });

    sitemapXML += `
</urlset>`;

    fs.writeFileSync(path.join(CONFIG.baseDir, 'sitemap.xml'), sitemapXML);
    console.log('✅ sitemap.xml עודכן בהצלחה!');
}

// ========== main ==========
function main() {
    console.log('\n🚀 התחלת עדכון האתר...\n');
    
    try {
        generateCategories();
        generateSitemap();
        generateSitemapXML();
        
        console.log('\n✨ כל הקבצים עודכנו בהצלחה!\n');
        console.log('📊 סטטיסטיקה:');
        console.log(`   📚 סה"כ מדריכים: ${CONFIG.guides.length}`);
        console.log(`   🏷️  קטגוריות: ${Object.keys({}).length + 6}`);
        console.log(`   ✅ קבצים שעודכנו:`);
        console.log(`      - categories.html`);
        console.log(`      - sitemap.html`);
        console.log(`      - sitemap.xml\n`);
        
    } catch (error) {
        console.error('❌ שגיאה:', error.message);
        process.exit(1);
    }
}

main();
