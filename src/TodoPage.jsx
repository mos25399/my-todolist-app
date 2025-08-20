import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // 引入 DatePicker
import { format } from "date-fns"; // 引入 date-fns 的 format
import "react-datepicker/dist/react-datepicker.css"; // 引入 DatePicker 的樣式

// 引入 dnd-kit 的核心元件
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 將列表項目 (li) 抽離成一個獨立的可拖曳元件
const SortableTodoItem = ({ todo, onToggleComplete, onDelete }) => {
  // useSortable is a hook that makes your component draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef} // 將 DOM 節點與 dnd-kit 連結
      style={style}
      className={`list-group-item d-flex justify-content-between align-items-center ${
        todo.completed ? "list-group-item-success text-muted" : ""
      }`}
    >
      <div onClick={() => onToggleComplete(todo.id)} style={{ cursor: "pointer", flexGrow: 1 }}>
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</span>
        {todo.dueDate && (
          <div className="text-muted small mt-1">
            <i className="bi bi-calendar-event me-1"></i>
            到期日: {format(new Date(todo.dueDate), "yyyy-MM-dd")}
          </div>
        )}
      </div>

      {/* 拖曳把手和刪除按鈕 */}
      <div className="d-flex align-items-center">
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(todo.id);
          }}
        >
          <i className="bi bi-trash-fill"></i>
        </button>
        {/* 加上拖曳把手圖示，並綁定 listeners */}
        <span
          {...attributes}
          {...listeners}
          className="ms-2 drag-handle"
          style={{ cursor: "grab", touchAction: "none" }}
        >
          <i className="bi bi-grip-vertical"></i>
        </span>
      </div>
    </li>
  );
};

const TodoPage = () => {
  // --- 狀態管理 (State Management) ---

  // 待辦事項列表的 state，初始值嘗試從 Local Storage 讀取
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // 新增事項的輸入框內容 state
  const [newTodo, setNewTodo] = useState("");

  // 新增一個 state 來管理選擇的到期日
  const [dueDate, setDueDate] = useState(null);
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
      dueDate: dueDate ? dueDate.toISOString() : null, // 將選擇的日期存入 todo 物件
    };

    // 更新 todos 狀態，將新事項加入到陣列最前面
    setTodos([newTodoItem, ...todos]);
    setNewTodo(""); // 清空輸入框
    setDueDate(null); // 清空日期選擇器
  };

  // 處理切換完成狀態
  const handleToggleComplete = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  // 處理刪除事項
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 新增處理拖曳結束的函式
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex); // arrayMove 會回傳一個排序後的新陣列
      });
    }
  };

  // --- JSX 渲染 ---
  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <h1 className="text-center mb-4">我的待辦清單</h1>

      {/* 新增事項的表單 */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="d-flex gap-2">
          {/* 待辦事項輸入框 */}
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="新增一個待辦事項..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          {/* 1. 在這裡加入 DatePicker 元件 */}
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            className="form-control form-control-lg"
            placeholderText="選擇到期日"
            dateFormat="yyyy/MM/dd"
            isClearable // 讓使用者可以清除已選的日期
            wrapperClassName="date-picker-wrapper"
          />
          <button type="submit" className="btn btn-primary btn-lg flex-shrink-0">
            新增
          </button>
        </div>
      </form>

      {/* --- 4. 使用 DndContext 和 SortableContext 包裹列表 --- */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ul className="list-group">
          <SortableContext
            items={todos.map((todo) => todo.id)} // 告訴 SortableContext 哪些項目是可以排序的
            strategy={verticalListSortingStrategy} // 使用垂直列表的排序策略
          >
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
              />
            ))}
          </SortableContext>
        </ul>
      </DndContext>
    </div>
  );
};

export default TodoPage;