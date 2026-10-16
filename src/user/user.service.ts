import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entites/user-entities.js';

import * as helper from '../common/helper.js';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user;
  }
  async register(createUserDto: CreateUserDto) {
    const { name, email, password, confirmPassword } = createUserDto;
    console.log(helper);
    if (password !== confirmPassword) {
      throw new UnauthorizedException('Passwords must match');
    }
    const result = await helper.hashPassword(password);
    const hashedPassword: any = result;
    console.log('hashedPassword', hashedPassword);

    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('A user with that email already exists!!');
    }
    if (!existingUser) {
      const user = this.userRepository.create({
        name: name,
        email: createUserDto.email,
        password: hashedPassword,
      });
      await this.userRepository.save(user);

      return { message: 'successfully created' };
    }
  }
}

// 2311061036
