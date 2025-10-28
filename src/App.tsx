import { clsx } from "clsx";
import { useEffect, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const API_URL = `http://localhost:3000`;

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function getTodos() {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTodos(data);
    }
    getTodos();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = {
      title: title.trim(),
      completed: false,
    };

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }

      const createdTodo = await res.json();
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const updateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      const updatedTodo = await res.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <form onSubmit={addTodo}>
        <input
          placeholder="What needs to be done?"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </form>

      <fieldset>
        <legend className="text-base font-semibold leading-6 text-gray-900">
          Todo list
        </legend>
        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
          <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
            {todos.map((todo) => (
              <div
                key={todo.id}
                data-testid="todo-item"
                className={clsx(
                  "relative flex items-start py-4",
                  todo.completed && "line-through",
                )}
              >
                <div className="min-w-0 flex-1 text-sm leading-6">
                  <label
                    className="select-none font-medium text-gray-900"
                    data-testid="todo-title"
                  >
                    {todo.title}
                  </label>
                </div>
                <div className="ml-3 flex h-6 items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={todo.completed}
                    onChange={() =>
                      updateTodo(todo.id, { completed: !todo.completed })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="flex h-8 items-center justify-between">
        <span
          data-testid="todo-count"
          className="text-sm font-medium leading-6 text-gray-900"
        >
          {todos.filter((todo) => !todo.completed).length} items left
        </span>
        <button className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Clear completed
        </button>
      </div>
    </div>
  );
}
