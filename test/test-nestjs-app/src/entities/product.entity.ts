import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

/**
 * Product entity represents a product in the shopping mall.
 * @namespace ShoppingMall
 */
@Entity()
export class Product {
  /**
   * Primary key for the product.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Name of the product.
   */
  @Column()
  name!: string;

  /**
   * Description of the product.
   */
  @Column()
  description!: string;

  /**
   * Price of the product.
   */
  @Column('decimal')
  price!: number;

  /**
   * List of orders that include this product.
   */
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];
}
