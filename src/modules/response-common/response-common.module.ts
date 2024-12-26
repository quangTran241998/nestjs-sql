import { Global, Module } from '@nestjs/common';
import { ResponseService } from './response-common.service';
@Global()
@Module({
  providers: [ResponseService],
  exports: [ResponseService],
})
export class ResponseModule {}
