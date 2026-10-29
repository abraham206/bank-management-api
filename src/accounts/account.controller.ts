import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { AccountsService } from './account.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // Create account
  @Post('create-account')
  createAccount(@Req() req: AuthenticatedRequest) {
    return this.accountsService.createAccount(req.user.userId);
  }

  // 4698177137

  // View one account
  @Get(':accountId')
  getAccount(
    @Req() req: AuthenticatedRequest,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return this.accountsService.getAccount(req.user.userId, accountId);
  }

  // View all accounts belonging to the logged-in user
  @Get('/all-accounts')
  getUserAccounts(@Req() req: AuthenticatedRequest) {
    return this.accountsService.getUserAccounts(req.user.userId);
  }

  // Check balance
  @Get(':accountId/balance')
  getBalance(
    @Req() req: AuthenticatedRequest,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return this.accountsService.getBalance(req.user.userId, accountId);
  }
}
