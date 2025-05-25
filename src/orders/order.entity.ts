import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Product } from 'src/products/products.entity';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Product, Product => Product.order, { cascade: true })
    items: Product[];

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    shippingCost: number;


    @Column('json', { nullable: true })
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };


    @Column({ length: 50, nullable: true })
    paymentMethod: string;



    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}