import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

/**
 * OrderItem entity represents an item in an order in the shopping mall.
 * @namespace ShoppingMall
 */
@Entity()
export class OrderItem {
  /**
   * Primary key for the order item.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Quantity of the product in the order.
   */
  @Column()
  quantity!: number;

  /**
   * Order ID to which the item belongs.
   */
  @Column()
  orderId!: number;

  /**
   * Product ID in the order item.
   */
  @Column()
  productId!: number;

  /**
   * Order to which this item belongs.
   */
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  /**
   * Product in the order item.
   */
  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product!: Product;
}
