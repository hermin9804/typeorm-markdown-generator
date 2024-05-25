import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { Profile } from './profile.entity';
import { Order } from './order.entity';
import { Comment } from './comment.entity';

/**
 * User entity represents a user in the application.
 * @namespace User
 * @namespace Post
 * @namespace ShoppingMall
 */
@Entity()
export class UserEntity {
  /**
   * Primary key for the user.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Username of the user.
   */
  @Column()
  username!: string;

  /**
   * Email of the user.
   */
  @Column()
  email!: string;

  /**
   * List of posts created by the user.
   */
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  /**
   * Profile associated with the user.
   */
  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  /**
   * Orders placed by the user.
   */
  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  /**
   * Comments made by the user.
   */
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
}
