import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entites/user-entities.js';
import type { Relation } from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: string;

  @Column({
    unique: true,
  })
  accountNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.transactions, {
    nullable: false,
  })
  user: Relation<UserEntity>;
}
