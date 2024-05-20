import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
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

  @Column()
  postId!: number;

  /**
   * Post to which the comment belongs.
   */
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: "postId" })
  post!: Post;

  @Column()
  parentId!: number;

  /**
   * Parent comment of the current comment.
   */
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  parent!: Comment | null;

  /**
   * Replies to the current comment.
   */
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies!: Comment[];
}
