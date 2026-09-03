import { Entity, PrimaryColumn, Column } from 'typeorm';

export class CardEntityModel {
  id: string;
  title: string;
  description: string;
  column: 'todo' | 'inProgress' | 'done';
  order: number;
  boardId: string;
}

@Entity('boards')
export class BoardEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('jsonb', { default: { todo: [], inProgress: [], done: [] } })
  columns: {
    todo: CardEntityModel[];
    inProgress: CardEntityModel[];
    done: CardEntityModel[];
  };
}