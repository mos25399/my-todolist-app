import React, { useState, useEffect } from "react";

const TodoPage = () => {
  // --- 狀態管理 (State Management) ---

  // 待辦事項列表的 state，初始值嘗試從 Local Storage 讀取
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // 新增事項的輸入框內容 state
  const [newTodo, setNewTodo] = useState("");

  // --- 副作用 (Side Effect) ---

  // 這個 useEffect 會在 `todos` 陣列發生變化時觸發
  useEffect(() => {
    // 將最新的 todos 陣列轉換為 JSON 字串，並存入 Local Storage
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]); // 依賴項：只有當 todos 改變時才執行

  // --- 事件處理函式 (Event Handlers) ---

  // 處理表單提交（新增事項）
  const handleAddTodo = (e) => {
    e.preventDefault(); // 防止表單提交時頁面重新整理
    if (!newTodo.trim()) return; // 如果輸入是空白，則不執行任何動作

    // 建立一個新的 todo 物件
    const newTodoItem = {
      id: Date.now(), // 使用當前時間戳作為唯一的 ID
      text: newTodo,
      completed: false, // 新增的事項預設為未完成
    };

    // 更新 todos 狀態，將新事項加入到陣列最前面
    setTodos([newTodoItem, ...todos]);
    setNewTodo(""); // 清空輸入框
  };

  // 處理切換完成狀態
  const handleToggleComplete = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  // 處理刪除事項
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // --- JSX 渲染 ---
  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <h1 className="text-center mb-4">我的待辦清單</h1>

      {/* 新增事項的表單 */}
      <form onSubmit={handleAddTodo} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="新增一個待辦事項..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary flex-shrink-0">
          新增
        </button>
      </form>

      {/* 待辦事項列表 */}
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo.id} className={`list-group-item d-flex justify-content-between align-items-center`}>
            <span
              onClick={() => handleToggleComplete(todo.id)}
              // --- 在這裡使用我們的新 class ---
              className={todo.completed ? "todo-item-completed" : ""}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
                flexGrow: 1,
              }}
            >
              {todo.text}
            </span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTodo(todo.id)}>
              <i className="bi bi-trash-fill"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
