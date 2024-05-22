import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Profile entity represents additional user details.
 * @namespace User
 */
@Entity()
export class Profile {
  /**
   * Primary key for the profile.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Biography of the user.
   */
  @Column()
  bio!: string;

  @Column()
  userId!: number;

  /**
   * User associated with this profile.
   */
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;
}