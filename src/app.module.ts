import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatModule } from './modules/cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LANGUAGE_ENUM } from './interfaces/enum';
import { ResponseModule } from './modules/response-common/response-common.module';
import { typeOrmConfig } from './config/db/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        try {
          const config = await typeOrmConfig(configService);
          console.log('Database connection successful');
          return config;
        } catch (error) {
          console.error('Error connecting to database:', error);
          throw new Error('Unable to connect to database');
        }
      },
      inject: [ConfigService],
    }),

    I18nModule.forRoot({
      fallbackLanguage: LANGUAGE_ENUM.EN,
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      loader: I18nJsonLoader,
      resolvers: [{ use: AcceptLanguageResolver, options: { matchType: 'strict' } }],
    }),
    ResponseModule,
    AuthModule,
    CatModule,
    UserModule,
  ],

  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
