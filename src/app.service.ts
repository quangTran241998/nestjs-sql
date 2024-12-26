import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}
  getHello() {
    return 'This is project control door ja';
  }
}
