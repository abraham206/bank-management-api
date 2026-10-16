import { Module } from '@nestjs/common';
import User from './user.controller.js';
import { UserService } from './user.service.js';
import { UserEntity } from './entites/user-entities.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [User],
  providers: [UserService],
  exports: [UserService],
})
export class userModule {}
