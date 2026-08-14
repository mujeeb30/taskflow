import React from 'react';
import { Search, Plus, Filter, BarChart2 } from 'lucide-react';

export default function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  priorityFilter, 
  setPriorityFilter, 
  onOpenCreateModal,
  totalTasks,
  columnStats
}) {
  return (
    <div className="control-bar">
      <div className="search-filter-group">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="select-field" 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="stats-summary">
          <div className="stat-chip">
            <BarChart2 size={14} />
            Total: <strong>{totalTasks}</strong>
          </div>
          {columnStats && columnStats.map(col => (
            <div className="stat-chip" key={col.column_id}>
              {col.column_name}: <strong>{col.task_count}</strong>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => onOpenCreateModal()}>
          <Plus size={18} />
          New Task
        </button>
      </div>
    </div>
  );
}
