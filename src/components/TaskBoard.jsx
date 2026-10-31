import { useState } from 'react';
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors,
  pointerWithin, rectIntersection,
} from '@dnd-kit/core';
import TaskColumn from './TaskColumn';
import { TaskCardView } from './TaskCard';
import { STATUSES } from '../utils/taskHelpers';

// Prefer the column under the pointer; fall back to overlap so drops near edges still land.
const collision = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

export default function TaskBoard({ tasks, allTasks, getByStatus, onMove, onEdit, onDelete }) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );
  const active = allTasks.find((t) => t.id === activeId);

  const handleEnd = ({ active: a, over }) => {
    setActiveId(null);
    if (!over) return; // dropped outside any column: nothing changes
    if (STATUSES.some((s) => s.id === over.id)) onMove(a.id, over.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={handleEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <main className="board">
        {STATUSES.map((s) => (
          <TaskColumn key={s.id} status={s} tasks={getByStatus(tasks, s.id)} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </main>
      <DragOverlay dropAnimation={{ duration: 180 }}>
        {active ? <TaskCardView task={active} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
