import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { AuthenticationModule } from './authentication/authentication.module';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV == 'local' ? `.env.local` : null,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({ context: 'HTTP' }),
        autoLogging: {
          ignore: (req: any) => {
            return ['/health/api', '/health', '/api'].some((e) =>
              req.originalUrl.includes(e),
            );
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    AuthenticationModule,
    SharedModule,
    HealthModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
