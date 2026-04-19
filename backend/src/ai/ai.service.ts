import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from '../food/schemas/food.schema';
import Groq from 'groq-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private groq: Groq | null = null;

  constructor(
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
    }
  }

  async getRecommendations(query: string) {
    if (!this.groq) {
      throw new BadRequestException('AI integration is not configured properly.');
    }

    // 1. Fetch current catalog for context injection
    const foods = await this.foodModel.find().exec();
    const catalogContext = foods.map((f) => ({
      id: f._id,
      name: f.name,
      description: f.description,
      price: f.price,
      category: f.category,
    }));

    // 2. Construct Context RAG Prompt
    const systemPrompt = `You are "Coconut AI", an expert food ordering assistant at a premium restaurant. 

Here is the current active menu catalog in JSON:
${JSON.stringify(catalogContext)}

Task: Analyze the user's intent. Do they want something spicy? Vegan? Sweet? Find the best matching items from the menu.

Return a STRICT JSON object in exactly this format:
{
  "message": "A friendly, conversational 1-2 sentence response to the user's craving identifying what you found.",
  "itemIds": ["id1", "id2"] // An array of the matching food item IDs. If none match perfectly, provide the closest alternatives or an empty array.
}`;

    try {
      // 3. Generate Response using Groq (Llama 3.3)
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });

      const responseText = chatCompletion.choices[0]?.message?.content || '{}';

      const parsedData = JSON.parse(responseText) as {
        message: string;
        itemIds?: string[];
      };

      return {
        success: true,
        message: parsedData.message,
        itemIds: parsedData.itemIds || [],
      };
    } catch (error) {
      console.error('Groq AI Error:', error);
      throw new ServiceUnavailableException(
        `AI Search failed: ${error.message || 'Unknown provider error'}`,
      );
    }
  }
}
