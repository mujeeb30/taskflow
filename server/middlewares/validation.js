export function validateTaskCreation(req, res, next) {
  const { title, column_id, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Task title is required and cannot be empty.'
    });
  }

  if (!column_id || isNaN(Number(column_id))) {
    return res.status(400).json({
      error: 'Valid column_id is required.'
    });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({
      error: 'Priority must be one of: Low, Medium, High.'
    });
  }

  next();
}

export function validateTaskUpdate(req, res, next) {
  const { title, priority } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      error: 'Task title cannot be empty.'
    });
  }

  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({
      error: 'Priority must be one of: Low, Medium, High.'
    });
  }

  next();
}
