import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiQueryDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend')
  async getRecommendation(@Body() body: AiQueryDto) {
    return await this.aiService.getRecommendations(body.query);
  }
}
