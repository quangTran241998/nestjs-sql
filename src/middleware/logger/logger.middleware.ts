import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { blue, green, bold } from 'colorette';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const body = JSON.stringify(req.body);
    const query = JSON.stringify(req.query);
    const origin = req.headers['origin'] || 'Unknown';

    console.log(
      `${bold(green(`[Request]`))}\n ${blue('Method')}: ${req.method}\n ${blue('Origin')}: ${origin}\n ${blue('Path')}: ${req.baseUrl}\n ${blue('Query')}: ${query}\n ${blue('Body')}: ${body} \n ${blue('Time')}: ${new Date()} \n`,
    );
    next();
  }
}
