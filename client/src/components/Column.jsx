import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus, Inbox } from 'lucide-react';

export default function Column({ column, tasks, columns, onEditTask, onDeleteTask, onMoveTask, onAddTaskInColumn }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      const taskId = Number(taskIdStr);
      onMoveTask(taskId, column.id);
    }
  };

  return (
    <div 
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title-group">
          <h3 className="column-title">{column.name}</h3>
          <span className="task-count-badge">{tasks.length}</span>
        </div>
        <button 
          className="icon-btn" 
          title={`Add task to ${column.name}`}
          onClick={() => onAddTaskInColumn(column.id)}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="task-list-empty">
            <Inbox size={24} style={{ marginBottom: '6px', opacity: 0.5 }} />
            <span>No tasks in this column</span>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              columns={columns}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
