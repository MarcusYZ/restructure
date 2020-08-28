import React, { useCallback, forwardRef, useState, useRef, useEffect, createContext, useContext, memo, useMemo, useImperativeHandle } from 'react';
import './App.css'
let idSeq = Date.now(); // 作为key

// Context 让我们能够在组件树中，不运用props 就可以进行数据传递。
// 使用context,我们可以避免通过中间元素传递props
// 在过往我们必须使用 Class.Provider, Class.consumer……api完成数据的传递，
// 但是有了useContext之后，大大简化了代码。  如下 168 行我们用 Class.Provider把子组件包裹并 拿到传递数据后，、
// 仅仅需要使用 useContext(Context对象)就可以拿到传递的数据


// 创建一个Context对象
const CountContext = createContext()

// 1、memo可以优化子组件，当传入的数据不发生改变时不触发重渲染
// 要注意的是如果实现中拥有useState 或 useContext 当context发生变化时仍然会触发冲渲染

// 2、useRef的使用有两个场景，一个是拿到DOM节点 或组件实例，一个是返回一个在整个生命周期都保持不变的ref对象。

const Control = memo((props) => {
  // 父组件传递的添加数据的方法
  const { addTodo } = props;
  // 使用 useContext 拿到了 Context组件传递的数据
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
      // 提交后清空
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
  
// 这里看我前一篇 Hooks 的 useImperativeHandle 怎么用？ https://www.jianshu.com/p/bf9f66ac3f9c
const TestRef = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    result: "传输成功"
  }))
})

// 列表
const Todos = memo(
  function Todos(props) {
    const ref = useRef();
    const { todos, toggleTodo, removeTodo } = props;
    
    useEffect(() => {
      console.log(ref.current, "传输成功")
    }, [])
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
      <TestRef ref={ref}/>
      </>
    )
  }
)
  
// 列表项
const TodoItem = forwardRef((props, ref) => {
  const {
    todo: {
      id,
      text,
      complete
    },
    toggleTodo,
    removeTodo,
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
      <span onClick={onRemove}>x</span>
    </li>
  )
})  

const STON_KEY = '_$-todos_';

// 在下面的代码中，我们声明了一个叫 count 的 state 变量，然后把它的初始值设置为 0。
// React 会在重复渲染时记住它当前的值，并且提供最新的值给我们的函数。我们可以通过调用 setCount 来更新当前的 count。

function TodoList () {
  const [todos, setTodos] = useState([]); // 记录初始化
  const [name] = useState("石小阳") // 名称初始化
  const [count, setCount] = useState(0) // 点赞数初始化
  // 新建记录
  const addTodo = (todo) => {
    setTodos(() => [...todos, todo]); 
  };

  // 移除记录
  const removeTodo = useCallback((id) => { 
    setTodos(todos => todos.filter(todo => {
      return todo.id !== id;
    }))
  }, [])

  // 点击完成/不完成
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

    // 叫做副作用机制，代替钩子函数在特定的生命周期执行特定行为。
    // 在组件每次渲染之后调用，并且可以根据自定义的状态决定调用或者不调用。

    useEffect(() => {
      // 读取记录
      const todos = JSON.parse(localStorage.getItem(STON_KEY))
      setTodos(todos);
    }, [])

    useEffect(() => {
      // 每次重新渲染都把数据保存
      localStorage.setItem(STON_KEY,  JSON.stringify(todos));  
    }, [todos]);

    // const onClick = () => {
    //   console.log('Click')
    // }

    // 使用上面的写法，185 行中每次传递到组件中都会发生一次渲染
    
    // const onClick = useMemo(() => {
    //   return  () => {
    //     console.log('Click')
    //   }
    // }, [])
    // 如果返回的函数可以使用 useCallback 省略顶层函数

    // useMemo(() => fn)
    const onClick = useCallback(() => {
      console.log('click')
    }, [])
    // useCallback 如果产生的函数不变的话就会直接抛弃

    return(
    <div className="todo-list">
      <CountContext.Provider value={name}>
        <button type="button" onClick={() => {setCount(count + 1)}}>点赞</button> {count}
        <Control addTodo={addTodo} />
      </CountContext.Provider>
      {/* 每次渲染onClick 的句柄发生变化 */}
      <Todos todos={todos} onClick={onClick} removeTodo={removeTodo} toggleTodo={toggleTodo}/>
    </div>
  )
}

export default TodoList;
