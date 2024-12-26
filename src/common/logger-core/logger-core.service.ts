import { LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  log(message: any, context?: string) {
    console.log(this.formatMessage('LOG', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage('ERROR', message, context), trace);
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  debug?(message: any, context?: string) {
    console.debug(this.formatMessage('DEBUG', message, context));
  }

  verbose?(message: any, context?: string) {
    console.log(this.formatMessage('VERBOSE', message, context));
  }

  private formatMessage(level: string, message: any, context?: string): string {
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const formattedTimestamp = timestamp.replace(/-/g, '/');
    return `[${formattedTimestamp}] [${level}]${context ? ` [${context}]` : ''} ${message}`;
  }
}
