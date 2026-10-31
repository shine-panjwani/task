import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PRIORITIES, validateTask } from '../utils/taskHelpers';

const EMPTY = { title: '', description: '', priority: '', dueDate: '' };

export default function TaskForm({ task, onSubmit, onClose }) {
  const editing = Boolean(task);
  const [values, setValues] = useState(editing
    ? { title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate }
    : EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateTask(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() });
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-head">
          <h2 id="form-title">{editing ? 'Edit task' : 'Add task'}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>

        <label className="field">
          <span>Title</span>
          <input autoFocus value={values.title} onChange={set('title')} placeholder="e.g. Create login page" aria-invalid={!!errors.title} />
          {errors.title && <em className="err">{errors.title}</em>}
        </label>

        <label className="field">
          <span>Description</span>
          <textarea rows={3} value={values.description} onChange={set('description')} placeholder="What needs to be done?" aria-invalid={!!errors.description} />
          {errors.description && <em className="err">{errors.description}</em>}
        </label>

        <div className="row">
          <label className="field">
            <span>Priority</span>
            <select value={values.priority} onChange={set('priority')} aria-invalid={!!errors.priority}>
              <option value="">Select priority</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.priority && <em className="err">{errors.priority}</em>}
          </label>
          <label className="field">
            <span>Due date</span>
            <input type="date" value={values.dueDate} onChange={set('dueDate')} aria-invalid={!!errors.dueDate} />
            {errors.dueDate && <em className="err">{errors.dueDate}</em>}
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{editing ? 'Save changes' : 'Add task'}</button>
        </div>
      </form>
    </div>
  );
}
