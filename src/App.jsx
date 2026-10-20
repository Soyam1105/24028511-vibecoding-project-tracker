import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate     ISO 'YYYY-MM-DD'
 * @property {string} createdDate      ISO 'YYYY-MM-DD'
 * @property {string} [context]
 * @property {string|null} [contextTool]
 * @property {string|null} [contextUpdatedAt]
 */

// The four columns of the board, in render order.
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Replace these placeholders with the three names from PRD §8 before M4.
// They become the only valid values for `Task.assignee`.
export const TEAM = ['Saayam Mehmood', 'Teammate B', 'Teammate C'];

export const INITIAL_TASKS = [
  {
    id: 'TASK-101',
    title: 'Scaffold interactive task modal',
    description: 'Implement modal for creating, viewing, and editing tasks with full field support.',
    type: 'feature',
    status: 'todo',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-24',
    createdDate: '2026-10-20',
  },
  {
    id: 'TASK-102',
    title: 'Build Task Data Model & Board View',
    description: 'Render the four-column Kanban board with cards and synchronize state to localStorage.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-22',
    createdDate: '2026-10-20',
  },
  {
    id: 'TASK-103',
    title: 'Fix card badge contrast ratio',
    description: 'Ensure bug and feature type tag badges meet WCAG AA contrast standards.',
    type: 'bug',
    status: 'review',
    assignee: 'Teammate B',
    dueDate: '2026-10-21',
    createdDate: '2026-10-19',
  },
  {
    id: 'TASK-104',
    title: 'Initialize repository & Tailwind setup',
    description: 'Set up Vite React project, configure Tailwind colors from DESIGN.md, and test build.',
    type: 'feature',
    status: 'done',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-20',
    createdDate: '2026-10-18',
  },
];

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 *
 * Usage:
 *   const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', []);
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Task card component rendering task attributes according to DESIGN.md
 */
function TaskCard({ task, onSelect }) {
  const isBug = task.type === 'bug';

  return (
    <article
      onClick={() => onSelect && onSelect(task)}
      className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-sm hover:shadow hover:border-slate-300 transition-all cursor-pointer flex flex-col gap-2.5 text-left group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(task);
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-slate-500 group-hover:text-slate-700">
          {task.id}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${
            isBug
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-sky-50 text-sky-700 border border-sky-200'
          }`}
        >
          {task.type}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700 shrink-0"
            title={task.assignee}
          >
            {getInitials(task.assignee)}
          </span>
          <span className="truncate text-slate-700 font-medium">
            {task.assignee}
          </span>
        </div>
        {task.dueDate && (
          <span className="font-mono text-[11px] text-slate-400 shrink-0 ml-2">
            {task.dueDate}
          </span>
        )}
      </div>
    </article>
  );
}

/**
 * M5 crud-modal: Add / Edit / Delete task modal
 * Adheres to DESIGN.md §4: Centered, max-w-lg, slate-900 backdrop at 40% opacity, explicit high-contrast close button.
 */
function TaskModal({ isOpen, mode, initialTask, defaultStatus, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: defaultStatus || 'todo',
    assignee: TEAM[0] || '',
    dueDate: '',
  });

  useEffect(() => {
    if (initialTask && mode === 'edit') {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        type: initialTask.type || 'feature',
        status: initialTask.status || 'todo',
        assignee: initialTask.assignee || TEAM[0] || '',
        dueDate: initialTask.dueDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'feature',
        status: defaultStatus || 'todo',
        assignee: TEAM[0] || '',
        dueDate: '',
      });
    }
  }, [initialTask, mode, defaultStatus, isOpen]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (mode === 'create') {
      const newTask = {
        id: `TASK-${Date.now().toString().slice(-4)}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        assignee: formData.assignee,
        dueDate: formData.dueDate || null,
        createdDate: new Date().toISOString().slice(0, 10),
        context: '',
        contextTool: null,
        contextUpdatedAt: null,
      };
      onSave(newTask);
    } else {
      const updatedTask = {
        ...initialTask,
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        assignee: formData.assignee,
        dueDate: formData.dueDate || null,
      };
      onSave(updatedTask);
    }
  };

  const handleDelete = () => {
    // Microcopy from DESIGN.md §5
    if (window.confirm('Do you wish to delete this task?')) {
      onDelete(initialTask.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            {mode === 'edit' && (
              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {initialTask?.id}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
            title="Close modal (Esc)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement user authentication"
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details, acceptance criteria, or vibe notes..."
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              >
                {TEAM.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>

          {/* TODO M9 context: Prompt context field will be placed here */}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete Task
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                {mode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);

  // M5 crud-modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    task: null,
    defaultStatus: 'todo',
  });

  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  const handleOpenCreateModal = (stageId = 'todo') => {
    setModalState({
      isOpen: true,
      mode: 'create',
      task: null,
      defaultStatus: stageId,
    });
  };

  const handleOpenEditModal = (task) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      task,
      defaultStatus: task.status,
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveTask = (taskToSave) => {
    if (modalState.mode === 'create') {
      setTasks((prev) => [taskToSave, ...prev]);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToSave.id ? taskToSave : t))
      );
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Saayam · Easy development
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-md px-3 py-2 shadow-sm">
            Total Tasks: <span className="font-semibold text-slate-800">{tasks.length}</span>
          </div>

          {/* M5 crud-modal "+" button (labeled "New Task" as per DESIGN.md §5) */}
          <button
            type="button"
            onClick={() => handleOpenCreateModal('todo')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/* Kanban Board */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage.id);
          return (
            <section
              key={stage.id}
              className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col"
            >
              <div className="flex items-center justify-between px-1 py-1 mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {stage.label}
                  </h2>
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold bg-slate-200/90 text-slate-700">
                    {stageTasks.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenCreateModal(stage.id)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/60 transition-colors"
                  title={`Add task to ${stage.label}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {stageTasks.length > 0 ? (
                  stageTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={handleOpenEditModal}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-28 rounded-lg border-2 border-dashed border-slate-300/80 p-4 text-center text-xs text-slate-400 font-medium">
                    Nothing here yet, continue coding
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>

      {/* Task Modal for Add, Edit, Delete */}
      <TaskModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialTask={modalState.task}
        defaultStatus={modalState.defaultStatus}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
