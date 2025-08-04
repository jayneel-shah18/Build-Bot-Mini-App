import type { BotConfig } from '../types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class LLMService {
  private static readonly OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private static readonly OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

  static async sendMessage(
    userMessage: string,
    botConfig: BotConfig,
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    if (!userMessage.trim()) {
      throw new Error('Message cannot be empty');
    }

    if (userMessage.length > 1000) {
      throw new Error('Message too long. Please keep it under 1000 characters.');
    }

    const systemPrompt = `You are a chatbot named ${botConfig.name}, acting as ${botConfig.persona}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];

    if (botConfig.model.startsWith('gpt')) {
      return this.getMockResponse(botConfig.model, userMessage);
    } else if (botConfig.model === 'mistral-7b') {
      try {
        return await this.callOpenRouterAPI(messages);
      } catch (error) {
        console.warn('Mistral API failed, falling back to mock response:', error);
        return Promise.resolve(this.getMockResponseSync(botConfig.model, userMessage));
      }
    }

    throw new Error(`Unsupported model: ${botConfig.model}`);
  }

  private static getMockResponse(model: string, userMessage: string): Promise<string> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const mockResponses = [
          `Mocked response from ${model.toUpperCase()}: I understand you said "${userMessage}". This is a simulated response for demonstration purposes.`,
          `This is a mock response from ${model.toUpperCase()}. In a real implementation, this would be the actual AI response to: "${userMessage}"`,
          `${model.toUpperCase()} Mock: I'm processing your message "${userMessage}" and providing this simulated response since no API key is configured.`
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        resolve(randomResponse);
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  private static getMockResponseSync(model: string, userMessage: string): string {
    const fallbackResponses = [
      `API Error Fallback - ${model}: I apologize, but I encountered a connection issue. This is a fallback response to your message: "${userMessage}"`,
      `Connection Failed - ${model}: Unable to reach the AI service. Here's a mock response instead: I understand you're asking about "${userMessage}".`,
      `Fallback Response - ${model}: The AI service is currently unavailable, but I can still help with basic responses about "${userMessage}".`
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  private static async callOpenRouterAPI(messages: ChatMessage[]): Promise<string> {
    try {
      if (!this.OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured');
      }

      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Build-Bot",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "mistralai/mistral-7b-instruct:free",
          "messages": messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API call failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the AI service. Please check your internet connection.');
      }
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Authentication failed: Invalid API key. Please check your OpenRouter API key.');
      }
      
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('Rate limit exceeded: Too many requests. Please wait a moment and try again.');
      }
      
      throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  }
}
