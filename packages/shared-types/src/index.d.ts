export interface Card {
  id: string;
  boardId: string;
  title: string;
  description: string;
  column: 'todo' | 'inProgress' | 'done';
  order: number;
}

export interface Board {
  id: string;
  name: string;
  columns: {
    todo: Card[];
    inProgress: Card[];
    done: Card[];
  };
}
