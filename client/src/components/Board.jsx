import React from 'react';
import Column from './Column';

export default function Board({ columns, tasks, onEditTask, onDeleteTask, onMoveTask, onAddTaskInColumn }) {
  return (
    <main className="board-container">
      {columns.map(column => {
        const columnTasks = tasks.filter(t => t.column_id === column.id);
        return (
          <Column
            key={column.id}
            column={column}
            tasks={columnTasks}
            columns={columns}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onAddTaskInColumn={onAddTaskInColumn}
          />
        );
      })}
    </main>
  );
}
