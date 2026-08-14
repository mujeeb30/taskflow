import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';
import { api } from './services/api';

export default function App() {
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [columnStats, setColumnStats] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultModalColumnId, setDefaultModalColumnId] = useState(1);

  // Fetch full board hierarchy
  const loadBoardData = useCallback(async () => {
    try {
      const data = await api.getBoard(1);
      setBoard(data);
      setColumns(data.columns || []);
      
      // Flatten all tasks from columns for local filtering
      const allTasks = (data.columns || []).flatMap(col => col.tasks || []);
      setTasks(allTasks);

      // Fetch Required Query 1 results for header stats
      const stats = await api.getTasksPerColumn(1);
      setColumnStats(stats);
    } catch (err) {
      setErrorMessage(`Failed to load board data: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  // Compute filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPriority && matchesSearch;
  });

  // Task Creation Handler
  const handleCreateTask = async (taskData) => {
    try {
      await api.createTask(taskData);
      setIsModalOpen(false);
      setEditingTask(null);
      await loadBoardData();
    } catch (err) {
      setErrorMessage(`Task creation failed: ${err.message}`);
    }
  };

  // Task Update Handler
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    try {
      await api.updateTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority
      });
      setIsModalOpen(false);
      setEditingTask(null);
      await loadBoardData();
    } catch (err) {
      setErrorMessage(`Failed to update task: ${err.message}`);
    }
  };

  // Task Movement Handler
  const handleMoveTask = async (taskId, targetColumnId) => {
    try {
      // Optimistic update
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === taskId ? { ...t, column_id: targetColumnId } : t
      ));
      
      await api.moveTask(taskId, targetColumnId);
      await loadBoardData();
    } catch (err) {
      setErrorMessage(`Failed to move task: ${err.message}`);
      await loadBoardData();
    }
  };

  // Task Deletion Handler
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      await api.deleteTask(taskId);
      await loadBoardData();
    } catch (err) {
      setErrorMessage(`Failed to delete task: ${err.message}`);
      await loadBoardData();
    }
  };

  const handleOpenCreateModal = (columnId = 1) => {
    setEditingTask(null);
    setDefaultModalColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onOpenCreateModal={handleOpenCreateModal}
        totalTasks={filteredTasks.length}
        columnStats={columnStats}
      />

      <Board
        columns={columns}
        tasks={filteredTasks}
        onEditTask={handleOpenEditModal}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
        onAddTaskInColumn={handleOpenCreateModal}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialTask={editingTask}
        columns={columns}
        defaultColumnId={defaultModalColumnId}
      />

      <Toast 
        message={errorMessage} 
        onClose={() => setErrorMessage('')} 
      />
    </div>
  );
}
