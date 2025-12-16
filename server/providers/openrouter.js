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
      "rubric": [
        {
          "title": "string",
          "description": "string",
          "max_points": number
        }
      ]
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
