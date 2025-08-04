# React Todo List App (待辦事項應用)

**[➡️ Live Demo - 線上預覽網站](https://mos25399.github.io/my-todolist-app/)**

這是一個使用 React 和 Vite 從零到一建立的經典待辦事項應用程式。此專案主要用於展示對 React 核心 Hooks (`useState`, `useEffect`) 的熟練運用，以及實現資料本地端持久化的能力。

---

## ✨ 核心功能 (Features)

* **新增待辦事項**：使用者可以在輸入框中新增待辦事項。
* **標記完成/未完成**：點擊事項文字，可以在「已完成」（帶有刪除線）和「未完成」狀態之間切換。
* **刪除待辦事項**：點擊垃圾桶圖示，可以將該事項從列表中移除。
* **本地端儲存**：所有待辦事項都會自動儲存在瀏覽器的 Local Storage 中，即使關閉或重新整理頁面，資料依然會被保留。

---

## 🛠️ 使用技術 (Technology Stack)

* **核心框架**: `React`
* **狀態管理**: `React Hooks` (`useState`, `useEffect`)
* **建置工具**: `Vite`
* **樣式**: `Bootstrap 5`, `SCSS`, `Bootstrap Icons`
* **資料儲存**: `Browser Local Storage`

---

## 🚀 如何在本地端運行 (Getting Started)

1.  **Clone 專案到本地**
    ```bash
    git clone [https://github.com/mos25399/my-todolist-app.git](https://github.com/mos25399/my-todolist-app.git)
    ```

2.  **進入專案目錄**
    ```bash
    cd my-todolist-app
    ```

3.  **安裝依賴套件**
    ```bash
    npm install
    ```

4.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```
之後，即可在 `http://localhost:5173` (或終端機顯示的其他埠號) 看到運行的應用程式。