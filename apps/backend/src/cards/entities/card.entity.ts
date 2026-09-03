import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BoardEntity } from './../../boards/entities/board.entity.js';

export type CardColumn = 'todo' | 'inProgress' | 'done';

@Entity('cards')
export class CardEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  column: CardColumn;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column()
  boardId: string;

  @ManyToOne(() => BoardEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardEntity;
}
