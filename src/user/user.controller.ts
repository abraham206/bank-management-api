import { Get, Post, Param, Query, Body, Controller } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user-dto.js';

@Controller('user')
export default class User {
  constructor(private readonly userService: UserService) {}

  @Post('/createUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
}
