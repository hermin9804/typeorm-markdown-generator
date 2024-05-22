import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Category } from './category.entity';

/**
 * Post entity represents a post in the application.
 * @namespace Post
 */
@Entity()
export class Post {
  /**
   * Primary key for the post.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Title of the post.
   */
  @Column()
  title!: string;

  /**
   * Content of the post.
   */
  @Column()
  content!: string;

  /**
   * Category ID of the post.
   */
  @Column()
  categoryId!: number;

  /**
   * User ID who created the post.
   */
  @Column()
  userId!: number;

  /**
   * User who created the post.
   */
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user!: User;

  /**
   * Category of the post.
   */
  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  /**
   * Comments on the post.
   */
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
