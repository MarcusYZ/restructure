import React, { useCallback, useState, useRef } from 'react';
import './App.css'
let idSeq = Date.now();

function Control(props) {
  const { addTodo } = props; 
  const inputRef = useRef();
  const onSubmit = (e) => {
    e.preventDefault();
    const newText = inputRef.current.value.trim(); // trim() 清除value的空白
    if (newText.length === 0) {
      return;
    } 
    addTodo({
      id: ++idSeq,
      text: newText,
      complete: false,
    });
    inputRef.current.value = ''
    onSubmit()
  }
  return (
    <div className="control">
      <h1>TODOS</h1>
      <form action="" onSubmit={onSubmit}>
        <input type="text" className='new-todo' placeholder="请输入内容" ref={inputRef}/>
      </form>
    </div>
  )
}

function Todos() {
  return (
    <>
    </>
  )
}
function TodoList () {
  const [todos, setTodos] = useState([]); // 这么写给函数赋予了类组件的能力，有数据了
  const addTodo = (todo) => {
    setTodos(() => [...todos, todo]); 
  };

  // 把一个回调函数
  const removeTodo = useCallback((id) => { // 把内函数
    setTodos(todos => todos.filter(todo => {
      return todo.id !== id;
    }))
  }, [])
  const toggleTodo = useCallback(
    (id) => {
      setTodos(todos => todos.map(todo => {
        return todo.id === id
          ? {
            ...todo,
            complete: !todo.complete,
          }
          : todo
      }))
    }, [])
  return(
    <div className="todo-list">
      <Control addTodo={addTodo} />
      <Todos removeTodo={removeTodo} toggleTodo={toggleTodo}/>
    </div>
  )
}

export default TodoList;
