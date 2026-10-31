import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmation({ task, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
        <span className="del-icon"><Trash2 size={20} /></span>
        <h2 id="del-title">Delete this task?</h2>
        <p className="muted">“{task.title}” will be removed permanently. This can’t be undone.</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} autoFocus>Keep task</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete task</button>
        </div>
      </div>
    </div>
  );
}
