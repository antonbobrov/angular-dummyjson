export type TTodoItem = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};

export type TTodoDelete = TTodoItem & {
  isDeleted: boolean;
};

export type TTodos = {
  todos: TTodoItem[];
};
