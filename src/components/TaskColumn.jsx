import { useDroppable } from '@dnd-kit/core';
import { Inbox } from 'lucide-react';
import TaskCard from './TaskCard';

// The entire column (header + body) is the drop target, so dropping anywhere on it works.
export default function TaskColumn({ status, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  return (
    <section ref={setNodeRef} className={`column column-${status.id} ${isOver ? 'column-over' : ''}`}>
      <header className="column-head">
        <h2>{status.label}</h2>
        <span className="count" aria-label={`${tasks.length} tasks`}>{tasks.length}</span>
      </header>
      <div className="column-body">
        {tasks.length === 0 ? (
          <div className="empty"><span className="empty-icon"><Inbox size={22} /></span><p>{status.empty}</p></div>
        ) : (
          tasks.map((t) => <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </div>
    </section>
  );
}
