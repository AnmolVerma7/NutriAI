import Anthropic from '@anthropic-ai/sdk';

interface AIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export class AIHelper {
  private client: Anthropic;
  private config: AIConfig;
  private static instance: AIHelper;

  // Simple in-memory usage tracking
  private usage: TokenUsage = {
    input: 0,
    output: 0,
    total: 0
  };

  private constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.config = {
      model: 'claude-3-haiku-20240307', // Haiku model (fast & cheap)
      maxTokens: 1024,
      temperature: 0.7
    };
  }

  public static getInstance(): AIHelper {
    if (!AIHelper.instance) {
      AIHelper.instance = new AIHelper();
    }
    return AIHelper.instance;
  }

  /**
   * Generate a structured JSON response from a prompt using Claude's tool use capabilities
   * or by prompting for JSON output.
   */
  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: 0, // Lower temperature for structured data
        system:
          systemPrompt ||
          'You are a helpful AI assistant that outputs only valid JSON.',
        messages: [{ role: 'user', content: prompt }]
      });

      // Track usage
      if (response.usage) {
        this.usage.input += response.usage.input_tokens;
        this.usage.output += response.usage.output_tokens;
        this.usage.total +=
          response.usage.input_tokens + response.usage.output_tokens;
      }

      const content =
        response.content[0].type === 'text' ? response.content[0].text : '';

      // Attempt to parse JSON from the response
      // Find the first '{' and last '}' to handle potential markdown wrappers
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = content.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonStr) as T;
      }

      console.error('AI Helper: No valid JSON found. Raw content:', content);
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('AI Helper Error:', error);
      throw error;
    }
  }

  /**
   * Simple text generation
   */
  async ask(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      });

      // Track usage
      if (response.usage) {
        this.usage.input += response.usage.input_tokens;
        this.usage.output += response.usage.output_tokens;
        this.usage.total +=
          response.usage.input_tokens + response.usage.output_tokens;
      }

      return response.content[0].type === 'text'
        ? response.content[0].text
        : '';
    } catch (error) {
      console.error('AI Helper Error:', error);
      throw error;
    }
  }

  public getUsageStats(): TokenUsage {
    return { ...this.usage };
  }
}

export const getAIHelper = () => AIHelper.getInstance();
