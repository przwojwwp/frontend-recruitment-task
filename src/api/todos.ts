export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const API_URL = `http://localhost:3000`;

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/todos`);
  return res.json();
};
