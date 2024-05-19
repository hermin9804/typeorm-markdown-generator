import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

/**
 * Post entity represents a blog post in the application.
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
  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  /**
   * List of comments on the post.
   */
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
