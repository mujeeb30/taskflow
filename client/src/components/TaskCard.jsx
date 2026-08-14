import React from 'react';
import { Edit2, Trash2, GripVertical, Calendar } from 'lucide-react';

export default function TaskCard({ task, columns, onEdit, onDelete, onMove }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab', marginTop: '2px' }} />
          <h4 className="task-title">{task.title}</h4>
        </div>
        <div className="card-actions">
          <button 
            className="icon-btn" 
            title="Edit Task"
            onClick={() => onEdit(task)}
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="icon-btn danger" 
            title="Delete Task"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`priority-tag ${task.priority}`}>
            {task.priority}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Calendar size={12} />
            {formatDate(task.created_at)}
          </span>
        </div>

        {/* Quick Dropdown Move Control */}
        <select 
          className="quick-move-select"
          value={task.column_id}
          onChange={(e) => onMove(task.id, Number(e.target.value))}
          title="Move to another column"
        >
          {columns.map(col => (
            <option key={col.id} value={col.id}>
              {col.id === task.column_id ? `📍 ${col.name}` : `Move to ${col.name}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
