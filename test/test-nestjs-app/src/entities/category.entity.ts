import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './post.entity';

/**
 * Category entity represents a category of posts.
 * @namespace Post
 * @test
 */
@Entity()
export class Category {
  /**
   * Primary key for the category.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Name of the category.
   */
  @Column()
  name!: string;

  /**
   * List of posts under this category.
   */
  @OneToMany(() => Post, (post) => post.category)
  posts!: Post[];
}
