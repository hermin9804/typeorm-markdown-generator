import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { UserEntity } from './user.entity';

/**
 * Comment entity represents a comment on a post in the application.
 * @erd Post
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
   * Post ID to which the comment belongs.
   */
  @Column()
  postId!: number;

  /**
   * parent comment id of the current comment.
   */
  @Column({ nullable: true })
  parentId!: number | null;

  /**
   * User ID who created the comment.
   */
  @Column()
  userId!: number;

  /**
   * Post to which the comment belongs.
   */
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  /**
   * Parent comment of the current comment.
   */
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent!: Comment | null;

  /**
   * Replies to the current comment.
   */
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies!: Comment[];

  /**
   * User who created the comment.
   */
  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
