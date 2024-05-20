import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { Profile } from "./profile.entity";

/**
 * User entity represents a user in the application.
 * @namespace User
 */
@Entity("user")
export class UserEntity {
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

  /**
   * Profile associated with the user.
   */
  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @CreateDateColumn()
  createdAt!: Date;
}
