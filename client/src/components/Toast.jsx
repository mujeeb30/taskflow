import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <AlertCircle size={18} />
        <span>{message}</span>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: 'auto' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
