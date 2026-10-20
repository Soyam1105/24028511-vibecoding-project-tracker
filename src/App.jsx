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
      className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-sm hover:shadow transition-shadow cursor-pointer flex flex-col gap-2.5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-slate-500">
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
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
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

export default function App() {
  // M4 data-model: Kanban task state initialized from localStorage with 4 seed tasks
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);

  // TODO M5 crud-modal:
  //   const [editing, setEditing] = useState(null);
  //
  // TODO M11 anchors:
  //   const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', [...]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vibecoding Project Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Saayam · Easy development
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm">
            Total Tasks: <span className="font-semibold text-slate-800">{tasks.length}</span>
          </div>
          {/* TODO M5 crud-modal: Add New Task (+) button here */}
        </div>
      </header>

      {/* TODO M11 anchors: render the Anchor Board (Presentation / Demo / Report / Documentation) above the board. */}

      {/*
        TODO M4 data-model:
          Render a Kanban board with the four columns from STAGES.
          Each column should display the tasks whose status matches its id.
          Pre-populate 3-4 mock tasks so the board isn't empty on first load.

        TODO M5 crud-modal:
          Add a "+" button that opens a modal with every Task field.
          Clicking a card should open the same modal in edit mode.
      */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((t) => t.status === stage.id);
          return (
            <section
              key={stage.id}
              className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col"
            >
              <div className="flex items-center justify-between px-1 py-1 mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {stage.label}
                </h2>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold bg-slate-200/90 text-slate-700">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {stageTasks.length > 0 ? (
                  stageTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={(t) => {
                        // TODO M5: connect to editing modal state
                        console.log('Selected task:', t);
                      }}
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
    </div>
  );
}
