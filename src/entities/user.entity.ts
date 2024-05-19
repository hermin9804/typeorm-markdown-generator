import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./post.entity";

/**
 * User entity represents a user in the application.
 */
@Entity()
export class User {
  /**
   * Primary key for the user.
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Username of the user.
   * @type {string}
   */
  @Column()
  username!: string;

  /**
   * Email of the user.
   * @type {string}
   */
  @Column()
  email!: string;

  /**
   * List of posts created by the user.
   * @type {Post[]}
   */
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}
