import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./post.entity";

/**
 * User entity represents a user in the application.
 * @namespace User
 */
@Entity()
export class User {
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
}
