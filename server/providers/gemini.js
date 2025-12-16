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
      description: "Create 2 distinct assignments/tasks based on the guide content, structured for an LMS.",
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
          }
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
Role: You are a Senior Curriculum Developer and Expert Technical Writer for "LearningHub" (EduManage).
Task: Create a deep, comprehensive, and professional study guide in Hebrew about: "${topic}".
Context: ${userDescription || "General professional audience seeking in-depth knowledge."}

**LMS Integration Strategy (CRITICAL):**
This guide is not standalone. It is a specific "Session Material" part of a larger Course.
You must INVENT a fictional but realistic Course Context (Name, Code, Institution) that this topic fits into.
For example, if the topic is "Loops", the Course might be "Intro to Python (PY101)".

**Structure Guidelines:**
1.  **Depth:** Explain "Why" before "How". Use analogies.
2.  **HTML Formatting:** Return 'introContent', 'part1Content', and 'part2Content' as valid HTML strings (use <p>, <ul>, <li>, <strong>).
3.  **LMS Assignments:** Instead of generic tasks, create structured LMS assignments with Rubrics (Grading Criteria).

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
