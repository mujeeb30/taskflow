# 📋 TaskFlow — Full-Stack Kanban Application

TaskFlow is a lightweight, full-stack Kanban task management board designed for small teams. Built with a clean **Model-View-Controller (MVC)** backend architecture in Node.js/Express, a raw SQL SQLite database layer, automated test suite (Jest + Supertest), and a modern React frontend UI featuring drag-and-drop task movement, priority filtering, and real-time title search.

---

## 🔗 Repository & Submission Info

- **Repository**: [https://github.com/mujeeb30/taskflow.git](https://github.com/mujeeb30/taskflow.git)
- **Tech Stack**:
  - **Frontend**: React 18, Vite, Lucide Icons, Modern CSS (Glassmorphism theme)
  - **Backend**: Node.js, Express (Pure MVC architecture)
  - **Database**: SQLite3 (`better-sqlite3` driver with foreign key constraints)
  - **Testing**: Jest, Supertest

---

## ⚡ Quick Start (Setup Instructions from Fresh Clone)

Follow these steps to run TaskFlow locally from a fresh checkout:

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step 1: Clone Repository & Install Dependencies
```bash
git clone <your-repository-url>
cd taskflow

# Install dependencies for both root, server, and client apps
npm run install:all
```

### Step 2: Initialize & Seed Database
```bash
npm run db:init
```
*This executes `server/db/schema.sql` and `server/db/seed.sql` to generate the local SQLite database file `server/db/taskflow.db`.*

### Step 3: Start Application Locally
```bash
# Runs backend API (Port 5001) and React dev server (Port 3000) concurrently
npm run dev
```
Open **`http://localhost:3000`** in your browser.

*(Alternatively, you can also run `npm --prefix server run start` to serve the unified production build at **`http://localhost:5001`**).*

---

## 🧪 Running Automated Backend Tests

TaskFlow includes automated backend integration and unit tests covering validation rules, task movement, and raw database queries:

```bash
# Run Jest test suite
npm test
```

### Automated Tests Overview (`server/tests/`):
1. **Title Validation Test** ([`task.test.js`](file:///Users/shaikmujeeb/.gemini/antigravity/scratch/taskflow/server/tests/task.test.js)): Verifies `POST /api/tasks` with an empty or whitespace title is rejected with HTTP `400 Bad Request`.
2. **Task Movement Test** ([`task.test.js`](file:///Users/shaikmujeeb/.gemini/antigravity/scratch/taskflow/server/tests/task.test.js)): Verifies `PATCH /api/tasks/:id/move` updates column and status correctly in the database.
3. **Direct Database Layer Test** ([`db.test.js`](file:///Users/shaikmujeeb/.gemini/antigravity/scratch/taskflow/server/tests/db.test.js)): Verifies raw SQL queries (`getTasksPerColumn` and `getTasksByPriority`) directly against seeded database rows.

---

## 🏛️ Backend Architecture (Model-View-Controller)

TaskFlow uses a strict **MVC Layered Architecture**:

```
taskflow/
├── server/
│   ├── config/
│   │   └── database.js          # SQLite connection manager & query execution wrapper
│   ├── db/
│   │   ├── schema.sql           # CREATE TABLE definitions, keys, and indexes
│   │   ├── seed.sql             # Initial board, column, and task seed data
│   │   └── initDb.js            # Database creation & seeding script
│   ├── models/                  # [M] MODEL LAYER (Raw SQL Queries)
│   │   ├── boardModel.js        # Board hierarchy queries
│   │   ├── columnModel.js       # Column queries & tasks-per-column aggregation
│   │   └── taskModel.js         # Task CRUD, task movement & priority queries
│   ├── controllers/             # [C] CONTROLLER LAYER (Request Logic & Handlers)
│   │   ├── boardController.js   # Board endpoint request handler
│   │   ├── columnController.js  # Column & task count handler
│   │   └── taskController.js    # Task management handlers
│   ├── routes/                  # ROUTING LAYER (Express REST Routers)
│   │   ├── boardRoutes.js       # /api/boards routes
│   │   ├── columnRoutes.js      # /api/columns routes
│   │   └── taskRoutes.js         # /api/tasks routes
│   ├── middlewares/
│   │   ├── validation.js        # Payload & non-empty title validation
│   │   └── errorHandler.js      # Global error handler
│   └── tests/                   # AUTOMATED TEST SUITE
│       ├── task.test.js         # API integration & validation tests
│       └── db.test.js           # Direct SQL database model layer tests
```

---

## 🗄️ Database Schema & Required Queries

### Relational Schema (`server/db/schema.sql`)
- **`boards`**: `id` (PRIMARY KEY), `name` (NOT NULL), `created_at`.
- **`columns`**: `id` (PRIMARY KEY), `board_id` (FOREIGN KEY $\rightarrow$ `boards.id`), `name` (NOT NULL), `position`.
- **`tasks`**: `id` (PRIMARY KEY), `column_id` (FOREIGN KEY $\rightarrow$ `columns.id`), `title` (NOT NULL), `description`, `priority` (CHECK constraint: `'Low'`, `'Medium'`, `'High'`), `position`, `created_at`.

### Required Non-Trivial SQL Queries (Section 2.5)

#### Query 1: Tasks Count Per Column (`ColumnModel.getTasksPerColumn`)
```sql
SELECT 
  c.id AS column_id, 
  c.name AS column_name, 
  c.position, 
  COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t ON c.id = t.column_id
WHERE c.board_id = ?
GROUP BY c.id, c.name, c.position
ORDER BY c.position ASC;
```

#### Query 2: Tasks by Priority Ordered Newest First (`TaskModel.getTasksByPriority`)
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
WHERE t.priority = ?
ORDER BY t.created_at DESC;
```

---

## 💭 Project Reflection & Submission Q&A

### 1. Decisions & Assumptions
- **Single Workspace Context**: Designed the relational schema (`boards` $\rightarrow$ `columns` $\rightarrow$ `tasks`) with full multi-board capacity, defaulting to `board_id = 1` for a single team workspace.
- **Dual Column Movement**: Implemented both native **HTML5 Drag-and-Drop** and a **Quick Dropdown Control** on each task card for maximum accessibility across mobile and desktop devices.
- **Database Driver**: Used `better-sqlite3` for zero-config file persistence without requiring external database server daemons.

### 2. Future Improvements
- **Sub-task Checklists**: Allow adding checkable sub-items within task cards.
- **Activity Log**: Maintain a historical log of task status transitions and edits.
- **WebSockets / SSE**: Push real-time updates across multiple open browser tabs.

### 3. Roughly How Long You Spent
- **Total Time**: ~2.5 hours (architecture planning, database design, backend MVC implementation, unit test writing, and React UI development).

### 4. One Thing Learned / Found Interesting
- Using `better-sqlite3`'s synchronous prepared statements made writing atomic transactions and custom SQL aggregation queries (`LEFT JOIN ... GROUP BY`) extremely fast and clean without the bloat of heavy ORMs.
