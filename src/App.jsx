import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from './components/Navbar';
import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import useTasks from './hooks/useTasks';
import { filterTasks, isOverdue, PRIORITIES } from './utils/taskHelpers';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, getByStatus } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({ query: '', priority: 'All', sort: 'manual' });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const visible = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const overdueCount = tasks.filter(isOverdue).length;
  const done = tasks.filter((t) => t.status === 'completed').length;

  const closeForm = () => { setFormOpen(false); setEditing(null); };
  const handleSubmit = (data) => {
    if (editing) { updateTask(editing.id, data); setToast('Task updated'); }
    else { addTask(data); setToast('Task added'); }
    closeForm();
  };
  const confirmDelete = () => { deleteTask(deleting.id); setDeleting(null); setToast('Task deleted'); };
  const setF = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="app">
      <Navbar total={tasks.length} onAdd={() => setFormOpen(true)} />
      <div className="toolbar">
        <div className="stats">
          <span><b>{tasks.length - done}</b> open</span>
          <span><b>{done}</b> completed</span>
          <span className={overdueCount ? 'stat-warn' : ''}><b>{overdueCount}</b> overdue</span>
        </div>
        <div className="filters">
          <label className="search"><Search size={15} />
            <input type="search" placeholder="Search by title" value={filters.query} onChange={setF('query')} aria-label="Search tasks" />
          </label>
          <select value={filters.priority} onChange={setF('priority')} aria-label="Filter by priority">
            <option value="All">All priorities</option>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={filters.sort} onChange={setF('sort')} aria-label="Sort tasks">
            <option value="manual">Newest first</option>
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <TaskBoard
        tasks={visible} allTasks={tasks} getByStatus={getByStatus}
        onMove={(id, s) => { moveTask(id, s); }}
        onEdit={(t) => { setEditing(t); setFormOpen(true); }}
        onDelete={setDeleting}
      />

      {formOpen && <TaskForm task={editing} onSubmit={handleSubmit} onClose={closeForm} />}
      {deleting && <DeleteConfirmation task={deleting} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
