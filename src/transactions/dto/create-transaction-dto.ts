import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  senderAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  recieverAccountNumber: string;
}
