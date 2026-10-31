import { Waves, Plus } from 'lucide-react';

export default function Navbar({ total, onAdd }) {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark"><Waves size={20} /></span>
        <div>
          <h1>Tideline</h1>
          <p>Team workspace · sprint board</p>
        </div>
      </div>
      <div className="nav-right">
        <span className="total-pill">{total} {total === 1 ? 'task' : 'tasks'}</span>
        <button className="btn btn-primary" onClick={onAdd}><Plus size={16} /> Add Task</button>
      </div>
    </header>
  );
}
