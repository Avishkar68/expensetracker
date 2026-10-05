import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type !== 'error';

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${isSuccess ? 'success' : 'error'}`}>
        <div className="toast-icon">
          {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        </div>
        <span>{toast.message}</span>
        <button
          onClick={onDismiss}
          style={{
            marginLeft: 'auto',
            color: 'inherit',
            opacity: 0.7,
            display: 'flex',
            padding: 2,
          }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
