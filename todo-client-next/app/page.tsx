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
  const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all');
  const [searchWord, setSearchWord] = useState('');

  // todo 목록 조회
  // todo 완료, 미완료 조회
  const fetchTodos = async (completed?:string, searchWord?:string) => {
    let url = 'http://localhost:3000/todo?'

    if (completed && completed !== 'all') {
      url += `completed=${completed}&`
    }

    if (searchWord) {
      url += `searchWord=${searchWord}`
    }

    console.log('fetchTodos url==>',url);

    const res = await fetch(url);
    const data = await res.json();
    console.log('fetchTodos data==>',data);
    setTodos(data);
  };

  // filter 버튼 처리
  const handleFilter = (value: 'all' | 'true' | 'false') => {
  setFilter(value)

  if (value === 'all') {
    fetchTodos()
  } else {
    fetchTodos(value)
  }
}

  // todo 등록
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
    //fetchTodos();
    handleFilter('all');
  }, []);

  // todo 완료여부 수정
  async function toggleTodo(id:number){
    if (!id) return;

    // 완료여부 낙관적 업데이트 처리
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )

    await fetch('http://localhost:3000/todo/'+id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

  };

  // todo 삭제
  async function removeTodo(id:number){
    if (!id) return;

    await fetch('http://localhost:3000/todo/'+id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    fetchTodos();
  }


  // 페이지네이션 개발
  // 회원가입, 로그인(JWT활용) 개발

  return (
    <div>
      <div className="nv-bar">
        <h1 style={{fontWeight:'bold', fontSize:'larger'}}>TODO APP</h1>
        <input type="text" id="searchWord" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} placeholder="검색어를 입력해주세요." />
        <button id="searchBtn" onClick={()=>fetchTodos(filter, searchWord)}>검색</button>
      </div>
      

      <input type="text" id="todoInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일 입력"
      />
      <button id="addTodoBtn" onClick={addTodo}>추가</button>

      <div style={{padding:'0 10px',display:'flex'}}>
        <button className={`completed-filter ${filter === 'all' ? 'active' : ''}`} onClick={()=>handleFilter('all')}>전체</button>
        <button className={`completed-filter ${filter === 'true' ? 'active' : ''}`} onClick={()=>handleFilter('true')}>완료</button>
        <button className={`completed-filter ${filter === 'false' ? 'active' : ''}`} onClick={()=>handleFilter('false')}>미완료</button>
      </div>

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