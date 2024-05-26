import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

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

  /**
   * User ID associated with this profile.
   */
  @Column()
  userId!: number;

  /**
   * User associated with this profile.
   */
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
