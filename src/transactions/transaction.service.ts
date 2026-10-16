import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TransactionEntity } from './entities/transaction-entities.js';
import { AccountEntity } from '../accounts/entities/account-entities.js';
import { UserEntity } from '../user/entites/user-entities.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // Transfer money
  async transfer(
    userId: number,
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('No user found!');
      }
      const sender = await queryRunner.manager.findOne(AccountEntity, {
        where: { accountNumber: senderAccountNumber },
        relations: { user: true },
      });
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new BadRequestException('Invalid transfer amount');
      }

      if (sender?.accountNumber === receiverAccountNumber) {
        throw new BadRequestException('Cannot transfer to the same account');
      }

      if (!sender) {
        throw new NotFoundException('Account not found');
      }
      const receiver = await queryRunner.manager.findOne(AccountEntity, {
        where: { accountNumber: receiverAccountNumber },
        relations: { user: true },
      });
      if (sender.user.id !== userId) {
        throw new ForbiddenException('You do not own this account');
      }

      if (!receiver) {
        throw new NotFoundException('Receiver account not found');
      }

      const senderBalance = Number(sender.balance) * 100;
      const receiverBalance = Number(receiver.balance) * 100;

      if (senderBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      sender.balance = (senderBalance - amount).toFixed(2);

      receiver.balance = (receiverBalance + amount).toFixed(2);

      await queryRunner.manager.save(AccountEntity, [sender, receiver]);

      const transaction = queryRunner.manager.create(TransactionEntity, {
        amount: amount,
        accountNumber: receiver.accountNumber,
        createdAt: Date.now(),
        user: { id: sender.id },
      });
      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return {
        message: 'Transfer successful',
        amount: amount.toFixed(2),
        senderAccountNumber,
        receiverAccountNumber,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // View a transaction
  async getAccountTransactions(userId: number, transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId, user: { id: userId } },
      relations: { user: true },
    });

    if (!transaction) {
      throw new NotFoundException('transaction not found');
    }

    if (transaction.user.id !== userId) {
      throw new ForbiddenException('You do not own this transaction');
    }

    return transaction;
  }

  // get all transaction done by a user

  async getAllTransactions(userId: number) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
    });

    if (!transactions || transactions.length <= 0) {
      throw new NotFoundException('No transaction yet!');
    }

    return transactions;
  }
}
