import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { AccountEntity } from '../../accounts/entities/account-entities.js';
import { TransactionEntity } from '../../transactions/entities/transaction-entities.js';
import type { Relation } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.user,
  )
  transactions: Relation<TransactionEntity[]>;
  @OneToMany(() => AccountEntity, (accountEntity) => accountEntity.user)
  accounts: Relation<AccountEntity[]>;
}
