import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "./post.entity";

/**
 * Comment entity represents a comment on a post in the application.
 * @namespace Post
 */
@Entity()
export class Comment {
  /**
   * Primary key for the comment.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Content of the comment.
   */
  @Column()
  content!: string;

  /**
   * Post to which the comment belongs.
   */
  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;
}
