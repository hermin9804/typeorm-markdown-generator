import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { Comment } from "./comment.entity";
import { Category } from "./category.entity";

/**
 * Post entity represents a post in the application.
 * @namespace Post
 * @namespace User
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
   * User who created the post.
   */
  @ManyToOne(() => UserEntity, (user) => user.posts)
  user!: UserEntity;

  /**
   * Comments on the post.
   */
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  /**
   * Category of the post.
   */
  @ManyToOne(() => Category, (category) => category.posts)
  category!: Category;
}
