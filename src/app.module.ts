import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { userModule } from './user/user.module.js';
import { AccountsModule } from './accounts/account.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { TransactionsModule } from './transactions/transaction.module.js';
import { UserEntity } from './user/entites/user-entities.js';
import { AccountEntity } from './accounts/entities/account-entities.js';
import { TransactionEntity } from './transactions/entities/transaction-entities.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  // imports: [
  //   // Distributed tracing, auto-correlated logs, request/job metrics, error
  //   // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
  //   ObserveModule.forRoot({
  //     appKey: 'YOUR_APP_KEY',
  //     appSecret: 'YOUR_APP_SECRET',
  //     serviceId: 'first-nest-app',
  //   }),
  // ],
  // imports: [userModule, AccountModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, AccountEntity, TransactionEntity],
      synchronize: false,
    }),
    userModule,
    AccountsModule,
    TransactionsModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
