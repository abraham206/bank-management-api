import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  Amount: string;

  @IsNotEmpty()
  @IsString()
  recipient: string;
}
