const BASE_URL = '/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || `HTTP error! Status: ${response.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Fetch full board with columns and tasks
  async getBoard(boardId = 1) {
    const res = await fetch(`${BASE_URL}/boards/${boardId}`);
    return handleResponse(res);
  },

  // Fetch tasks per column (Exposes Required Query 1)
  async getTasksPerColumn(boardId = 1) {
    const res = await fetch(`${BASE_URL}/columns/tasks-per-column?board_id=${boardId}`);
    return handleResponse(res);
  },

  // Fetch filtered tasks by priority/search
  async getFilteredTasks({ priority, search, boardId = 1 }) {
    const params = new URLSearchParams();
    if (priority && priority !== 'All') params.append('priority', priority);
    if (search) params.append('search', search);
    params.append('board_id', boardId);

    const res = await fetch(`${BASE_URL}/tasks?${params.toString()}`);
    return handleResponse(res);
  },

  // Fetch tasks by priority ordered newest first (Exposes Required Query 2)
  async getTasksByPriority(priority) {
    const res = await fetch(`${BASE_URL}/tasks/priority/${priority}`);
    return handleResponse(res);
  },

  // Create new task
  async createTask(taskData) {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  // Update task
  async updateTask(id, taskData) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  // Move task to a different column
  async moveTask(id, column_id, position = null) {
    const res = await fetch(`${BASE_URL}/tasks/${id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column_id, position })
    });
    return handleResponse(res);
  },

  // Delete task
  async deleteTask(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};
