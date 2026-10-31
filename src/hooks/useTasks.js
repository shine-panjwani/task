import { useState, useEffect, useCallback } from 'react';
import { loadTasks, saveTasks, createId, STORAGE_KEY } from '../utils/taskHelpers';

export default function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === STORAGE_KEY) setTasks(loadTasks()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addTask = useCallback((data) => {
    const task = { id: createId(), ...data, status: 'todo', createdAt: new Date().toISOString() };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id && t.status !== status ? { ...t, status } : t)));
  }, []);

  const getByStatus = useCallback((list, status) => list.filter((t) => t.status === status), []);

  return { tasks, addTask, updateTask, deleteTask, moveTask, getByStatus };
}
