import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSubmit, initialTask = null, columns = [], defaultColumnId = 1 }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [columnId, setColumnId] = useState(defaultColumnId);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'Medium');
      setColumnId(initialTask.column_id || defaultColumnId);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setColumnId(defaultColumnId);
    }
    setValidationError('');
  }, [initialTask, defaultColumnId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || title.trim() === '') {
      setValidationError('Title is required and cannot be empty.');
      return;
    }

    setValidationError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      column_id: Number(columnId)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {validationError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                ⚠️ {validationError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Task Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Implement authentication middleware"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError) setValidationError('');
                }}
                autoFocus
              />
            </div>

            {!initialTask && (
              <div className="form-group">
                <label className="form-label">Column</label>
                <select 
                  className="select-field"
                  value={columnId}
                  onChange={(e) => setColumnId(Number(e.target.value))}
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="select-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="textarea-field"
                placeholder="Add optional details or context for this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
