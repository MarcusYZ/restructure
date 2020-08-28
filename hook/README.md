#### 1. useContext 

允许数据跨越组件层级传递。

contextType简化了这个操作，但是在一个组件中也只能指向一个。

在函数组件中依然可以使用 context，但是不能使用 useContext

有了useContext 解决了函数不能有Context的问题，也解决了 contextType 只能指向一个的问题

#### 2. useMemo

当传入属性不不改变时就不会触发重渲染。

useMemo 定义了一段函数逻辑是否重复执行。 同样是判断属性是否发生改变来 决定是否重复执行。

#### 3. useCallBack

#### 4. useRef

有两种功能，
1 是获取Dom节点和组件的句柄

2 渲染周期之间共享数据的存储 

#### 5. useEffect

叫做副作用机制，代替钩子函数在特定的生命周期执行特定行为。

会在Mount之后 Update之后 Unmount之前



