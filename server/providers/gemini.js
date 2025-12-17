import { GoogleGenAI, Type, Schema } from "@google/genai";

const guideSchema = {
  type: Type.OBJECT,
  properties: {
    filenameSlug: { type: Type.STRING, description: "A short, hyphenated English string representing the topic, suitable for a filename (e.g., 'intro-to-python')." },
    title: { type: Type.STRING, description: "A professional, catchy, and academic title for the guide in Hebrew." },
    description: { type: Type.STRING, description: "A compelling SEO description (approx 150-200 chars)." },
    keywords: { type: Type.STRING, description: "Relevant professional keywords in Hebrew, comma separated." },
    readingTime: { type: Type.INTEGER, description: "Estimated reading time in minutes (10-15)." },
    difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },

    // LMS Context
    courseName: { type: Type.STRING, description: "Invent a realistic course name this guide belongs to (e.g. 'Intro to Data Science')." },
    courseCode: { type: Type.STRING, description: "A realistic course code (e.g. CS-101-2024)." },
    institution: { type: Type.STRING, description: "The name of the educational institution (e.g. 'LearningHub Academy')." },
    sessionNumber: { type: Type.INTEGER, description: "The session number this guide corresponds to in the syllabus." },

    // Master Template Metadata
    category: {
      type: Type.STRING,
      enum: ['AI & Automation', 'Career', 'Creative Studio', 'Data & Business', 'Digital Basics', 'Technology'],
      description: "Select the most appropriate category for the guide."
    },
    emoji: { type: Type.STRING, description: "A single representative emoji for the guide (e.g., 🤖, 📊, 🎨)." },
    shortDescription: { type: Type.STRING, description: "A very short description (MAX 50 characters) for the guide metadata block." },

    headerImagePrompt: {
      type: Type.STRING,
      description: "A detailed English prompt for an AI image generator to create a header image. Describe the style as 'minimalist, modern, tech vector art' and the subject matter clearly."
    },

    introContent: { type: Type.STRING, description: "Comprehensive introduction. MUST use HTML tags (<p>, <ul>, <li>, <strong>) to structure text." },

    part1Title: { type: Type.STRING, description: "Title for Theoretical Foundation." },
    part1Content: { type: Type.STRING, description: "Deep theoretical explanation. MUST use HTML tags (<p>, <ul>, <li>, <strong>) to break long text." },

    diagramTheory: {
      type: Type.STRING,
      description: "A valid Mermaid.js 'graph TD' or 'mindmap' syntax string illustrating the core concept hierarchy. DO NOT include markdown code blocks (```). Use Hebrew labels inside the nodes."
    },

    codeExample: { type: Type.STRING, description: "A complex, commented code snippet or practical example." },
    teaserIdea: { type: Type.STRING, description: "A surprising fact or insight." },

    part2Title: { type: Type.STRING, description: "Title for Practical Application." },
    part2Content: { type: Type.STRING, description: "Introduction to the practical part. MUST use HTML tags (<p>, <ul>, <li>, <strong>)." },

    diagramPractice: {
      type: Type.STRING,
      description: "A valid Mermaid.js 'graph LR' or 'sequenceDiagram' syntax string illustrating the process flow or steps. DO NOT include markdown code blocks (```). Use Hebrew labels."
    },

    part2Steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Detailed step-by-step instructions." },
    teaserWarning: { type: Type.STRING, description: "A critical warning." },

    advancedTitle: { type: Type.STRING, description: "Title for Advanced Concepts." },
    advancedPoint1Title: { type: Type.STRING },
    advancedPoint1List: { type: Type.ARRAY, items: { type: Type.STRING } },
    advancedPoint2Title: { type: Type.STRING },
    advancedPoint2List: { type: Type.ARRAY, items: { type: Type.STRING } },
    teaserSecret: { type: Type.STRING, description: "Industry secret/tip." },

    summaryPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
    commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },

    // LMS Assignments
    lmsAssignments: {
      type: Type.ARRAY,
      description: "Create 2-3 assignments: At least ONE interactive QUIZ with 5-7 multiple-choice questions, and optionally a PROJECT with milestones or ASSIGNMENT.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['assignment', 'quiz', 'project'] },
          weight: { type: Type.INTEGER, description: "Percentage weight of the grade (e.g. 20)." },
          due_days_offset: { type: Type.INTEGER, description: "Due date offset in days." },
          rubric: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Criterion title" },
                description: { type: Type.STRING, description: "Criterion description" },
                max_points: { type: Type.INTEGER }
              }
            }
          },
          // Interactive Quiz Questions (for type='quiz')
          quizQuestions: {
            type: Type.ARRAY,
            description: "For quizzes: 5-7 multiple-choice questions with explanations",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The quiz question in Hebrew" },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 answer options" },
                correctAnswer: { type: Type.INTEGER, description: "Index of correct answer (0-3)" },
                explanation: { type: Type.STRING, description: "Explanation why this is correct" },
                imageUrl: { type: Type.STRING, description: "Optional: Pollinations.ai prompt for visual aid" },
                points: { type: Type.INTEGER, description: "Points for this question" }
              }
            }
          },
          passingScore: { type: Type.INTEGER, description: "Minimum passing percentage (e.g., 80)" },
          // Project Milestones (for type='project')
          projectMilestones: {
            type: Type.ARRAY,
            description: "For projects: 3-5 milestones with deliverables",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                dueOffset: { type: Type.INTEGER, description: "Days from project start" },
                deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                points: { type: Type.INTEGER }
              }
            }
          },
          finalDeliverable: { type: Type.STRING, description: "For projects: Final submission description" }
        }
      }
    },

    teaserBonus: { type: Type.STRING },

    relatedGuides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          icon: { type: Type.STRING }
        }
      }
    },

    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        }
      }
    }
  },
  required: [
    "filenameSlug", "title", "description", "keywords", "readingTime", "difficulty", "category", "emoji", "shortDescription",
    "courseName", "courseCode", "institution", "sessionNumber",
    "headerImagePrompt", "introContent",
    "part1Title", "part1Content", "diagramTheory", "codeExample", "teaserIdea",
    "part2Title", "part2Content", "diagramPractice", "part2Steps", "teaserWarning",
    "advancedTitle", "advancedPoint1Title", "advancedPoint1List", "advancedPoint2Title", "advancedPoint2List",
    "teaserSecret", "summaryPoints", "nextSteps", "commonMistakes", "lmsAssignments", "teaserBonus",
    "relatedGuides", "faq"
  ]
};

/**
 * Google Gemini Provider
 */
export class GeminiProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateGuide(topic, userDescription, modelId = 'gemini-2.5-flash') {
    const prompt = `
Role: You are a Senior Curriculum Developer, Instructional Designer, and Expert Technical Writer for "LearningHub" (EduManage).
Task: Create a deep, comprehensive, evidence-based study guide in Hebrew about: "${topic}".
Context: ${userDescription || "General professional audience seeking in-depth knowledge."}

═══════════════════════════════════════════════════════════════════════
📚 PEDAGOGICAL FRAMEWORK (CRITICAL - MUST FOLLOW)
═══════════════════════════════════════════════════════════════════════

This guide MUST apply evidence-based learning principles from cognitive science:

**1. COGNITIVE LOAD THEORY:**
   ✓ Chunk content into 5-7 minute segments maximum
   ✓ Minimize extraneous load (keep explanations clear and focused)
   ✓ Maximize germane load (promote deep understanding)
   ✓ Use worked examples BEFORE asking for practice
   ✓ Combine visual (diagrams) + verbal (text) information

**2. LEARNING PYRAMID (Retention Rates):**
   - Reading: 10% retention
   - Audio-visual: 20% retention
   - Demonstration: 30% retention
   - Discussion: 50% retention
   - Practice: 75% retention ← PRIORITIZE THIS
   - Teaching others: 90% retention

   ➜ ACTION: Include hands-on practice within 5-10 minutes of theory
   ➜ ACTION: Create interactive quizzes for immediate feedback

**3. LESSON ARCHITECTURE:**
   Follow this flow:
   1. Orientation: "Where am I in the learning journey?"
   2. Learning Objective: Clear "by the end you will..."
   3. Foundation: Build on prior knowledge
   4. Content: Multi-modal delivery (text + visuals + code)
   5. Practice: Immediate application
   6. Assessment: Verify understanding
   7. Summary: Key takeaways

**4. CONTENT QUALITY CHECKLIST:**
   ✓ State learning objectives upfront
   ✓ Break into digestible chunks (5-7 minutes each)
   ✓ Use multiple modalities (text, diagrams, code, quizzes)
   ✓ Provide immediate feedback mechanisms
   ✓ Include practical examples for ALL key concepts
   ✓ Create clear visual hierarchy with headings
   ✓ Add summary highlighting 3-5 key points
   ✓ Ensure accessibility (clear structure, RTL Hebrew)

═══════════════════════════════════════════════════════════════════════
🎯 LMS INTEGRATION STRATEGY
═══════════════════════════════════════════════════════════════════════

This guide is a "Session Material" within a larger Course structure.
INVENT a fictional but realistic Course Context (Name, Code, Institution).
Example: Topic "Loops" → Course "מבוא לתכנות בפייתון (PY-101-2024)"

═══════════════════════════════════════════════════════════════════════
📝 ASSIGNMENT REQUIREMENTS (CRITICAL)
═══════════════════════════════════════════════════════════════════════

Create 2-3 LMS assignments with these MANDATORY types:

**TYPE 1 - INTERACTIVE QUIZ (REQUIRED):**
   - Create 5-7 multiple-choice questions
   - Each question: 4 options, 1 correct answer
   - Include detailed explanation for correct answer
   - Optional: Add imageUrl (Pollinations.ai English prompt for visual)
   - Set passingScore: 80 (minimum to pass)
   - Points distribution: 10-20 points per question
   - Questions should test UNDERSTANDING not memorization

   Example question structure:
   {
     "question": "מהו העיקרון המרכזי ב-X?",
     "options": ["אופציה 1", "אופציה 2 (נכון)", "אופציה 3", "אופציה 4"],
     "correctAnswer": 1,
     "explanation": "אופציה 2 נכונה כי...",
     "imageUrl": "diagram showing X concept, minimalist tech style",
     "points": 15
   }

**TYPE 2 - PROJECT WITH MILESTONES (OPTIONAL but RECOMMENDED):**
   - Define 3-5 milestones with clear deliverables
   - Each milestone: title, description, due offset, deliverables array, points
   - Include finalDeliverable description

   Example milestone:
   {
     "title": "אבן דרך 1: מחקר ותכנון",
     "description": "סקור את הנושא והגש תכנית עבודה",
     "dueOffset": 3,
     "deliverables": ["מסמך מחקר (2-3 עמודים)", "תרשים זרימה"],
     "points": 20
   }

**TYPE 3 - REGULAR ASSIGNMENT (OPTIONAL):**
   - Traditional assignment with rubric only

═══════════════════════════════════════════════════════════════════════
📐 STRUCTURE GUIDELINES
═══════════════════════════════════════════════════════════════════════

1.  **Depth:** Explain "Why" before "How". Use analogies and real-world examples.
2.  **HTML Formatting:** Use valid HTML tags (<p>, <ul>, <li>, <strong>, <em>) for structure.
3.  **Time-Boxing:** Aim for 10-15 minute total reading time (split into chunks).

**Master Template Requirements:**
- **Category:** Must be one of: 'AI & Automation', 'Career', 'Creative Studio', 'Data & Business', 'Digital Basics', 'Technology'.
- **Short Description:** Exactly for the metadata block, MAX 50 characters.

**Visuals:**
- Provide English prompts for Pollinations.ai.
- Provide RAW Mermaid.js code for diagrams (no markdown blocks).

Output: Return ONLY valid JSON matching the schema.
    `.trim();

    try {
      const response = await this.ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: guideSchema,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini AI");

      const data = JSON.parse(text);
      return { ...data, topic };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }
}
