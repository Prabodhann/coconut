import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint — required by Render.com to confirm the
   * container is running after deployment.
   * Also used by the frontend warm-up ping to wake the server
   * from its sleep state on Render's free tier.
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'coconut-backend',
    };
  }
}
