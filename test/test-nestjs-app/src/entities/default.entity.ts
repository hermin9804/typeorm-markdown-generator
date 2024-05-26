import { Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Default entity for the typeorm-markdown-generator.
 */
@Entity()
export class Default {
  @PrimaryGeneratedColumn()
  id!: number;
}
