# 📋 TaskFlow — Easy-to-Understand Full-Stack Task Board

TaskFlow is a simple, lightweight task management app (like Trello). You can create tasks, edit them, delete them, filter by priority, search by title, and move tasks between columns using **drag-and-drop** or a **dropdown menu**.

All changes are saved to a real **SQLite database** on your machine.

---

## 📁 Simple Folder Structure Breakdown

The project is split into two main parts: **Backend (`server/`)** and **Frontend (`client/`)**.

```
taskflow/
├── server/                    # Everything related to Backend API & Database
│   ├── config/
│   │   └── database.js        # Opens connection to SQLite database
│   ├── db/
│   ├── schema.sql             # SQL code that creates tables (Boards, Columns, Tasks)
│   ├── seed.sql               # Default sample data to start with
│   └── initDb.js              # Script that runs schema.sql & seed.sql
│
│   ├── models/                # [M] MODEL: Talks directly to Database using SQL queries
│   │   ├── boardModel.js      # Gets full board with columns and tasks
│   │   ├── columnModel.js     # Gets columns and counts tasks per column
│   │   └── taskModel.js       # Creates, updates, moves, deletes, and filters tasks
│   │
│   ├── controllers/           # [C] CONTROLLER: Handles requests, checks inputs, sends JSON responses
│   │   ├── boardController.js # Handles GET /api/boards
│   │   ├── columnController.js# Handles GET /api/columns and GET /api/columns/tasks-per-column
│   │   └── taskController.js  # Handles create, update, move, delete task requests
│   │
│   ├── routes/                # ROUTING: Connects URL paths to Controllers
│   │   ├── boardRoutes.js     # Map /api/boards URLs
│   │   ├── columnRoutes.js    # Map /api/columns URLs
│   │   └── taskRoutes.js      # Map /api/tasks URLs
│   │
│   ├── middlewares/
│   │   ├── validation.js      # Rejects requests if task title is empty (400 Bad Request)
│   │   └── errorHandler.js    # Catches errors cleanly
│   │
│   ├── tests/                 # AUTOMATED TESTS
│   │   ├── task.test.js       # Tests validation rules and task movement
│   │   └── db.test.js         # Tests raw SQL queries directly
│   │
│   ├── app.js                 # Sets up Express app & links routes
│   └── server.js              # Starts the server on port 5001
│
└── client/                    # Frontend React User Interface
    └── src/
        ├── components/
        │   ├── Header.jsx     # Top navbar header
        │   ├── FilterBar.jsx  # Search bar, priority filter dropdown, task count stats
        │   ├── Board.jsx      # Holds the columns
        │   ├── Column.jsx     # Renders column header & drop zone for drag-and-drop
        │   ├── TaskCard.jsx   # Individual task card (drag handle, priority badge, edit/delete)
        │   ├── TaskModal.jsx  # Form modal to create or edit a task
        │   └── Toast.jsx      # Red popup box if an error happens
        ├── services/
        │   └── api.js         # Makes fetch requests to http://localhost:5001/api
        ├── styles/
        │   └── index.css      # Custom styling & glassmorphism theme
        ├── App.jsx            # Main React component
        └── main.jsx           # React app entry point
```

---

## 🔄 How Request Flow Works (MVC Step-by-Step)

Here is a clear example of what happens when a user creates a new task:

```
[User Clicks "Create Task"] 
           │
           ▼
1. React Form (`TaskModal.jsx`) 
   Checks that the title is not empty on the screen.
           │ Sends POST request to /api/tasks
           ▼
2. Express Route (`taskRoutes.js`)
   Receives POST /api/tasks and sends it to `validateTaskCreation` middleware.
           │
           ▼
3. Validation Middleware (`validation.js`)
   If title is missing or empty, stops immediately and returns 400 Bad Request:
   {"error": "Task title is required and cannot be empty."}
           │
           ▼
4. Task Controller (`taskController.js`)
   Receives valid title, description, priority, and column_id from request body.
           │
           ▼
5. Task Model (`taskModel.js`)
   Runs raw SQL `INSERT INTO tasks ...` and saves it into `taskflow.db`.
           │
           ▼
6. Response sent back to React UI
   React reloads the board data and shows the new task on the screen.
```

---

## 🗄️ Database Tables & SQL Queries

### 1. Database Schema (`server/db/schema.sql`)
- **`boards`**: `id`, `name`, `created_at`
- **`columns`**: `id`, `board_id` (links to board), `name`, `position`
- **`tasks`**: `id`, `column_id` (links to column), `title` (cannot be empty), `description`, `priority` (Low / Medium / High), `position`, `created_at`

---

### 2. The Two Required Database Queries (Section 2.5)

#### 📊 Query 1: Count tasks per column (`ColumnModel.getTasksPerColumn`)
This query counts how many tasks are inside each column on a board:
```sql
SELECT 
  c.id AS column_id, 
  c.name AS column_name, 
  c.position, 
  COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t ON c.id = t.column_id
WHERE c.board_id = 1
GROUP BY c.id, c.name, c.position
ORDER BY c.position ASC;
```

#### 🎯 Query 2: Filter tasks by priority, newest first (`TaskModel.getTasksByPriority`)
This query fetches tasks matching a specific priority (e.g. 'High') ordered by creation date newest first:
```sql
SELECT 
  t.id, 
  t.title, 
  t.description, 
  t.priority, 
  t.column_id, 
  c.name AS column_name, 
  t.created_at
FROM tasks t
JOIN columns c ON t.column_id = c.id
WHERE t.priority = 'High'
ORDER BY t.created_at DESC;
```

---

## 🚀 How to Run the Project (Step-by-Step)

### Prerequisites
Make sure you have **Node.js** installed on your computer.

### Step 1: Install Dependencies
Open terminal in the project folder and run:
```bash
npm run install:all
```
*(This installs packages for both backend and frontend automatically)*.

### Step 2: Initialize Database
Run:
```bash
npm run db:init
```
*(This creates the `taskflow.db` SQLite file and fills it with sample seed data)*.

### Step 3: Start Application
Run:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your web browser.

---

## 🧪 Running Tests

To run the automated test suite:
```bash
npm test
```

### What the tests check:
1. **Empty Title Validation**: Confirms that submitting a task without a title fails with error code 400.
2. **Moving Tasks**: Confirms that moving a task to another column updates its column ID in the database.
3. **Database Queries**: Directly runs `getTasksPerColumn` and `getTasksByPriority` against the database to confirm SQL logic is correct.

---

## 📝 Answers to Submission Questions

1. **Decisions & Assumptions**:
   - Built with support for multiple boards, defaulting to `board_id = 1` for a single workspace view.
   - Added both **Drag-and-Drop** and a **Quick Dropdown Select** on each card so moving tasks works easily on mobile phones and touchscreens too.
2. **What would be added with more time**:
   - User assignment avatars on task cards.
   - History activity log showing who moved what task and when.
3. **Time Spent**: ~2.5 hours total.
4. **Interesting Insight**: Working with raw SQLite SQL statements (`better-sqlite3`) was much simpler and faster than using heavy ORM libraries like Prisma or TypeORM.
