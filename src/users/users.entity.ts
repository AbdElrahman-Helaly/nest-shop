import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Product } from 'src/products/products.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  @Column()
  userName: string;

  @Expose()
  @Column({ nullable: true })
  phone: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Expose()
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.creator)
  createdProducts: Product[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
