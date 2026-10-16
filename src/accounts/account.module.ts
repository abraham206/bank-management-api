import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountEntity } from './entities/account-entities.js';
import { AccountsController } from './account.controller.js';
import { AccountsService } from './account.service.js';
import { UserEntity } from '../user/entites/user-entities.js';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, UserEntity])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
