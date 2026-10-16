import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccountEntity } from './entities/account-entities.js';
import { UserEntity } from '../user/entites/user-entities.js';
import * as helper from '../common/helper.js';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 1. Create account
  async createAccount(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accountNumber = helper.generateAccountNumber();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const account = this.accountRepository.create({
      accountNumber: accountNumber,
      balance: '0.00',
      user: { id: userId },
      createdAt: formattedDate,
    });

    return this.accountRepository.save(account);
  }

  // 2. View one account
  async getAccount(userId: number, accountId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { user: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user.id !== userId) {
      throw new ForbiddenException('You do not own this account');
    }

    return account;
  }

  // 3. View all accounts belonging to a user
  async getUserAccounts(userId: number) {
    return this.accountRepository.find({
      where: {
        user: { id: userId },
      },
      select: {
        id: true,
        accountNumber: true,
        balance: true,
        createdAt: true,
      },
    });
  }

  // 4. Check account balance
  async getBalance(userId: number, accountId: number) {
    const account = await this.getAccount(userId, accountId);

    return {
      accountNumber: account.accountNumber,
      balance: account.balance,
    };
  }
}
