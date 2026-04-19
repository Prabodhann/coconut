import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Determine the status code
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // If the exception has a customized payload message (like ValidationPipe throws array of messages)
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if ('message' in exceptionResponse) {
          message = (exceptionResponse as Record<string, unknown>)[
            'message'
          ] as string | string[];
        } else {
          message = exceptionResponse as unknown as string | string[];
        }
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // In case of any unhandled Node instance errors (like DB crashing)
      message = exception.message;
    }

    // Always structure the response exactly as the frontend expects
    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
    });
  }
}
