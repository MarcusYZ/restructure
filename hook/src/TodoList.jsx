import React, { useCallback, useState, useRef, useEffect, createContext, useContext, useMemo, memo } from 'react';
import './App.css'
let idSeq = Date.now();

const CountContext = createContext()

const Control = memo(
  function Control(props) {
    const { addTodo } = props;
    const name = useContext(CountContext)
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
    }
    return (
      <div className="control">
        <h1>TODOS</h1> 
        <span>{name}</span>
        <form action="" onSubmit={onSubmit}>
          <input type="text" className='new-todo' placeholder="请输入内容" ref={inputRef}/>
        </form>
      </div>
    )
  }
) 
  
const TodoItem = 
  function TodoItem(props) {
    const {
      todo: {
        id,
        text,
        complete
      },
      toggleTodo,
      removeTodo
    } = props
    const onChange = () => {
      toggleTodo(id);
    };
    const onRemove = () => {
      removeTodo(id);
    };
    return (
      <li className="todo-item">
        <input type="checkbox" onChange={onChange} checked={complete}/>
        <label className={complete ? 'complete': null}>{text}</label>
        <button onClick={onRemove}>x</button>
      </li>
    )
  }

const Todos = memo(
  function Todos(props) {
    const { todos, toggleTodo, removeTodo, onClick } = props;
    console.log(onClick);
    return (
      <>
      <ul>
        { 
          todos.map( todo => {
            return (<TodoItem 
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              removeTodo={removeTodo}
            />)
          })
        }
      </ul>
      </>
    )
  }
)
  

const LS_KEY = '_$-todos_';
function TodoList () {
  const [todos, setTodos] = useState([]); // 这么写给函数赋予了类组件的能力，有数据了
  const [name] = useState("石小阳")
  const [count, setCount] = useState(0)
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

    useEffect(() => {
      const todos = JSON.parse(localStorage.getItem(LS_KEY))
      setTodos(todos);
    }, [])

    useEffect(() => {
      localStorage.setItem(LS_KEY,  JSON.stringify(todos));  
    }, [todos]);

    const onClick = () => {
      console.log('Click')
    }
  return(
    <div className="todo-list">
      <CountContext.Provider value={name}>
        <button type="button" onClick={() => {setCount(count + 1)}}>点赞</button>
        <Control addTodo={addTodo} />
      </CountContext.Provider>
      <Todos todos={todos} onClick={onClick} removeTodo={removeTodo} toggleTodo={toggleTodo}/>
    </div>
  )
}

export default TodoList;
