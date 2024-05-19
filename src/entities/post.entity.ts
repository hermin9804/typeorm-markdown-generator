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
 */
@Entity()
export class Post {
  /**
   * Primary key for the post.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Title of the post.
   * @type {string}
   */
  @Column()
  title!: string;

  /**
   * Content of the post.
   * @type {string}
   */
  @Column()
  content!: string;

  /**
   * User who created the post.
   * @type {User}
   */
  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  /**
   * List of comments on the post.
   * @type {Comment[]}
   */
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];
}
