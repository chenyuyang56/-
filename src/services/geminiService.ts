import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PopupRecommendation {
  type: string;
  category: "Modal" | "Non-Modal";
  purpose: string;
  content: {
    title?: string;
    message: string;
    primaryButton?: string;
    secondaryButton?: string;
    options?: string[];
  };
  designSuggestions: string;
  rationale: string;
}

export async function generatePopupRecommendation(scenario: string, requirements: string): Promise<PopupRecommendation> {
  const prompt = `
    You are an expert UI/UX designer and product manager. 
    Based on the following scenario and requirements, recommend the most suitable app popup type and content.

    Scenario: ${scenario}
    Requirements: ${requirements}

    Use the following classification system:
    1. Modal Popups (Interruptive):
       - Dialog / Alert: For risk, confirmation, critical actions.
       - ActionSheet: Bottom sheet for multiple options (share, select).
       - Popover / Popup: Attached to a control for menus or tips.
    2. Non-Modal Popups (Non-interruptive):
       - Toast / HUD: Short feedback (success/fail), disappears automatically.
       - Snackbar: Toast with an optional action button (e.g., Undo).
       - Notice: System/App notification from top.
       - HUD: Loading, volume, brightness status.

    Purpose categories: Confirmation, Prompt/Feedback, Guide, Operation/Promotion, Permission.

    Return the result in JSON format with the following structure:
    {
      "type": "The specific popup type (e.g., Dialog, Toast, etc.)",
      "category": "Modal or Non-Modal",
      "purpose": "The purpose category",
      "content": {
        "title": "Optional title",
        "message": "The main message content",
        "primaryButton": "Optional primary action text",
        "secondaryButton": "Optional secondary action text",
        "options": ["Optional list of options for ActionSheet or Popover"]
      },
      "designSuggestions": "Brief advice on visual styling",
      "rationale": "Why this type was chosen based on the scenario"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Modal", "Non-Modal"] },
          purpose: { type: Type.STRING },
          content: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              primaryButton: { type: Type.STRING },
              secondaryButton: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["message"]
          },
          designSuggestions: { type: Type.STRING },
          rationale: { type: Type.STRING }
        },
        required: ["type", "category", "purpose", "content", "designSuggestions", "rationale"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
