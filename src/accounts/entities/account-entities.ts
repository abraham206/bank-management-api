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

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '300000' })
  balance: string;

  @Column({
    unique: true,
  })
  accountNumber: string;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.accounts, {
    nullable: false,
  })
  user: Relation<UserEntity>;
}
