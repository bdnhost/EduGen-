#!/usr/bin/env node

/**
 * 🤖 Smart Guide Auto-Detector
 * סקריפט אוטומטי לגילוי, סיווג והוספת מדריכים חדשים
 * 
 * - סורק את כל קבצי ה-HTML
 * - חולץ metadata מ-HTML
 * - מסווג אוטומטי לקטגוריה
 * - מעדכן categories.html, sitemap.html, sitemap.xml
 */

const fs = require('fs');
const path = require('path');

// ========== קונפיגורציה ==========
const CONFIG = {
    baseDir: __dirname,
    baseUrl: 'https://bdnhost.net/Resources',
    excludeFiles: [
        'index.html', 'categories.html', 'sitemap.html', 'template.html', 
        'master_guide_template.html', 'global.js', 'prompts.html'
    ],
    // קטגוריות + keywords לסיווג אוטומטי
    categoryKeywords: {
        'AI & Automation': ['ai', 'chatgpt', 'automation', 'machine learning', 'בינה מלאכותית', 'חדשנות', 'prompts', 'web scraping', 'scraping'],
        'Creative Studio': ['design', 'canva', 'video', 'midjourney', 'ui', 'ux', 'editing', 'עיצוב', 'גרפי', 'ויזואלי', 'creative'],
        'Data & Business': ['data', 'analysis', 'power bi', 'excel', 'marketing', 'sql', 'business', 'analytics', 'נתונים', 'עסקי'],
        'Digital Basics': ['python', 'terminal', 'github', 'git', 'internet', 'file', 'management', 'basics', 'fundamental', 'בסיסי', 'אינטרנט'],
        'Technology': ['docker', 'iot', 'automotive', 'tech', 'technology', 'technolog', 'טכנולוגיה', 'חיישנים'],
        'Career': ['career', 'cv', 'presentation', 'skills', 'קריירה', 'קורות חיים', 'הצגה']
    },
    // emoji mapping
    categoryEmojis: {
        'AI & Automation': '🧠',
        'Creative Studio': '🎨',
        'Data & Business': '📊',
        'Digital Basics': '📚',
        'Technology': '🚀',
        'Career': '💼',
        'Programming': '🧩'
    }
};

// ========== 🔍 פונקציית חילוץ metadata מ-HTML ==========
function extractGuideMetadata(filePath, fileName) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // 🎯 קודם בדוק אם יש JSON comment בתחילת הקובץ
        const jsonCommentMatch = content.match(/<!--\s*({[\s\S]*?"guide_metadata"[\s\S]*?})\s*-->/);
        if (jsonCommentMatch) {
            try {
                const metadata = JSON.parse(jsonCommentMatch[1]).guide_metadata;
                if (metadata.name && metadata.category) {
                    return {
                        title: metadata.name,
                        description: metadata.description || 'מדריך חדש',
                        keywords: metadata.category.toLowerCase(),
                        emoji: metadata.icon || '📖',
                        category: metadata.category,
                        isManual: true // סימן שזה תוקן ידנית
                    };
                }
            } catch (e) {
                // אם JSON לא תקין, המשך לאוטו-דטקציה
            }
        }
        
        // אם אין JSON או שהוא לא תקין, בצע אוטו-דטקציה
        // חלץ title

        const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].split('|')[0].trim() : fileName.replace('.html', '').replace(/-/g, ' ');
        
        // חלץ description
        const descMatch = content.match(/<meta name="description" content="([^"]+)"/i);
        const description = descMatch ? descMatch[1].substring(0, 100) : 'מדריך למדריך זה';
        
        // חלץ keywords
        const keywordsMatch = content.match(/<meta name="keywords" content="([^"]+)"/i);
        const keywords = keywordsMatch ? keywordsMatch[1].toLowerCase() : '';
        
        // חלץ emoji מהכותרת אם קיים
        const emojiMatch = title.match(/^([\p{Emoji}]+)\s+/u);
        let emoji = emojiMatch ? emojiMatch[1] : '📖';
        
        // נקה את הכותרת מ-emoji
        title = title.replace(/^[\p{Emoji}]+\s+/u, '').trim();
        
        return {
            title,
            description,
            keywords,
            emoji
        };
    } catch (e) {
        console.error(`❌ שגיאה בקריאת ${fileName}:`, e.message);
        return null;
    }
}

// ========== 🎯 פונקציית סיווג אוטומטי לקטגוריה ==========
function classifyCategory(fileName, title, keywords, manualCategory = null) {
    // אם הודגדר קטגוריה ידנית, השתמש בה
    if (manualCategory && CONFIG.categoryEmojis[manualCategory]) {
        return manualCategory;
    }
    
    const searchText = `${fileName} ${title} ${keywords}`.toLowerCase();
    
    // חפש matches בכל קטגוריה
    const scores = {};
    
    for (const [category, categoryKeywords] of Object.entries(CONFIG.categoryKeywords)) {
        let score = 0;
        
        categoryKeywords.forEach(keyword => {
            if (searchText.includes(keyword)) {
                score += keyword.length * 2; // חפש שחוקרות ארוכות יותר
            }
        });
        
        scores[category] = score;
    }
    
    // בחר את הקטגוריה עם הניקוד הגבוה ביותר
    const bestCategory = Object.keys(scores).reduce((a, b) => 
        scores[a] > scores[b] ? a : b
    );
    
    return scores[bestCategory] > 0 ? bestCategory : 'Digital Basics'; // ברירת מחדל
}

// ========== 📂 סריקה אוטומטית של קבצים חדשים ==========
function scanForGuides() {
    console.log('🔍 סורק את תיקיית הפרויקט...\n');
    
    const files = fs.readdirSync(CONFIG.baseDir)
        .filter(f => f.endsWith('.html') && !CONFIG.excludeFiles.includes(f));
    
    const guides = [];
    
    files.forEach(fileName => {
        const filePath = path.join(CONFIG.baseDir, fileName);
        const metadata = extractGuideMetadata(filePath, fileName);
        
        if (metadata) {
            const category = classifyCategory(fileName, metadata.title, metadata.keywords, metadata.category);
            
            const mtimeDate = fs.statSync(filePath).mtime;
            const lastmodStr = mtimeDate.toISOString().split('T')[0];
            const daysOld = Math.floor((Date.now() - mtimeDate) / (1000 * 60 * 60 * 24));
            const isNew = daysOld <= 7; // חדש אם עודכן ב-7 ימים אחרונים
            
            guides.push({
                file: fileName,
                name: metadata.title,
                icon: metadata.emoji,
                category: category,
                description: metadata.description,
                isManual: metadata.isManual || false, // סימן שהתוקן ידנית
                // לקיחת תאריך עדכון מהקובץ (mtime) לשימוש בתצוגה
                lastmod: lastmodStr,
                isNew: isNew,
                daysOld: daysOld
            });
            
            const statusIcon = metadata.isManual ? '✅📋' : '✅🤖';
            console.log(`${statusIcon} ${metadata.emoji} ${metadata.title}`);
            console.log(`   📁 קטגוריה: ${category}${metadata.isManual ? ' (מוגדר ידנית)' : ' (זוהה אוטומטית)'}\n`);
        }
    });
    
    // סדר לפי קטגוריה
    guides.sort((a, b) => a.category.localeCompare(b.category));
    
    return guides;
}

// ========== יצירת categories.html ==========
function generateCategories(guides) {
    console.log('📝 יצירת categories.html...');
    
    // איסוף קטגוריות
    const categories = {};
    guides.forEach(guide => {
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
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
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
            <div class="nav-links" style="display: none;"></div>
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

    <main class="page-container">
        <div style="display: grid; grid-template-columns: 250px 1fr; gap: 2rem; align-items: start;">
            <!-- Sidebar -->
            <aside class="sidebar">
                <h2 style="font-size: 1rem; margin-bottom: 1.5rem; color: #666;">📁 קטגוריות</h2>
                <ul style="list-style: none; padding: 0; margin: 0;">`;

    // Sidebar tree
    Object.keys(categories).sort().forEach(categoryName => {
        const categoryEmoji = CONFIG.categoryEmojis[categoryName] || '📁';
        categoriesHTML += `
                    <li class="tree-item">
                        <div class="tree-toggle" onclick="toggleFolder(this)">
                            <span class="tree-icon">${categoryEmoji}</span>
                            <span>${categoryName}</span>
                            <span class="arrow-icon">▼</span>
                        </div>
                        <ul class="tree-children">`;
        
        categories[categoryName].forEach(guide => {
            const newBadge = guide.isNew ? ' <span style="background:#10b981; color:white; padding:0.2rem 0.5rem; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:0.4rem;">🆕 חדש</span>' : '';
            categoriesHTML += `                            <li><a href="${guide.file}" class="file-link" style="${guide.isNew ? 'background:#ecfdf5; border-left:3px solid #10b981; padding-left:0.5rem;' : ''}">${guide.icon} ${guide.name} <span style="color:#888; font-size:0.85rem; margin-left:0.4rem;">(${guide.lastmod})</span>${newBadge}</a></li>\n`;
        });
        
        categoriesHTML += `                        </ul>
                    </li>
`;
    });

    categoriesHTML += `
                </ul>
            </aside>

            <!-- Content -->
            <div class="explorer-content">
                <h1>📚 קטגוריות המדריכים</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">בחר קטגוריה כדי לצפות בכל המדריכים הקשורים</p>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">`;

    Object.keys(categories).sort().forEach(categoryName => {
        const categoryEmoji = CONFIG.categoryEmojis[categoryName] || '📁';
        const guides_in_category = categories[categoryName];
        const sample_count = Math.min(3, guides_in_category.length);
        
        categoriesHTML += `

                    <div style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-md);">
                        <h3 style="margin-bottom: 0.5rem; color: var(--accent);">${categoryEmoji} ${categoryName}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">📚 ${guides_in_category.length} מדריכים</p>
                        <ul style="list-style: none; padding: 0; margin: 0;">`;
        
        for (let i = 0; i < sample_count; i++) {
            const guide = guides_in_category[i];
            const newBadge = guide.isNew ? ' <span style="background:#10b981; color:white; padding:0.2rem 0.5rem; border-radius:4px; font-size:0.7rem; font-weight:bold; margin-left:0.4rem;">🆕 חדש</span>' : '';
            categoriesHTML += `                            <li><a href="${guide.file}" style="${guide.isNew ? 'background:#ecfdf5; border-left:2px solid #10b981; padding-left:0.5rem; display:block; border-radius:4px;' : ''} color: var(--accent); text-decoration: none;">• ${guide.name} <span style="color:#888; font-size:0.85rem; margin-left:0.4rem;">(${guide.lastmod})</span>${newBadge}</a></li>\n`;
        }
        
        if (guides_in_category.length > sample_count) {
            categoriesHTML += `                            <li style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">... ו-${guides_in_category.length - sample_count} נוספים</li>\n`;
        }
        
        categoriesHTML += `                        </ul>
                    </div>`;
    });

    categoriesHTML += `

                </div>
            </div>
        </div>
    </main>

    <!-- Global Footer -->
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3><span class="brand-icon">🎓</span> LearningHub</h3>
                    <p class="footer-description">
                        פורטל הלמידה וההחדשנות המוביל בישראל. כלים דיגיטליים, בינה מלאכותית ואוטומציה לכל מקצוע ותחום.
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
                        <li><a href="terminal_guide.html" class="footer-link">Terminal Guide</a></li>
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
function generateSitemap(guides) {
    console.log('📍 יצירת sitemap.html...');
    
    const categories = {};
    guides.forEach(guide => {
        if (!categories[guide.category]) {
            categories[guide.category] = [];
        }
        categories[guide.category].push(guide);
    });

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
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
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
            <div class="nav-links" style="display: none;"></div>
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

    <main class="page-container">
        <div class="sitemap-container">
            <h1>🗺️ מפת האתר</h1>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">כל התכנים והמדריכים מסודרים בעץ היררכי</p>
            
            <div class="sitemap-tree">
                <ul class="tree-root">`;

    Object.keys(categories).sort().forEach(categoryName => {
        const categoryEmoji = CONFIG.categoryEmojis[categoryName] || '📁';
        sitemapHTML += `
                    <li class="tree-category">
                        <h3 class="category-header">${categoryEmoji} ${categoryName}</h3>
                        <ul class="category-links">`;
        
        categories[categoryName].forEach(guide => {
            const newBadge = guide.isNew ? ' <span style="background:#10b981; color:white; padding:0.2rem 0.5rem; border-radius:4px; font-size:0.75rem; font-weight:bold; margin-left:0.4rem;">🆕 חדש</span>' : '';
            sitemapHTML += `                            <li><a href="${guide.file}" style="${guide.isNew ? 'background:#ecfdf5; border-left:2px solid #10b981; padding:0.2rem 0.4rem; border-radius:4px;' : ''}">${guide.icon} ${guide.name} <span style="color:#888; font-size:0.9rem; margin-left:0.4rem;">(${guide.lastmod})</span>${newBadge}</a></li>\n`;
        });
        
        sitemapHTML += `                        </ul>
                    </li>
`;
    });

    sitemapHTML += `
                </ul>
            </div>
        </div>
    </main>

    <!-- Global Footer -->
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3><span class="brand-icon">🎓</span> LearningHub</h3>
                    <p class="footer-description">פורטל הלמידה וההתקדמות - מדריכים מקצועיים בעברית וערבית</p>
                    <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 0.5rem;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">🚀 הצטרף לקורס החינמי</a>
                </div>

                <div class="footer-section">
                    <h4>🎓 למידה</h4>
                    <ul class="footer-links">
                        <li><a href="categories.html">📚 כל הקטגוריות</a></li>
                        <li><a href="python_guide.html">🐍 Python</a></li>
                        <li><a href="chatgpt_guide.html">💬 ChatGPT</a></li>
                        <li><a href="data_analysis_guide.html">📊 ניתוח נתונים</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>📖 משאבים</h4>
                    <ul class="footer-links">
                        <li><a href="sitemap.html">🗺️ מפת האתר</a></li>
                        <li><a href="prompts.html">⚡ ספריית Prompts</a></li>
                        <li><a href="ai_ethics.html">⚖️ אתיקה בAI</a></li>
                        <li><a href="terminal_guide.html">⌨️ Terminal</a></li>
                    </ul>
                </div>

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

            <div class="footer-bottom">
                <div style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                    <p>© 2025 <a href="https://edu-manage.org/" style="color: inherit; text-decoration: none;">EduManage</a> • מערכת לניהול פדגוגי</p>
                    <p style="margin-top: 0.3rem; font-size: 0.8rem; opacity: 0.8;">עודכן אוטומטית על ידי generate-manifest-auto.js 🤖</p>
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
function generateSitemapXML(guides) {
    console.log('🔗 יצירת sitemap.xml...');
    
    const today = new Date().toISOString().split('T')[0];
    
    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- דף הבית ודפים ראשיים -->
  <url>
    <loc>${CONFIG.baseUrl}/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${CONFIG.baseUrl}/categories.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${CONFIG.baseUrl}/sitemap.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;

        // הוסף כל מדריך (השתמש בתאריך הקובץ אם קיים)
        guides.forEach(guide => {
                const guideDate = guide.lastmod || today;
                sitemapXML += `  <!-- ${guide.category} -->
    <url>
        <loc>${CONFIG.baseUrl}/${guide.file}</loc>
        <lastmod>${guideDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
  
`;
        });

    sitemapXML += `</urlset>`;
    
    fs.writeFileSync(path.join(CONFIG.baseDir, 'sitemap.xml'), sitemapXML);
    console.log('✅ sitemap.xml עודכן בהצלחה!');
}

// ========== 🚀 הפעלה ראשית ==========
function main() {
    console.log('\n🤖 ============== Auto-Detector בהפעלה ==============\n');
    
    // סרוק קבצים
    const guides = scanForGuides();
    
    if (guides.length === 0) {
        console.log('❌ לא נמצאו קבצי HTML להעדכון');
        return;
    }
    
    console.log(`\n📊 נמצאו ${guides.length} מדריכים\n`);
    
    // יצור קבצים
    generateCategories(guides);
    generateSitemap(guides);
    generateSitemapXML(guides);
    
    console.log(`\n✨ כל הקבצים עודכנו בהצלחה!`);
    console.log(`\n📊 סטטיסטיקה:`);
    console.log(`   📚 סה"כ מדריכים: ${guides.length}`);
    
    const categoryStats = {};
    guides.forEach(g => {
        categoryStats[g.category] = (categoryStats[g.category] || 0) + 1;
    });
    
    console.log(`   🏷️  קטגוריות: ${Object.keys(categoryStats).length}`);
    Object.entries(categoryStats).forEach(([cat, count]) => {
        console.log(`      ${CONFIG.categoryEmojis[cat] || '📁'} ${cat}: ${count}`);
    });
    
    console.log(`\n✅ קבצים שעודכנו:`);
    console.log(`   - categories.html`);
    console.log(`   - sitemap.html`);
    console.log(`   - sitemap.xml\n`);
}

// הרץ את ה-main
main();
