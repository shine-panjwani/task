import { useDraggable } from '@dnd-kit/core';
import { GripVertical, Pencil, Trash2, CalendarDays, AlertTriangle } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/taskHelpers';

// Stops a press on Edit/Delete from being picked up as the start of a drag.
const noDrag = { onMouseDown: (e) => e.stopPropagation(), onTouchStart: (e) => e.stopPropagation() };

export function TaskCardView({ task, onEdit, onDelete, dragging, overlay }) {
  const overdue = isOverdue(task);
  return (
    <article className={`card ${overdue ? 'card-overdue' : ''} ${dragging ? 'card-ghost' : ''} ${overlay ? 'card-overlay' : ''}`}>
      <div className="card-top">
        <span className="handle" aria-hidden="true"><GripVertical size={16} /></span>
        <h3>{task.title}</h3>
        <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
      <p className="card-desc">{task.description}</p>
      <div className="card-foot">
        <span className={`due ${overdue ? 'due-overdue' : ''}`}>
          {overdue ? <AlertTriangle size={14} /> : <CalendarDays size={14} />}
          {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
        </span>
        <span className="actions">
          <button className="icon-btn" aria-label="Edit task" {...noDrag} onClick={() => onEdit?.(task)}><Pencil size={15} /></button>
          <button className="icon-btn icon-danger" aria-label="Delete task" {...noDrag} onClick={() => onDelete?.(task)}><Trash2 size={15} /></button>
        </span>
      </div>
    </article>
  );
}

// The whole card is the drag target: node ref, attributes and listeners all sit on one element.
export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} className="draggable" {...attributes} {...listeners}>
      <TaskCardView task={task} onEdit={onEdit} onDelete={onDelete} dragging={isDragging} />
    </div>
  );
}
