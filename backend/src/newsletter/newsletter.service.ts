import {
  Injectable,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NewsletterService {
  private resend: Resend;
  private readonly logger = new Logger(NewsletterService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async subscribe(email: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'Coconut <onboarding@resend.dev>',
      to: [email],
      subject: '🥥 Welcome to the Coconut Family!',
      html: this.getWelcomeTemplate(),
    });

    if (error) {
      this.logger.error(`Resend error for ${email}: ${error.message}`);
      throw new ServiceUnavailableException('Failed to send welcome email');
    }

    return {
      success: true,
      message: 'Welcome email sent successfully',
      id: data.id,
    };
  }

  private getWelcomeTemplate() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background: #1a1a1a; padding: 40px 20px; text-align: center; }
            .logo { font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -1px; }
            .logo span { color: #f97316; }
            .content { padding: 40px; text-align: center; }
            .title { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }
            .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.8; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
            .accent { color: #f97316; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Coconut<span>.</span></div>
            </div>
            <div class="content">
              <h1 class="title">You're on the list! 🥥🚀</h1>
              <p class="message">
                Thank you for registering your interest in the <span class="accent">Coconut</span> app. 
                Our mobile experience is currently being carefully crafted and is <span class="accent">coming soon</span> to your device.
              </p>
              <p class="message" style="font-style: italic; color: #1a1a1a; font-weight: 500;">
                "We really would be glad to serve you."
              </p>
              <p class="message">
                We'll notify you the moment we launch on the App Store and Play Store. Stay tuned for exclusive early-bird rewards!
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Coconut Food Delivery. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
