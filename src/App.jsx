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

// Deterministic member colors for prominent owner avatars & badges
export const TEAM_COLORS = {
  'Saayam Mehmood': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    ring: 'ring-indigo-400',
    dot: 'bg-indigo-500',
  },
  'Teammate B': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    ring: 'ring-emerald-400',
    dot: 'bg-emerald-500',
  },
  'Teammate C': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    ring: 'ring-amber-400',
    dot: 'bg-amber-500',
  },
};

export function getMemberColors(name) {
  return TEAM_COLORS[name] || {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    ring: 'ring-slate-400',
    dot: 'bg-slate-500',
  };
}

/**
 * M8 due-tint: Computes due status according to DESIGN.md §2:
 * - due-safe: #16A34A (More than 2 days out)
 * - due-warning: #D97706 (Less than 24 hours)
 * - due-overdue: #B91C1C (Past due)
 * - due-neutral: #64748B (Done overrides date)
 */
export function getDueStatus(dueDate, status) {
  if (status === 'done') {
    return {
      state: 'neutral',
      label: 'Completed',
      badgeClass: 'bg-slate-100 text-[#64748B] border-slate-200',
      tintClass: 'bg-slate-50/50 border-slate-200',
      pillClass: 'text-[#64748B]',
      daysDiff: null,
    };
  }

  if (!dueDate) {
    return {
      state: 'none',
      label: 'No due date',
      badgeClass: 'bg-slate-50 text-slate-400 border-slate-200',
      tintClass: 'bg-white border-slate-200/90',
      pillClass: 'text-slate-400',
      daysDiff: null,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDate.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      state: 'overdue',
      label: overdueDays === 1 ? '1 day overdue' : `${overdueDays} days overdue`,
      badgeClass: 'bg-red-50 text-[#B91C1C] border-red-200 font-semibold',
      tintClass: 'bg-red-50/30 border-red-200 hover:border-red-300',
      pillClass: 'text-[#B91C1C]',
      daysDiff: diffDays,
    };
  }

  if (diffDays <= 1) {
    return {
      state: 'warning',
      label: diffDays === 0 ? 'Due today (<24h)' : 'Due tomorrow (<24h)',
      badgeClass: 'bg-amber-50 text-[#D97706] border-amber-200 font-semibold',
      tintClass: 'bg-amber-50/30 border-amber-200 hover:border-amber-300',
      pillClass: 'text-[#D97706]',
      daysDiff: diffDays,
    };
  }

  return {
    state: 'safe',
    label: `Due in ${diffDays} days`,
    badgeClass: 'bg-emerald-50 text-[#16A34A] border-emerald-200 font-medium',
    tintClass: 'bg-white border-slate-200/90 hover:border-slate-300',
    pillClass: 'text-[#16A34A]',
    daysDiff: diffDays,
  };
}

export const INITIAL_TASKS = [
  {
    id: 'TASK-101',
    title: 'Scaffold interactive task modal',
    description: 'Implement modal for creating, viewing, and editing tasks with full field support.',
    type: 'feature',
    status: 'todo',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-24', // Safe: 4 days out
    createdDate: '2026-10-20',
  },
  {
    id: 'TASK-102',
    title: 'Build Task Data Model & Board View',
    description: 'Render the four-column Kanban board with cards and synchronize state to localStorage.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-21', // Warning: <24h / tomorrow
    createdDate: '2026-10-20',
  },
  {
    id: 'TASK-103',
    title: 'Fix card badge contrast ratio',
    description: 'Ensure bug and feature type tag badges meet WCAG AA contrast standards.',
    type: 'bug',
    status: 'review',
    assignee: 'Teammate B',
    dueDate: '2026-10-19', // Overdue: 1 day past due
    createdDate: '2026-10-19',
  },
  {
    id: 'TASK-104',
    title: 'Initialize repository & Tailwind setup',
    description: 'Set up Vite React project, configure Tailwind colors from DESIGN.md, and test build.',
    type: 'feature',
    status: 'done',
    assignee: 'Teammate C',
    dueDate: '2026-10-20', // Neutral: Done overrides date
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
 * M6 tag-style: Icons for Feature and Bug tags per DESIGN.md §2
 */
export function FeatureIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export function BugIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="14" x="8" y="6" rx="4" />
      <path d="m19 7-3 2" />
      <path d="m5 7 3 2" />
      <path d="m19 19-3-2" />
      <path d="m5 19 3-2" />
      <path d="M20 13h-4" />
      <path d="M4 13h4" />
      <path d="m10 4 1 2" />
      <path d="m14 4-1 2" />
    </svg>
  );
}

export function ClockIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Task card component rendering task attributes according to DESIGN.md
 * M6 tag-style: accent stripe + icon + colors (#0284C7 for feature, #DC2626 for bug)
 * M7 task-owner: prominent assignee avatar + "Hand off to..." dropdown
 * M8 due-tint: card background & due badge change color based on approaching deadline
 */
function TaskCard({ task, onSelect, onHandoff }) {
  const isBug = task.type === 'bug';
  const ownerColors = getMemberColors(task.assignee);
  const dueInfo = getDueStatus(task.dueDate, task.status);

  return (
    <article
      onClick={() => onSelect && onSelect(task)}
      className={`rounded-lg border p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col gap-2.5 text-left group border-l-4 ${
        isBug ? 'border-l-bug' : 'border-l-feature'
      } ${dueInfo.tintClass}`}
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
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
            isBug
              ? 'bg-red-50 text-bug border border-red-200'
              : 'bg-sky-50 text-feature border border-sky-200'
          }`}
        >
          {isBug ? <BugIcon className="w-3 h-3 text-bug" /> : <FeatureIcon className="w-3 h-3 text-feature" />}
          <span>{task.type}</span>
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

      {/* M8 due-tint: Time remaining indicator badge */}
      {task.dueDate && (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] border ${dueInfo.badgeClass}`}
            title={`Due date: ${task.dueDate} (${dueInfo.label})`}
          >
            <ClockIcon className="w-3 h-3 shrink-0" />
            <span>{dueInfo.label}</span>
          </span>
        </div>
      )}

      {/* M7 task-owner: Prominent Owner Badge + "Hand off to..." dropdown */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-flex items-center justify-center h-6 w-6 rounded-full border text-[11px] font-bold shrink-0 ${ownerColors.bg} ${ownerColors.text} ${ownerColors.border}`}
            title={`Assigned to ${task.assignee}`}
          >
            {getInitials(task.assignee)}
          </span>
          <span className="truncate text-slate-800 font-semibold text-xs leading-none">
            {task.assignee}
          </span>
        </div>

        {/* Hand off to... Dropdown */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <select
            value=""
            aria-label={`Hand off ${task.title} to teammate`}
            onChange={(e) => {
              const newOwner = e.target.value;
              if (newOwner && newOwner !== task.assignee) {
                onHandoff(task.id, newOwner);
              }
            }}
            className="text-[11px] font-medium bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer transition-colors shadow-2xs"
            title="Hand off task to a teammate"
          >
            <option value="" disabled>
              Hand off to...
            </option>
            {TEAM.filter((member) => member !== task.assignee).map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
}

/**
 * M5 crud-modal: Add / Edit / Delete task modal
 * Adheres to DESIGN.md §4: Centered, max-w-lg, slate-900 backdrop at 40% opacity, explicit high-contrast close button.
 * M6 tag-style: Visual segmented toggle for Feature vs Bug with icons and colors.
 * M7 task-owner: Prominent Assignee picker with member avatar indicator.
 * M8 due-tint: Shows due deadline status badge next to due date input.
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

  const selectedOwnerColors = getMemberColors(formData.assignee);
  const modalDueInfo = getDueStatus(formData.dueDate, formData.status);

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
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'feature' })}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition-all ${
                    formData.type === 'feature'
                      ? 'bg-sky-50 text-feature border-feature ring-1 ring-feature'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FeatureIcon className="w-3.5 h-3.5 text-feature" />
                  <span>Feature</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'bug' })}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition-all ${
                    formData.type === 'bug'
                      ? 'bg-red-50 text-bug border-bug ring-1 ring-bug'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <BugIcon className="w-3.5 h-3.5 text-bug" />
                  <span>Bug</span>
                </button>
              </div>
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
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center h-8 w-8 rounded-full border text-xs font-bold shrink-0 ${selectedOwnerColors.bg} ${selectedOwnerColors.text} ${selectedOwnerColors.border}`}
                >
                  {getInitials(formData.assignee)}
                </span>
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
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Due Date
                </label>
                {formData.dueDate && modalDueInfo.state !== 'none' && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${modalDueInfo.badgeClass}`}>
                    <ClockIcon className="w-2.5 h-2.5 shrink-0" />
                    {modalDueInfo.label}
                  </span>
                )}
              </div>
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

  // M7 task-owner: active handoff toast notification state
  const [handoffToast, setHandoffToast] = useState(null);

  // Filter tasks by team member
  const [filterAssignee, setFilterAssignee] = useState(null);

  // M6 tag-style: quick stats for board health
  const featureCount = tasks.filter((t) => t.type === 'feature').length;
  const bugCount = tasks.filter((t) => t.type === 'bug').length;

  // M8 due-tint: deadline stats
  const overdueCount = tasks.filter((t) => getDueStatus(t.dueDate, t.status).state === 'overdue').length;
  const warningCount = tasks.filter((t) => getDueStatus(t.dueDate, t.status).state === 'warning').length;

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

  const triggerHandoffToast = (newOwner) => {
    // Microcopy specified in DESIGN.md §5: "Task handed off to {name}"
    setHandoffToast(`Task handed off to ${newOwner}`);
    setTimeout(() => {
      setHandoffToast((current) => (current?.includes(newOwner) ? null : current));
    }, 3500);
  };

  const handleSaveTask = (taskToSave) => {
    if (modalState.mode === 'create') {
      setTasks((prev) => [taskToSave, ...prev]);
    } else {
      const oldTask = tasks.find((t) => t.id === taskToSave.id);
      if (oldTask && oldTask.assignee !== taskToSave.assignee) {
        triggerHandoffToast(taskToSave.assignee);
      }
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

  // M7 task-owner: Direct "Hand off to..." handler with visual acknowledgement
  const handleHandoff = (taskId, newOwner) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, assignee: newOwner } : task
      )
    );
    triggerHandoffToast(newOwner);
  };

  const displayedTasks = filterAssignee
    ? tasks.filter((t) => t.assignee === filterAssignee)
    : tasks;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Saayam · Easy development
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* M6 & M8 health indicators */}
          <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm text-xs">
            <span className="font-medium text-slate-500">Tasks:</span>
            <span className="font-semibold text-slate-800">{tasks.length}</span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 font-semibold text-feature" title="Features">
              <FeatureIcon className="w-3 h-3 text-feature" />
              {featureCount}
            </span>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 font-semibold text-bug" title="Bugs">
              <BugIcon className="w-3 h-3 text-bug" />
              {bugCount}
            </span>

            {/* M8 due status indicators */}
            {(overdueCount > 0 || warningCount > 0) && (
              <>
                <span className="text-slate-300">|</span>
                {overdueCount > 0 && (
                  <span className="inline-flex items-center gap-1 font-semibold text-[#B91C1C]" title="Overdue tasks">
                    <span className="h-2 w-2 rounded-full bg-[#B91C1C] animate-pulse" />
                    {overdueCount} overdue
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="inline-flex items-center gap-1 font-semibold text-[#D97706]" title="Due in <24h">
                    <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                    {warningCount} due soon
                  </span>
                )}
              </>
            )}
          </div>

          {/* M5 crud-modal "+" button */}
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

      {/* M7 task-owner: Team Strip ("Who is doing what?") */}
      <section className="mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Team Activity
            </h2>
            <span className="text-xs text-slate-400">· Who is doing what</span>
          </div>
          {filterAssignee && (
            <button
              onClick={() => setFilterAssignee(null)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Clear Filter (Showing all)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TEAM.map((member) => {
            const memberTasks = tasks.filter((t) => t.assignee === member);
            const activeTask = memberTasks.find((t) => t.status === 'in-progress');
            const colors = getMemberColors(member);
            const isSelected = filterAssignee === member;

            return (
              <div
                key={member}
                onClick={() => setFilterAssignee(isSelected ? null : member)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
                title={`Click to filter board by ${member}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-full border text-xs font-bold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {getInitials(member)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {member}
                      </span>
                      {activeTask && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Actively driving" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {activeTask ? (
                        <span>Driving: <span className="text-slate-700 font-medium">{activeTask.title}</span></span>
                      ) : (
                        <span>{memberTasks.length} {memberTasks.length === 1 ? 'task' : 'tasks'} assigned</span>
                      )}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 shrink-0">
                  {memberTasks.length}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/* Kanban Board */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {STAGES.map((stage) => {
          const stageTasks = displayedTasks.filter((t) => t.status === stage.id);
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
                      onHandoff={handleHandoff}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-28 rounded-lg border-2 border-dashed border-slate-300/80 p-4 text-center text-xs text-slate-400 font-medium">
                    {filterAssignee
                      ? `No tasks for ${filterAssignee} in ${stage.label}`
                      : 'Nothing here yet, continue coding'}
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

      {/* M7 task-owner: Visual Handoff Toast Notification (DESIGN.md §5 & §7) */}
      {handoffToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 transition-all duration-200"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <p className="text-sm font-medium pr-1">{handoffToast}</p>
          <button
            type="button"
            onClick={() => setHandoffToast(null)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            title="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
