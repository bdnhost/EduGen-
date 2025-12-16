import { GuideData, GuideCategory, GuideTeasers, GuideAssignments } from "../types";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  cost: string;
}

export interface GenerateRequest {
  topic: string;
  description?: string;
  provider: string;
  modelId: string;
  // New matireal-compatible fields
  category?: GuideCategory;
  emoji?: string;
  shortDescription?: string;
  teasers?: GuideTeasers;
  assignments?: GuideAssignments;
  faq?: Array<{ question: string; answer: string }>;
}

/**
 * API Service - communicates with backend server
 */
export class ApiService {

  /**
   * Check if backend server is running
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Get available models from backend
   */
  static async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error('לא ניתן לטעון את רשימת המודלים. ודא שהשרת פועל.');
    }
  }

  /**
   * Generate guide content via backend
   */
  static async generateGuide(request: GenerateRequest): Promise<GuideData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'שגיאה ביצירת המדריך');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('API generation error:', error);
      throw new Error(error.message || 'שגיאה ביצירת המדריך. ודא שהשרת פועל.');
    }
  }

  /**
   * Run manifest generator script
   */
  static async runManifestGenerator(): Promise<{ success: boolean; message: string; output?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/run-manifest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהרצת הסקריפט');
      }

      return data;
    } catch (error: any) {
      console.error('Error running manifest generator:', error);
      throw new Error(error.message || 'שגיאה בהרצת הסקריפט. ודא שהשרת פועל.');
    }
  }
}
