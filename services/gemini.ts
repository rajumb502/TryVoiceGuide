import {
  Content,
  GenerateContentConfig,
  GenerateContentParameters,
  GoogleGenAI
} from "@google/genai";
import { StorageService } from './StorageService';

export class GeminiLLM  {
  private static instance: GeminiLLM;
  public genAI!: GoogleGenAI;
  protected modelName: string;
  protected embeddingModel: string;
  private currentApiKey: string | null = null;

  /**
   * Create a new Gemini client
   * @param modelName The name of the model to use (defaults to 'gemini-1.5-flash')
   */
  private constructor(
    modelName: string = "gemini-2.5-flash", 
    embeddingModel: string = "gemini-embedding-001"
  ) {
    this.modelName = modelName;
    this.embeddingModel = embeddingModel;
    this.initializeClient();
  }

  public static getInstance(): GeminiLLM {
    if (!GeminiLLM.instance) {
      GeminiLLM.instance = new GeminiLLM();
    }
    return GeminiLLM.instance;
  }

  private initializeClient(): void {
    const storage = StorageService.getInstance();
    const apiKey = storage.getItem('gemini_api_key');
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set it in Settings.');
    }

    if (!this.genAI || this.currentApiKey !== apiKey) {
      this.genAI = new GoogleGenAI({ apiKey });
      this.currentApiKey = apiKey;
    }
  }

  private async callGemini(
    systemPrompt: string, 
    history?: Content[], 
    prompt?: string,
    config: GenerateContentConfig = {
        temperature: 0.2, // lower values imply less creative outputs
        topP: 0.95, // lower value for less random responses
        topK: 30,
        maxOutputTokens: 2048,
      },
//    tools: ToolListUnion = [{ functionDeclarations: this.functionDeclarations }]
  ): Promise<any> {
    const contents: Content[] = [];
    if (systemPrompt) contents.push({ role: 'user', parts:[{text: systemPrompt}] });
    if (history) contents.push(...history);
    if (prompt) contents.push({ role: 'user', parts: [{text: prompt}] });
    // if (tools) config = { ...config, tools };

    const params : GenerateContentParameters = {
      model: this.modelName,
      contents: contents,
      config
    }

    const response = await this.genAI.models.generateContent(params);
    return response?.candidates?.[0]?.content;
  }

  async generateResponse(message: string): Promise<string> {
    try {
      this.initializeClient();
      const result = await this.callGemini(
        'Your role is that of a helpful personal assistant who will help the user accomplish his tasks.',
        undefined,
        message
      );

      return result?.parts?.[0]?.text || '';

    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to get response from AI');
    }
  }
}

export const geminiService = GeminiLLM.getInstance();