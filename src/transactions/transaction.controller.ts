import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { TransactionsService } from './transaction.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.js';
import { CreateTransactionDto } from './dto/create-transaction-dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  // Transfer money to a different acc
  @Post('transfer')
  transfer(
    @Req() req: AuthenticatedRequest,
    @Body()
    CreateTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.transfer(
      req.user.userId,
      CreateTransactionDto.senderAccountNumber,
      CreateTransactionDto.recieverAccountNumber,
      CreateTransactionDto.amount,
    );
  }

  // get all transactions
  @Get('all-transactions')
  all(@Req() req: AuthenticatedRequest) {
    return this.transactionsService.getAllTransactions(req.user.userId);
  }

  // Get a particular transaction
  @Get(':transactionId')
  getAccountTransactions(
    @Req() req: AuthenticatedRequest,
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ) {
    return this.transactionsService.getAccountTransactions(
      req.user.userId,
      transactionId,
    );
  }
}
