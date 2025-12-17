import axios from 'axios';

/**
 * OpenRouter Provider - supports multiple LLM models
 * Models: DeepSeek, GPT-4, Claude, Gemini, Llama, Mistral, and more
 */
export class OpenRouterProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  /**
   * Get list of available models from OpenRouter
   */
  async getAvailableModels() {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error.message);
      return [];
    }
  }

  /**
   * Generate guide content using selected model
   */
  async generateGuide(topic, userDescription, modelId = 'deepseek/deepseek-chat') {
    const prompt = this.buildPrompt(topic, userDescription);

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: modelId,
          messages: [
            {
              role: 'system',
              content: 'You are a Senior Curriculum Developer and Expert Technical Writer. You create comprehensive educational guides in Hebrew with structured content including theory, practice, LMS integration, and interactive elements.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'EduGen'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const data = JSON.parse(content);
      return { ...data, topic };
    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      throw new Error(`OpenRouter generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  buildPrompt(topic, userDescription) {
    return `
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

**CRITICAL - Return ONLY valid JSON with this exact structure:**
{
  "filenameSlug": "string (short, hyphenated English, e.g., 'intro-to-python')",
  "title": "string (professional Hebrew title)",
  "description": "string (SEO description, 150-200 chars)",
  "keywords": "string (Hebrew keywords, comma separated)",
  "readingTime": number (10-15 minutes),
  "difficulty": "Beginner|Intermediate|Advanced",
  "courseName": "string (realistic course name)",
  "courseCode": "string (e.g., CS-101-2024)",
  "institution": "string (e.g., 'LearningHub Academy')",
  "sessionNumber": number,
  "category": "AI & Automation|Career|Creative Studio|Data & Business|Digital Basics|Technology",
  "emoji": "string (single emoji)",
  "shortDescription": "string (MAX 50 chars)",
  "headerImagePrompt": "string (English AI image prompt, minimalist modern tech vector art)",
  "introContent": "string (HTML with <p>, <ul>, <li>, <strong>)",
  "part1Title": "string",
  "part1Content": "string (HTML)",
  "diagramTheory": "string (Mermaid.js syntax, Hebrew labels, NO markdown blocks)",
  "codeExample": "string",
  "teaserIdea": "string",
  "part2Title": "string",
  "part2Content": "string (HTML)",
  "diagramPractice": "string (Mermaid.js syntax, Hebrew labels)",
  "part2Steps": ["string", "string", ...],
  "teaserWarning": "string",
  "advancedTitle": "string",
  "advancedPoint1Title": "string",
  "advancedPoint1List": ["string", ...],
  "advancedPoint2Title": "string",
  "advancedPoint2List": ["string", ...],
  "teaserSecret": "string",
  "summaryPoints": ["string", ...],
  "nextSteps": ["string", ...],
  "commonMistakes": ["string", ...],
  "lmsAssignments": [
    {
      "title": "string",
      "description": "string",
      "type": "assignment|quiz|project",
      "weight": number,
      "due_days_offset": number,
      "rubric": [{"title": "string", "description": "string", "max_points": number}],
      "quizQuestions": [  // For type='quiz' ONLY
        {
          "question": "string (Hebrew)",
          "options": ["opt1", "opt2", "opt3", "opt4"],
          "correctAnswer": number (0-3),
          "explanation": "string",
          "imageUrl": "string (optional Pollinations prompt)",
          "points": number
        }
      ],
      "passingScore": number (e.g., 80),
      "projectMilestones": [  // For type='project' ONLY
        {
          "title": "string",
          "description": "string",
          "dueOffset": number (days),
          "deliverables": ["string", ...],
          "points": number
        }
      ],
      "finalDeliverable": "string"
    }
  ],
  "teaserBonus": "string",
  "relatedGuides": [
    {
      "title": "string",
      "description": "string",
      "icon": "string"
    }
  ],
  "faq": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}

Output: Return ONLY the JSON object, no markdown, no code blocks, just pure JSON.
    `.trim();
  }
}
