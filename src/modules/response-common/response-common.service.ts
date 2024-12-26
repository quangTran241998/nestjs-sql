import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ResponseCommon } from 'src/interfaces/common';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { HttpStatusMessages } from 'src/constants/http-status-message';

@Injectable()
export class ResponseService {
  constructor(private readonly i18n: I18nService) {}

  async success<T>(
    data: T,
    messageKey = 'test.response.success',
    lang: string = I18nContext.current().lang,
  ): Promise<ResponseCommon<T>> {
    const message = await this.i18n.translate(messageKey, { lang });
    return {
      statusCode: HttpStatus.OK,
      message,
      data,
    };
  }

  async error(
    messageKey = 'test.response.error',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error: string = HttpStatusMessages[HttpStatus.INTERNAL_SERVER_ERROR],
    lang: string = I18nContext.current().lang,
  ): Promise<ResponseCommon<null>> {
    const message = await this.i18n.translate(messageKey, { lang });
    throw new HttpException(
      {
        statusCode,
        message,
        error,
      },
      statusCode,
    );
  }
}
