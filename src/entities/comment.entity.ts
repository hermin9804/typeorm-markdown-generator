import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "./post.entity";

/**
 * Comment entity represents a comment on a post in the application.
 */
@Entity()
export class Comment {
  /**
   * Primary key for the comment.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Content of the comment.
   * @type {string}
   */
  @Column()
  content!: string;

  /**
   * Post to which the comment belongs.
   * @type {Post}
   */
  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;
}
