import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module available everywhere
      envFilePath: `.env.${process.env.NODE_ENV}`, // load env variables based on environment
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // inject config service into TypeORM module
      useFactory: async (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DATABASE_FILE'),
        entities: [Report, User],
        synchronize: true, // only for development!!!
      }),
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // every request will be piped through this validation pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // CookieSession middleware will be applied to all routes
    consumer
      .apply(
        CookieSession({
          keys: ['secret-encryption-key-2'],
        }),
      )
      .forRoutes('*');
  }
}
