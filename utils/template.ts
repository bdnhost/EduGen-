import { GuideData, LmsAssignment, GuideTeasers, GuideAssignments } from '../types';

export const generateGuideHtml = (data: GuideData): string => {
    const dateStr = new Date().toISOString().split('T')[0];
    const difficultyMap = {
        'Beginner': 'בסיסי',
        'Intermediate': 'בינוני',
        'Advanced': 'מתקדם'
    };

    // Encode the image prompt for URL
    const headerImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(data.headerImagePrompt + " minimalist flat vector art style high quality 4k")}`;
    const pageUrl = `https://learninghub.co.il/courses/${data.courseCode}/${data.filenameSlug}.html`;

    const safeList = (items: string[]) => items.map(item => `<li>${item}</li>`).join('\n                        ');
    const safeSteps = (items: string[]) => items.map((item, idx) => `<li><strong>שלב ${idx + 1}:</strong> ${item}</li>`).join('\n                ');

    const renderRubric = (assignment: LmsAssignment) => {
        return `
      <div style="margin-top: 1rem; background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid #e0e0e0;">
        <h5 style="margin-top: 0; margin-bottom: 0.5rem; color: #555; font-size: 0.9rem;">📊 מחוון הערכה (Rubric)</h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="background: #f9f9f9; text-align: right;">
              <th style="padding: 0.5rem; border-bottom: 2px solid #eee;">קריטריון</th>
              <th style="padding: 0.5rem; border-bottom: 2px solid #eee;">תיאור</th>
              <th style="padding: 0.5rem; border-bottom: 2px solid #eee;">נקודות</th>
            </tr>
          </thead>
          <tbody>
            ${assignment.rubric.map(r => `
              <tr>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;"><strong>${r.title}</strong></td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">${r.description}</td>
                <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">${r.max_points}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    };

    const renderLmsAssignments = (assignments: LmsAssignment[]) => {
        if (!assignments || assignments.length === 0) return '';
        return assignments.map((task, idx) => {
            const typeLabel = task.type === 'quiz' ? '📝 בוחן' : task.type === 'project' ? '🚀 פרויקט' : '📋 מטלה';
            const borderColor = task.type === 'project' ? '#6f42c1' : '#007bff';
            const bgColor = task.type === 'project' ? '#f3e5f5' : '#e3f2fd';

            return `
        <div style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h3 style="color: #333; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    <span>${typeLabel}</span> ${task.title}
                </h3>
                <span style="background: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; border: 1px solid rgba(0,0,0,0.1);">
                    משקל: ${task.weight}%
                </span>
            </div>
            <p style="margin-bottom: 1rem; color: #444;">${task.description}</p>
            ${renderRubric(task)}
        </div>
      `;
        }).join('');
    };

    const safeRelatedGuides = (guides: { title: string; description: string; icon: string }[]) => {
        return guides.map((guide, idx) => `
                <a href="#" style="background: white; color: var(--theme-primary); text-decoration: none; display: flex; flex-direction: column; align-items: center; padding: 1.5rem; border-radius: 12px; transition: transform 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #f8f9fa;"
                   onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                    <span style="font-size: 2.5rem; margin-bottom: 1rem;">${guide.icon}</span>
                    <strong style="font-size: 1.1rem; margin-bottom: 0.5rem; text-align: center;">${guide.title}</strong>
                    <span style="font-size: 0.9rem; color: #666; text-align: center;">${guide.description}</span>
                </a>`).join('\n');
    };

    // Helper functions for new components
    const renderTeasers = (teasers: GuideTeasers | undefined) => {
        const teaserElements = [];
        const safeTeasers = teasers || { idea: '', warning: '', secret: '', bonus: '', tip: '', challenge: '' };

        // טיזר 1 - חומר למחשבה
        if (safeTeasers.idea || data.teaserIdea) {
            teaserElements.push(`
                <div class="teaser-box teaser-idea">
                    <h4 class="teaser-title" style="color: #28a745;">💡 חומר למחשבה</h4>
                    <p><strong>האם ידעת ש...</strong> ${safeTeasers.idea || data.teaserIdea}</p>
                </div>
            `);
        }

        // טיזר 2 - אזהרה
        if (safeTeasers.warning || data.teaserWarning) {
            teaserElements.push(`
                <div class="teaser-box teaser-warning">
                    <h4 class="teaser-title" style="color: #856404;">⚠️ רגע, עצור!</h4>
                    <p><strong>שים לב:</strong> ${safeTeasers.warning || data.teaserWarning}</p>
                </div>
            `);
        }

        // טיזר 3 - סוד קטן
        if (safeTeasers.secret || data.teaserSecret) {
            teaserElements.push(`
                <div class="teaser-box teaser-secret">
                    <h4 class="teaser-title" style="color: #6f42c1;">🤫 סוד קטן</h4>
                    <p><strong>טעות נפוצה:</strong> ${safeTeasers.secret || data.teaserSecret}</p>
                </div>
            `);
        }

        // טיזר 4 - טיפ מקצועי (חדש)
        if (safeTeasers.tip) {
            teaserElements.push(`
                <div class="teaser-box teaser-tip">
                    <h4 class="teaser-title" style="color: #17a2b8;">💎 טיפ מקצועי</h4>
                    <p><strong>טיפ חם:</strong> ${safeTeasers.tip}</p>
                </div>
            `);
        }

        // טיזר 5 - אתגר (חדש)
        if (safeTeasers.challenge) {
            teaserElements.push(`
                <div class="teaser-box teaser-challenge">
                    <h4 class="teaser-title" style="color: #dc3545;">🎯 אתגר</h4>
                    <p><strong>נסו זאת:</strong> ${safeTeasers.challenge}</p>
                </div>
            `);
        }

        // טיזר 6 - בונוס
        if (safeTeasers.bonus || data.teaserBonus) {
            teaserElements.push(`
                <div class="teaser-box teaser-bonus">
                    <h4 class="teaser-title" style="color: #0277bd;">😎 בונוס</h4>
                    <p><strong>תרגיל מעשי:</strong> ${safeTeasers.bonus || data.teaserBonus}</p>
                </div>
            `);
        }

        return teaserElements.join('\n');
    };

    const renderAssignments = (assignments: GuideAssignments) => {
        // Support both old string format and new detailed format
        const basicTasks = assignments.basic || [];
        const advancedTasks = assignments.advanced || [];

        if (!basicTasks.length && !advancedTasks.length) return '';

        const renderTaskList = (tasks: any[], isAdvanced = false) => {
            return tasks.map(task => {
                if (typeof task === 'string') {
                    return `<li>${task}</li>`;
                } else {
                    const difficultyColor = task.difficulty === 'קל' ? '#28a745' :
                        task.difficulty === 'בינוני' ? '#ffc107' : '#dc3545';
                    const timeInfo = task.estimatedTime ? ` (${task.estimatedTime})` : '';
                    const difficultyBadge = task.difficulty ?
                        `<span style="background: ${difficultyColor}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; margin-right: 0.5rem;">${task.difficulty}</span>` : '';

                    let prerequisites = '';
                    if (isAdvanced && task.prerequisites && task.prerequisites.length > 0) {
                        prerequisites = `<div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">דרישות קדם: ${task.prerequisites.join(', ')}</div>`;
                    }

                    return `
                        <li style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(255,255,255,0.3); border-radius: 8px;">
                            <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                                ${difficultyBadge}
                                <strong>${task.title}${timeInfo}</strong>
                            </div>
                            <div style="margin-right: 1rem;">${task.description}</div>
                            ${prerequisites}
                        </li>
                    `;
                }
            }).join('\n                ');
        };

        return `
      <section class="concept-card" id="tasks">
        <h2>📋 משימות לשבוע הקרוב</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem;">
          ${basicTasks.length > 0 ? `
            <div style="background: #e8f5e9; border: 2px solid #28a745; border-radius: 16px; padding: 2rem;">
              <h3 style="color: #155724; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> רמה בסיסית (מתחילים)
              </h3>
              <ul style="margin-right: 1.5rem; line-height: 1.8; list-style: none; padding: 0;">
                ${renderTaskList(basicTasks, false)}
              </ul>
            </div>
          ` : ''}
          
          ${advancedTasks.length > 0 ? `
            <div style="background: #e3f2fd; border: 2px solid #007bff; border-radius: 16px; padding: 2rem;">
              <h3 style="color: #004085; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚡</span> רמה מתקדמת (מנוסים)
              </h3>
              <ul style="margin-right: 1.5rem; line-height: 1.8; list-style: none; padding: 0;">
                ${renderTaskList(advancedTasks, true)}
              </ul>
            </div>
          ` : ''}
        </div>
      </section>
    `;
    };

    const renderFAQ = (faq: Array<{ question: string, answer: string, category?: string }>) => {
        if (!faq.length) return '';

        // Group FAQ by category if categories exist
        const categorizedFAQ = faq.reduce((acc, item) => {
            const category = item.category || 'כללי';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {} as Record<string, typeof faq>);

        const categoryColors = {
            'כללי': '#007bff',
            'טכני': '#28a745',
            'מתקדם': '#dc3545',
            'פתרון בעיות': '#ffc107'
        };

        return `
      <!-- FAQ Section for SEO -->
      <section class="concept-card" style="margin-top: 2rem;">
        <h2>❓ שאלות נפוצות</h2>
        <div itemscope itemtype="https://schema.org/FAQPage">
          ${Object.entries(categorizedFAQ).map(([category, items]) => `
            ${Object.keys(categorizedFAQ).length > 1 ? `
              <h3 style="color: ${categoryColors[category] || '#007bff'}; margin: 2rem 0 1rem 0; padding-bottom: 0.5rem; border-bottom: 2px solid ${categoryColors[category] || '#007bff'};">
                ${category}
              </h3>
            ` : ''}
            ${items.map(item => `
              <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" style="margin-bottom: 1.5rem; padding: 1.5rem; background: #f8f9fa; border-radius: 12px; border-right: 4px solid ${categoryColors[category] || '#007bff'};">
                <h4 itemprop="name" style="color: #333; margin-bottom: 0.8rem; font-size: 1.1rem;">${item.question}</h4>
                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <div itemprop="text">
                    <p style="margin: 0; color: #555; line-height: 1.6;">${item.answer}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          `).join('')}
        </div>
      </section>
    `;
    };

    // Master Template Injection with matireal compatibility
    return `<!--
================================================================================
🎉 GUIDE METADATA FOR AUTO-DETECTION 🎉
================================================================================
Edit the JSON below to classify your guide automatically.
The auto-detector (generate-manifest-auto.js) will read this metadata.

CATEGORIES AVAILABLE:
🧪 AI & Automation     - AI, ChatGPT, Machine Learning, Automation, Web Scraping, React, Python
💼 Career             - Career Prep, CV, Presentations, Skills, Professional Development
🎨 Creative Studio    - Design, Canva, Video Editing, Midjourney, UI/UX, Graphics
📊 Data & Business    - Data Analysis, Power BI, Excel, Marketing, SQL, Analytics
📚 Digital Basics     - Terminal, GitHub, Internet, File Management, Fundamentals
🚀 Technology         - Docker, IoT, Automotive, Cloud, DevOps, Infrastructure

================================================================================
INSTRUCTIONS:
1. Replace [שם המדריך] with your guide name (will appear in catalog)
2. Choose an appropriate emoji (🎨 🐍 📊 💻 ⚖️ etc.)
3. Pick ONE category from the list above
4. Add a short description (50 chars max)
5. Save & run: npm run auto
================================================================================
-->

<!--
{
  "guide_metadata": {
    "name": "${data.metadata?.name || data.title}",
    "icon": "${data.metadata?.icon || data.emoji}",
    "category": "${data.metadata?.category || data.category}",
    "description": "${data.metadata?.description || data.shortDescription}"
  }
}
-->

<!DOCTYPE html>
<html lang="he" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>${data.title} | ${data.courseName} | LearningHub</title>
    <meta name="description" content="${data.description}">
    <meta name="keywords" content="${data.keywords}, ${data.courseName}, ${data.courseCode}, מדריך, לימוד, קורס חינמי, הדרכה מקצועית, EduManage, LearningHub">
    <meta name="author" content="${data.institution} - LearningHub">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="language" content="Hebrew">
    <meta name="revisit-after" content="7 days">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${data.title} | ${data.courseName}">
    <meta property="og:description" content="${data.shortDescription}">
    <meta property="og:image" content="${headerImageUrl}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:site_name" content="LearningHub - פורטל הלמידה והחדשנות">
    <meta property="og:locale" content="he_IL">
    <meta property="article:author" content="LearningHub">
    <meta property="article:section" content="${data.category}">
    <meta property="article:tag" content="${data.keywords}">
    <meta property="article:published_time" content="${dateStr}">
    <meta property="article:modified_time" content="${dateStr}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${data.title} | ${data.courseName}">
    <meta name="twitter:description" content="${data.shortDescription}">
    <meta name="twitter:image" content="${headerImageUrl}">
    <meta name="twitter:site" content="@LearningHubIL">
    <meta name="twitter:creator" content="@LearningHubIL">
    
    <!-- Additional SEO Meta Tags -->
    <meta name="theme-color" content="#1a1a2e">
    <meta name="msapplication-TileColor" content="#1a1a2e">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${pageUrl}">
    
    <!-- Alternate Languages -->
    <link rel="alternate" hreflang="he" href="${pageUrl}">
    <link rel="alternate" hreflang="x-default" href="${pageUrl}">
    
    <!-- Preconnect for Performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://edu-manage.org">
    
    <!-- DNS Prefetch -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//edu-manage.org">
    
    <!-- Fonts with Performance Optimization -->
    <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap"
        rel="stylesheet">
    
    <!-- Favicon and Icons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    
    <!-- Global CSS -->
    <link rel="stylesheet" href="global.css">
    
    <!-- Mermaid JS (Injected for diagrams) -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'base',
                themeVariables: {
                    primaryColor: '#e8f4fd',
                    primaryTextColor: '#1a1a2e',
                    primaryBorderColor: '#6c5ce7',
                    lineColor: '#6c5ce7',
                    secondaryColor: '#f4f4f4',
                    tertiaryColor: '#fff'
                },
                flowchart: {
                    htmlLabels: true,
                    curve: 'basis'
                }
            });
        });
    </script>
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${data.title}",
        "description": "${data.description}",
        "image": "${headerImageUrl}",
        "author": {
            "@type": "Organization",
            "name": "${data.institution}",
            "url": "https://learninghub.co.il"
        },
        "publisher": {
            "@type": "Organization",
            "name": "EduManage",
            "logo": {
                "@type": "ImageObject",
                "url": "https://edu-manage.org/logo.png"
            }
        },
        "datePublished": "${dateStr}",
        "dateModified": "${dateStr}",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${pageUrl}"
        },
        "articleSection": "${data.category}",
        "keywords": "${data.keywords}",
        "inLanguage": "he-IL",
        "isAccessibleForFree": true,
        "educationalLevel": "Beginner to Advanced",
        "learningResourceType": "Tutorial",
        "teaches": "Skills related to ${data.topic}",
        "about": {
            "@type": "Course",
            "name": "${data.courseName}",
            "courseCode": "${data.courseCode}"
        }
    }
    </script>
    
    <!-- Page-specific styles -->
    <style>
        :root {
            --theme-primary: #1a1a2e;    /* צבע ראשי של המדריך */
            --theme-accent: #6c5ce7;     /* צבע מבטא */
            --theme-light: #a29bfe;      /* צבע בהיר */
        }
        
        /* Page Container */
        .page-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        
        /* Breadcrumbs */
        .breadcrumbs {
            padding: 1rem;
            background: var(--bg-body, #f8f9fa);
            font-size: 0.9rem;
            text-align: center;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .breadcrumbs a {
            color: var(--accent, #6c5ce7);
            text-decoration: none;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            transition: background 0.3s;
        }
        
        .breadcrumbs a:hover {
            text-decoration: underline;
            background: rgba(108, 92, 231, 0.1);
        }
        
        .breadcrumbs .current {
            color: var(--text-secondary, #636e72);
            font-weight: 500;
        }
        
        .breadcrumbs span {
            margin: 0 0.5rem;
            color: #999;
        }

        .page-header {
            background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%);
            color: white;
            padding: 3rem 1rem;
            text-align: center;
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .page-header h1 {
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            font-family: var(--font-heading, 'Frank Ruhl Libre', serif);
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .concept-card {
            background: var(--bg-card, white);
            padding: 2rem;
            border-radius: var(--radius-md, 12px);
            box-shadow: var(--shadow-md, 0 4px 15px rgba(0, 0, 0, 0.05));
            margin-bottom: 2rem;
            border-right: 4px solid var(--theme-accent);
            overflow: hidden; /* Prevent diagram overflow */
        }

        /* Formatted Content Styles */
        .formatted-content p {
            margin-bottom: 1rem;
            line-height: 1.7;
            font-size: 1.05rem;
        }
        
        .formatted-content ul, .formatted-content ol {
            margin-bottom: 1.5rem;
            padding-right: 1.5rem;
        }

        .formatted-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }

        .formatted-content strong {
            color: var(--theme-primary);
            font-weight: 700;
        }

        /* Diagrams */
        .diagram-container {
            background: #fdfdfd;
            border: 1px dashed #e0e0e0;
            border-radius: 8px;
            padding: 1rem;
            margin: 2rem 0;
            text-align: center;
            overflow: hidden;
        }

        .code-block {
            background: var(--theme-primary);
            color: #e8f4fd;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            direction: ltr;
            text-align: left;
            overflow-x: auto;
            margin: 1rem 0;
            position: relative;
        }

        .copy-btn {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: none;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
        }

        .copy-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* טיזרים */
        .teaser-box {
            padding: 1.5rem;
            border-radius: 12px;
            margin: 1.5rem 0;
        }

        .teaser-idea {
            background: #e8f5e9;
            border-right: 4px solid #28a745;
        }

        .teaser-warning {
            background: #fff3cd;
            border-right: 4px solid #ffc107;
        }

        .teaser-secret {
            background: #f3e5f5;
            border-right: 4px solid #6f42c1;
        }

        .teaser-bonus {
            background: #e1f5fe;
            border-right: 4px solid #03a9f4;
        }

        .teaser-tip {
            background: #e0f7fa;
            border-right: 4px solid #17a2b8;
        }

        .teaser-challenge {
            background: #ffebee;
            border-right: 4px solid #dc3545;
        }

        .teaser-title {
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        /* Footer Styles */
        .global-footer {
            background: var(--primary, #1a1a2e);
            color: var(--text-light, #b2bec3);
            padding: 3rem 1rem;
            margin-top: 4rem;
        }
        
        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer-main {
            display: grid;
            gap: 2rem;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            margin-bottom: 2rem;
        }
        
        .footer-brand h3 {
            color: white;
            margin-top: 0;
            margin-bottom: 1rem;
        }
        
        .footer-description {
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .footer-section h4 {
            color: white;
            margin-bottom: 1rem;
            font-size: 1rem;
        }
        
        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links li {
            margin-bottom: 0.5rem;
        }
        
        .footer-link {
            color: var(--text-light, #b2bec3);
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-link:hover {
            color: white;
        }
        
        .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .footer-social {
            display: flex;
            gap: 1rem;
        }
        
        .social-link {
            display: inline-block;
            width: 2.5rem;
            height: 2.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            text-align: center;
            line-height: 2.5rem;
            text-decoration: none;
            transition: background 0.3s;
        }
        
        .social-link:hover {
            background: var(--accent, #6c5ce7);
        }

        /* Global Header Styles */
        .global-header {
            background: var(--primary, #1a1a2e);
            color: white;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .global-nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 1rem;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            padding: 0.5rem 1rem;
            border-radius: 6px;
        }
        
        .nav-link:hover {
            color: var(--accent, #6c5ce7);
            background: rgba(255,255,255,0.1);
        }
        
        .nav-brand {
            color: white;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .nav-brand:hover {
            color: var(--accent, #6c5ce7);
        }
        
        .logo {
            font-size: 1.8rem;
        }
        
        .hamburger-menu {
            display: none;
            flex-direction: column;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
        }
        
        .hamburger-menu span {
            width: 25px;
            height: 3px;
            background: white;
            margin: 3px 0;
            transition: 0.3s;
        }
        
        @media (max-width: 768px) {
            .global-nav {
                position: relative;
            }
            
            .nav-links {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--primary, #1a1a2e);
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                z-index: 1000;
            }
            
            .nav-links.active {
                display: flex;
            }
            
            .hamburger-menu {
                display: flex;
            }
            
            .page-container {
                padding: 1rem 0.5rem;
            }
            
            .concept-card {
                padding: 1.5rem;
            }
        }

    </style>
</head>

<body>
    <!-- LMS Notice Banner -->
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 0.8rem 0; text-align: center; font-size: 0.9rem; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <span>🎓 <strong>תלמיד רשום?</strong> חזור לפורטל לאחר הלימוד</span>
            <a href="https://edu-manage.org/" 
               style="background: white; color: #28a745; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem; transition: all 0.3s;"
               onmouseover="this.style.background='#f8f9fa'"
               onmouseout="this.style.background='white'">
                פורטל התלמידים
            </a>
            <span style="opacity: 0.8;">|</span>
            <span>🚀 <strong>גולש חדש?</strong></span>
            <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" 
               style="background: rgba(255,255,255,0.2); color: white; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.3); transition: all 0.3s;"
               onmouseover="this.style.background='rgba(255,255,255,0.3)'"
               onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                הצטרף חינם
            </a>
        </div>
    </div>

    <!-- Global Header -->
    <header class="global-header">
        <nav class="global-nav">
            <div class="nav-links">
                <a href="https://bdnhost.net/Resources/sitemap.html" class="nav-link">מפת האתר</a>
                <a href="https://bdnhost.net/Resources/categories.html" class="nav-link">קטגוריות</a>
                <a href="https://bdnhost.net/Resources/index.html" class="nav-link">ראשי</a>
            </div>
            <a href="https://bdnhost.net/Resources/index.html" class="nav-brand">
                <span class="logo">🎓</span>
                LearningHub
            </a>
            <button class="hamburger-menu" aria-label="תפריט ראשי" onclick="document.querySelector('.nav-links').classList.toggle('active')">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>

    <!-- Breadcrumbs with Schema -->
    <nav class="breadcrumbs" aria-label="breadcrumb">
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "דף הבית",
                    "item": "https://bdnhost.net/Resources/index.html"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "קטגוריות",
                    "item": "https://bdnhost.net/Resources/categories.html"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "${data.title}",
                    "item": "${pageUrl}"
                }
            ]
        }
        </script>
        <a href="https://bdnhost.net/Resources/index.html">דף הבית</a>
        <span>/</span>
        <a href="https://bdnhost.net/Resources/categories.html">קטגוריות</a>
        <span>/</span>
        <span class="current">${data.title}</span>
    </nav>

    <!-- Page Header with SEO Optimization -->
    <header class="page-header">
        <div class="header-content">
            <h1 itemprop="headline">${data.emoji} ${data.title}</h1>
            <p class="subtitle" itemprop="description">${data.description}</p>
            
            <!-- Article Meta Information -->
            <div class="article-meta" style="margin-top: 1rem; font-size: 0.9rem; color: #666; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <span itemprop="author" itemscope itemtype="https://schema.org/Organization">
                    👨‍🏫 מאת: <span itemprop="name">LearningHub</span>
                </span>
                <span>📅 עודכן: <time itemprop="dateModified" datetime="${dateStr}">${dateStr}</time></span>
                <span>⏱️ זמן קריאה: ${data.readingTime} דקות</span>
                <span>📊 רמת קושי: ${difficultyMap[data.difficulty]}</span>
            </div>
            
            <!-- Quick Navigation -->
            <div class="quick-nav" style="margin-top: 1.5rem; text-align: center;">
                <a href="#main-content" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; margin: 0 0.5rem; font-size: 0.9rem;">
                    📖 תוכן המדריך
                </a>
                <a href="#tasks" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; margin: 0 0.5rem; font-size: 0.9rem;">
                    📋 משימות
                </a>
                <a href="#join-course" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; margin: 0 0.5rem; font-size: 0.9rem;">
                    🚀 הצטרף לקורס
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content with SEO Structure -->
    <main class="page-container" id="main-content" itemscope itemtype="https://schema.org/Article">
        
        <!-- Table of Contents for SEO -->
        <div class="concept-card" style="background: #f8f9fa; border-right: 4px solid #007bff;">
            <h2>📋 סילבוס המפגש</h2>
            <nav aria-label="תוכן המדריך">
                <ol style="margin-right: 1.5rem; line-height: 1.8;">
                    <li><a href="#why-important" style="color: #007bff; text-decoration: none;">מבוא וחשיבות</a></li>
                    <li><a href="#part-1" style="color: #007bff; text-decoration: none;">${data.part1Title}</a></li>
                    <li><a href="#part-2" style="color: #007bff; text-decoration: none;">${data.part2Title}</a></li>
                    <li><a href="#advanced" style="color: #007bff; text-decoration: none;">${data.advancedTitle}</a></li>
                    <li><a href="#summary" style="color: #007bff; text-decoration: none;">סיכום המפגש</a></li>
                    <li><a href="#lms-assignments" style="color: #007bff; text-decoration: none;">מטלות להגשה (LMS)</a></li>
                </ol>
            </nav>
        </div>
        
        <!-- מבוא -->
        <section class="concept-card" id="why-important">
            <h2 itemprop="headline">למה הנושא חשוב בקורס "${data.courseName}"?</h2>
            <div itemprop="articleBody" class="formatted-content">
                ${data.introContent}
            </div>
        </section>

        <!-- תוכן עיקרי - חלק 1 -->
        <section class="concept-card" id="part-1">
            <h2>1. ${data.part1Title}</h2>
            <div class="formatted-content">
                ${data.part1Content}
            </div>
            
            <div class="diagram-container">
                <h4 style="margin-bottom: 1rem; color: #666;">תרשים מושגים (Concept Map)</h4>
                <div class="mermaid">
                    ${data.diagramTheory}
                </div>
            </div>
            
            <!-- דוגמת קוד אם רלוונטי -->
            <div class="code-block">
                <button class="copy-btn" onclick="copyCode(this)">העתק</button>
                <pre>${data.codeExample}</pre>
            </div>
        </section>

        <!-- טיזרים פדגוגיים מפוזרים לאורך המדריך -->
        ${renderTeasers(data.teasers)}ה</h4>
            <p><strong>האם ידעת ש...</strong> ${data.teasers?.idea || data.teaserIdea}</p>
        </div>

        <!-- תוכן עיקרי - חלק 2 -->
        <section class="concept-card" id="part-2">
            <h2>2. ${data.part2Title}</h2>
            <div class="formatted-content">
                ${data.part2Content}
            </div>

             <div class="diagram-container">
                <h4 style="margin-bottom: 1rem; color: #666;">תהליך העבודה (Workflow)</h4>
                <div class="mermaid">
                    ${data.diagramPractice}
                </div>
            </div>
            
            <!-- רשימה או שלבים -->
            <ol style="margin-right: 1.5rem; line-height: 1.8;">
                 ${safeSteps(data.part2Steps)}
            </ol>
        </section>

        <!-- טיזר 2 - אזהרה -->
        <div class="teaser-box teaser-warning">
            <h4 class="teaser-title" style="color: #856404;">⚠️ רגע, עצור!</h4>
            <p><strong>שים לב:</strong> ${data.teasers?.warning || data.teaserWarning}</p>
        </div>

        <!-- תוכן מתקדם -->
        <section class="concept-card" id="advanced">
            <h2>3. ${data.advancedTitle}</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-right: 4px solid var(--theme-accent);">
                    <h3 style="color: var(--theme-primary); margin-bottom: 1rem;">${data.advancedPoint1Title}</h3>
                    <ul style="margin-right: 1.5rem;">
                         ${safeList(data.advancedPoint1List)}
                    </ul>
                </div>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-right: 4px solid var(--theme-light);">
                    <h3 style="color: var(--theme-primary); margin-bottom: 1rem;">${data.advancedPoint2Title}</h3>
                    <ul style="margin-right: 1.5rem;">
                         ${safeList(data.advancedPoint2List)}
                    </ul>
                </div>
            </div>
        </section>

        <!-- טיזר 3 - סוד קטן -->
        <div class="teaser-box teaser-secret">
            <h4 class="teaser-title" style="color: #6f42c1;">🤫 סוד קטן</h4>
            <p><strong>טעות נפוצה:</strong> ${data.teasers?.secret || data.teaserSecret}</p>
        </div>

        <!-- מסקנות ויישום מעשי -->
        <section class="concept-card" id="summary" style="background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%); color: white; border: none;">
            <h2 style="color: white;">🎯 סיכום המפגש ויישום מעשי</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <h3 style="color: white; margin-bottom: 1rem;">✅ נקודות מפתח שלמדנו היום</h3>
                <ul style="margin-right: 1.5rem; line-height: 1.8;">
                     ${safeList(data.summaryPoints)}
                </ul>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
                    <h3 style="color: white; margin-bottom: 1rem;">🚀 הצעדים הבאים שלכם</h3>
                    <ol style="margin-right: 1.5rem; line-height: 1.6;">
                         ${data.nextSteps.map((step, index) => `<li><strong>שלב ${index + 1}:</strong> ${step}</li>`).join('\n                         ')}
                    </ol>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
                    <h3 style="color: white; margin-bottom: 1rem;">⚠️ מלכודות נפוצות להימנע מהן</h3>
                    <ul style="margin-right: 1.5rem; line-height: 1.6;">
                        ${data.commonMistakes.map(mistake => `<li><strong>נמנעו מ:</strong> ${mistake}</li>`).join('\n                        ')}
                    </ul>
                </div>
            </div>
            
            <!-- קריאה לפעולה -->
            <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 12px;">
                <h3 style="color: white; margin-bottom: 1rem;">🎯 קדימה לעבודה!</h3>
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">עכשיו שיש לכם את הכלים והידע, הגיע הזמן ליישם במציאות</p>
                <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">💪 תתחילו מהמשימות הבסיסיות</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">🔥 תתקדמו למשימות המתקדמות</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">🚀 תשתפו את התוצאות</span>
                </div>
            </div>
        </section>

        <!-- משימות לשבוע הקרוב (LMS Assignments) -->
        <section class="concept-card" id="lms-assignments">
            <h2>📋 מטלות להגשה (מתוך מערכת הקורס)</h2>
            <p style="margin-bottom: 1.5rem; color: #666;">יש להגיש את המטלות הבאות דרך מערכת ה-LMS עד המועד הנקוב.</p>
            
            ${renderLmsAssignments(data.lmsAssignments)}

            <!-- טיזר 4 - בונוס -->
            <div class="teaser-box teaser-bonus">
                <h4 class="teaser-title" style="color: #0277bd;">😎 בונוס (רשות)</h4>
                <p><strong>תרגיל אתגר:</strong> ${data.teasers?.bonus || data.teaserBonus}</p>
            </div>
        </section>

        <!-- משימות לשבוע הקרוב -->
        ${renderAssignments(data.assignments || { basic: [], advanced: [] })}

        <!-- מסע המשתמש - חזרה ל-LMS -->
        <div class="concept-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border: none; position: relative; overflow: hidden;">
            <!-- רקע דקורטיבי -->
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.3;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.2;"></div>
            
            <div style="position: relative; z-index: 2;">
                <h2 style="color: white; text-align: center; margin-bottom: 1.5rem;">🎯 סיימת את יחידת הלימוד!</h2>
                
                <div style="text-align: center; margin: 2rem 0;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                    <p style="font-size: 1.2rem; margin: 1.5rem 0; line-height: 1.6;">
                        <strong>חומר זה הוא חלק מקורס ${data.courseName} (${data.courseCode})</strong><br>
                        יש לחזור לפורטל הקורס לצורך ביצוע המבחן המסכם והגשת המטלות.
                    </p>
                </div>

                <!-- כפתור חזרה ל-LMS לתלמידים רשומים -->
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="https://edu-manage.org/" 
                       style="display: inline-block; background: white; color: #28a745; padding: 1rem 2.5rem; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s; border: 3px solid white;"
                       onmouseover="this.style.background='#f8f9fa'; this.style.transform='translateY(-2px)'"
                       onmouseout="this.style.background='white'; this.style.transform='translateY(0)'">
                        🎓 חזרה לפורטל הקורס - EduManage
                    </a>
                </div>
            </div>
        </div>

        <!-- FAQ Section -->
        ${renderFAQ(data.faq || [])}

        <!-- מדריכים קשורים -->
        <div class="concept-card">
            <h2 style="text-align: center; margin-bottom: 2rem;">📚 יחידות לימוד נוספות בקורס</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
                ${safeRelatedGuides(data.relatedGuides)}
            </div>
        </div>

    </main>
    
    <!-- FAQ Section for SEO -->
    <section class="concept-card" style="margin-top: 2rem;">
        <h2>❓ שאלות נפוצות על המפגש</h2>
        <div itemscope itemtype="https://schema.org/FAQPage">
            ${data.faq.map(item => `
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 itemprop="name">${item.question}</h3>
                <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <div itemprop="text">
                        <p>${item.answer}</p>
                    </div>
                </div>
            </div>`).join('')}
        </div>
    </section>

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
                        <li><a href="https://bdnhost.net/Resources/categories.html" class="footer-link">כל הקטגוריות</a></li>
                        <li><a href="https://bdnhost.net/Resources/python_guide.html" class="footer-link">Python</a></li>
                        <li><a href="https://bdnhost.net/Resources/chatgpt_guide.html" class="footer-link">ChatGPT</a></li>
                        <li><a href="https://bdnhost.net/Resources/data_analysis_guide.html" class="footer-link">ניתוח נתונים</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>משאבים</h4>
                    <ul class="footer-links">
                        <li><a href="https://bdnhost.net/Resources/sitemap.html" class="footer-link">מפת האתר</a></li>
                        <li><a href="https://bdnhost.net/Resources/prompts.html" class="footer-link">ספריית פרומפטים</a></li>
                        <li><a href="https://bdnhost.net/Resources/ai_ethics.html" class="footer-link">אתיקה ב-AI</a></li>
                        <li><a href="https://edu-manage.org/" class="footer-link">פורטל התלמידים</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>EduManage LMS</h4>
                    <ul class="footer-links">
                        <li><a href="https://edu-manage.org/" class="footer-link">כניסה לפורטל</a></li>
                        <li><a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1" class="footer-link">הצטרפות לקורס</a></li>
                        <li><a href="https://bdnhost.net/Resources/digital_literacy_basics_guide.html" class="footer-link">מדריך למשתמש</a></li>
                        <li><a href="https://bdnhost.net/Resources/internet_basics.html" class="footer-link">תמיכה טכנית</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-copyright">
                    <div>© 2025 <a href="https://edu-manage.org/" style="color: inherit; text-decoration: none;">EduManage</a> • מערכת לניהול פדגוגי</div>
                    <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.3rem;">
                        פותח ע"י BD TechAcademy • ביצוע ב-BDNHOST
                    </div>
                </div>
                <div class="footer-social">
                    <a href="https://www.linkedin.com/" class="social-link" title="LinkedIn" target="_blank">💼</a>
                    <a href="https://github.com/" class="social-link" title="GitHub" target="_blank">🐙</a>
                    <a href="https://www.youtube.com/" class="social-link" title="YouTube" target="_blank">📺</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Global JavaScript -->
    <script>
        // Global JavaScript functionality for preview
        console.log('LearningHub Guide - Preview Mode');
        
        // Handle navigation clicks
        document.addEventListener('DOMContentLoaded', function() {
            // Add smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Mobile menu toggle functionality
            const hamburger = document.querySelector('.hamburger-menu');
            const navLinks = document.querySelector('.nav-links');
            
            if (hamburger && navLinks) {
                hamburger.addEventListener('click', function() {
                    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'var(--primary, #1a1a2e)';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.padding = '1rem';
                    navLinks.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                });
            }
        });
    </script>
    
    <!-- Page-specific JavaScript -->
    <script>
        // Copy code function
        function copyCode(btn) {
            const pre = btn.nextElementSibling;
            navigator.clipboard.writeText(pre.innerText);
            btn.innerText = 'הועתק!';
            setTimeout(() => btn.innerText = 'העתק', 2000);
        }
        
        // SEO and UX Enhancements
        document.addEventListener('DOMContentLoaded', function() {
            // Track reading progress for SEO signals
            let maxScroll = 0;
            window.addEventListener('scroll', function() {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    // Send engagement signal to analytics (if implemented)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            'event_category': 'engagement',
                            'event_label': 'reading_progress',
                            'value': scrollPercent
                        });
                    }
                }
            });
            
            // Smooth scrolling for internal links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Lazy loading for images (if any)
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        });
    </script>
</body>
</html>`;
};