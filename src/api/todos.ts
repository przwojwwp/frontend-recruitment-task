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

export const addTodo = async (title: string): Promise<Todo> => {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false }),
  });
  return res.json();
};
