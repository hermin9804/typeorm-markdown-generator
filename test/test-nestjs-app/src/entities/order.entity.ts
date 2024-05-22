import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

/**
 * Order entity represents an order in the shopping mall.
 * @namespace ShoppingMall
 */
@Entity()
export class Order {
  /**
   * Primary key for the order.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * User ID who placed the order.
   */
  @Column()
  userId!: number;

  /**
   * Date the order was placed.
   */
  @Column()
  orderDate!: Date;

  /**
   * User who placed the order.
   */
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user!: User;

  /**
   * List of order items in the order.
   */
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];
}
