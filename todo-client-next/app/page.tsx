'use client'

import { useEffect, useState } from 'react'

interface Todo {
  id: number
  title: string
  completed: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [completed, setcompleted] = useState(false);

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:3000/todo')
    const data = await res.json()
    setTodos(data)
  };

  const addTodo = async () => {
    if (!title) return;

    await fetch('http://localhost:3000/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    setTitle('');
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  async function toggleTodo(id:number){
    if (!id) return;

    await fetch('http://localhost:3000/todo/'+id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    setcompleted(true);
    fetchTodos();
  };

  async function removeTodo(id:number){
    if (!id) return;

    await fetch('http://localhost:3000/todo/'+id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    fetchTodos();
  }

  return (
    <div>
      <h1 className="nv-bar">TODO APP</h1>

      <input type="text" id="todoInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일 입력"
      />
      <button id="addTodoBtn" onClick={addTodo}>추가</button>

      <ul id="toddList">
        {todos.map((todo) => (
          <li id={"todo"+todo.id} key={todo.id}>
            <input id={"checkbox"+todo.id} type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} /> {todo.title} <button className="remove-todo-btn" onClick={() => removeTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}