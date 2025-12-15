import { GuideData, LmsAssignment } from '../types';

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

  // Master Template Injection
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
    "name": "${data.title}",
    "icon": "${data.emoji}",
    "category": "${data.category}",
    "description": "${data.shortDescription}",
    "course_code": "${data.courseCode}",
    "session_number": ${data.sessionNumber}
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

        header {
            background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%);
            color: white;
        }

        .concept-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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

        .teaser-title {
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .feature-image {
            width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 2rem 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            max-height: 400px;
            object-fit: cover;
            border: 4px solid rgba(255,255,255,0.1);
        }
    </style>
</head>

<body>
    <!-- LMS Notice Banner -->
    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 0.8rem 0; text-align: center; font-size: 0.9rem; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <span>🎓 <strong>${data.courseCode}: ${data.courseName}</strong> // מפגש ${data.sessionNumber}</span>
            <a href="https://edu-manage.org/" 
               style="background: white; color: #28a745; padding: 0.4rem 1rem; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem; transition: all 0.3s;"
               onmouseover="this.style.background='#f8f9fa'"
               onmouseout="this.style.background='white'">
                לאזור האישי
            </a>
        </div>
    </div>

    <!-- Global Header -->
    <header class="global-header">
        <nav class="global-nav">
            <div class="nav-links">
                <a href="sitemap.html" class="nav-link">מפת האתר</a>
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
                    "item": "https://learninghub.co.il/index.html"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "קטגוריות",
                    "item": "https://learninghub.co.il/categories.html"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "${data.courseName}",
                    "item": "https://learninghub.co.il/courses/${data.courseCode}"
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "${data.title}",
                    "item": "${pageUrl}"
                }
            ]
        }
        </script>
        <a href="index.html">דף הבית</a>
        <span>/</span>
        <a href="categories.html">קטגוריות</a>
        <span>/</span>
        <a href="#">${data.courseCode}</a>
        <span>/</span>
        <span class="current">${data.title}</span>
    </nav>

    <!-- Page Header with SEO Optimization -->
    <header class="page-header">
        <div class="header-content">
            <div style="font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; margin-bottom: 0.5rem;">
                ${data.institution} // ${data.category}
            </div>
            <h1 itemprop="headline">${data.emoji} ${data.title}</h1>
            <p class="subtitle" itemprop="description">${data.description}</p>
            
             <!-- Dynamic AI Image -->
            <img src="${headerImageUrl}" alt="${data.topic} illustration" class="feature-image" />

            <!-- Article Meta Information -->
            <div class="article-meta" style="margin-top: 1rem; font-size: 0.9rem; color: #666; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <span itemprop="author" itemscope itemtype="https://schema.org/Organization">
                    👨‍🏫 מרצה: <span itemprop="name">צוות ${data.institution}</span>
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
                <a href="#lms-assignments" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; margin: 0 0.5rem; font-size: 0.9rem;">
                    📋 מטלות להגשה
                </a>
                <a href="#join-course" style="background: rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; margin: 0 0.5rem; font-size: 0.9rem;">
                    🚀 לאזור האישי
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

        <!-- טיזר 1 - חומר למחשבה -->
        <div class="teaser-box teaser-idea">
            <h4 class="teaser-title" style="color: #28a745;">💡 חומר למחשבה</h4>
            <p><strong>האם ידעת ש...</strong> ${data.teaserIdea}</p>
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
            <p><strong>שים לב:</strong> ${data.teaserWarning}</p>
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
            <p><strong>טעות נפוצה:</strong> ${data.teaserSecret}</p>
        </div>

        <!-- מסקנות ויישום מעשי -->
        <section class="concept-card" id="summary" style="background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%); color: white; border: none;">
            <h2 style="color: white;">🎯 סיכום המפגש</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <h3 style="color: white; margin-bottom: 1rem;">✅ מה למדנו היום?</h3>
                <ul style="margin-right: 1.5rem; line-height: 1.8;">
                     ${safeList(data.summaryPoints)}
                </ul>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
                    <h3 style="color: white; margin-bottom: 1rem;">🚀 לקראת המפגש הבא</h3>
                    <ul style="margin-right: 1.5rem; line-height: 1.6;">
                         ${safeList(data.nextSteps)}
                    </ul>
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px;">
                    <h3 style="color: white; margin-bottom: 1rem;">⚠️ דגשים חשובים</h3>
                    <ul style="margin-right: 1.5rem; line-height: 1.6;">
                        ${safeList(data.commonMistakes)}
                    </ul>
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
                <p><strong>תרגיל אתגר:</strong> ${data.teaserBonus}</p>
            </div>
        </section>

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
                        פורטל הלמידה והחדשנות של ${data.institution}. כלים דיגיטליים, בינה מלאכותית ואוטומציה לכל מקצוע ותחום.
                    </p>
                </div>
                
                <div class="footer-section">
                    <h4>ניווט בקורס</h4>
                    <ul class="footer-links">
                        <li><a href="#" class="footer-link">סילבוס הקורס</a></li>
                        <li><a href="#" class="footer-link">לוח מודעות</a></li>
                        <li><a href="#" class="footer-link">ציונים והערכה</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>משאבים</h4>
                    <ul class="footer-links">
                        <li><a href="sitemap.html" class="footer-link">מפת האתר</a></li>
                        <li><a href="https://edu-manage.org/" class="footer-link">פורטל התלמידים</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>EduManage LMS</h4>
                    <ul class="footer-links">
                        <li><a href="https://edu-manage.org/" class="footer-link">כניסה לפורטל</a></li>
                        <li><a href="#" class="footer-link">תמיכה טכנית</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-copyright">
                    <div>© 2025 <a href="https://edu-manage.org/" style="color: inherit; text-decoration: none;">EduManage</a> • מערכת לניהול פדגוגי</div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Global JavaScript -->
    <script src="global.js"></script>
    
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
        });
    </script>
</body>
</html>`;
};