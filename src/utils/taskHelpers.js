export const STORAGE_KEY = 'kanban.tasks.v1';
export const STATUSES = [
  { id: 'todo', label: 'To Do', empty: 'Nothing waiting. Add a task to get started.' },
  { id: 'inprogress', label: 'In Progress', empty: 'Drag a task here when you start working on it.' },
  { id: 'completed', label: 'Completed', empty: 'Finished tasks land here.' },
];
export const PRIORITIES = ['Low', 'Medium', 'High'];
const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

export const createId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const isOverdue = (task) => task.status !== 'completed' && task.dueDate < todayISO();

export const formatDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const loadTasks = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { /* storage full or blocked */ }
};

export const validateTask = (v) => {
  const e = {};
  if (!v.title.trim()) e.title = 'Enter a title.';
  if (!v.description.trim()) e.description = 'Enter a description.';
  if (!PRIORITIES.includes(v.priority)) e.priority = 'Choose a priority.';
  if (!v.dueDate) e.dueDate = 'Choose a due date.';
  return e;
};

export const filterTasks = (tasks, { query, priority, sort }) => {
  const q = query.trim().toLowerCase();
  const out = tasks.filter(
    (t) => (!q || t.title.toLowerCase().includes(q)) && (priority === 'All' || t.priority === priority)
  );
  if (sort === 'due') out.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  else if (sort === 'priority') out.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);
  return out;
};
