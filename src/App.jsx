import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker
 *
 * Core Features & Functional Requirements:
 * - FR1 - FR5  : Project Management (Create, Edit details, Delete, Sidebar listing, Switch projects)
 * - FR6 - FR13 : Project Dashboard (Overview, Upcoming deadlines, Progress stats, Overdue count, Deliverables)
 * - FR14 - FR29: Kanban Board (4 fixed columns, Task CRUD, Title/Desc/Type, Quick column movement, Member assignment, Due date urgency, Filters by member/type/due date)
 * - FR30 - FR34: AI Context (Prompts & generated output, AI model selector, Edit context, 1-click Copy, Markdown formatting)
 * - FR35 - FR39: Team Management (Project members roster, Auto-assigned PM to creator, Clear PM identification, Invite new members, Remove members)
 */

export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TEAM = ['Saayam Mehmood', 'Teammate B', 'Teammate C'];

export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-hackathon',
    name: 'Hackathon Project Tracker',
    description: 'Central project tracking Module 5 vibecoding deliverables, Kanban task states, and AI prompt context briefings.',
    createdAt: '2026-10-20',
    manager: 'Saayam Mehmood',
    members: ['Saayam Mehmood', 'Teammate B', 'Teammate C'],
  },
  {
    id: 'proj-landing',
    name: 'Marketing & Landing Page',
    description: 'Public marketing website, demo walkthrough videos, and landing page assets for product launch.',
    createdAt: '2026-10-21',
    manager: 'Saayam Mehmood',
    members: ['Saayam Mehmood', 'Teammate B'],
  },
];

export const INITIAL_ANCHORS = [
  {
    id: 'presentation',
    projectId: 'proj-hackathon',
    label: 'Presentation',
    url: 'https://docs.google.com/presentation',
  },
  {
    id: 'demo',
    projectId: 'proj-hackathon',
    label: 'Demo',
    url: 'https://24028511-vibecoding-project-tracker.vercel.app/',
  },
  {
    id: 'report',
    projectId: 'proj-hackathon',
    label: 'Report',
    url: null,
  },
  {
    id: 'documentation',
    projectId: 'proj-hackathon',
    label: 'Documentation',
    url: 'https://github.com/Soyam1105/24028511-vibecoding-project-tracker',
  },
];

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

const PALETTES = [
  { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-300',  ring: 'ring-indigo-400',  dot: 'bg-indigo-500' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', ring: 'ring-emerald-400', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300',   ring: 'ring-amber-400',   dot: 'bg-amber-500' },
  { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-300',  ring: 'ring-purple-400',  dot: 'bg-purple-500' },
  { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-300',    ring: 'ring-rose-400',    dot: 'bg-rose-500' },
  { bg: 'bg-cyan-100',    text: 'text-cyan-800',    border: 'border-cyan-300',    ring: 'ring-cyan-400',    dot: 'bg-cyan-500' },
];

export function getMemberColors(name) {
  if (TEAM_COLORS[name]) return TEAM_COLORS[name];
  if (!name) return PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

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

export function formatContextTime(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export async function serializeAndCopyTask(task) {
  const stageObj = STAGES.find((s) => s.id === task.status);
  const stageLabel = stageObj ? stageObj.label : task.status;

  const markdown = [
    `# Task: [${task.id}] ${task.title}`,
    `**Type:** ${task.type === 'bug' ? 'Bug 🐛' : 'Feature 🚀'}`,
    `**Status:** ${stageLabel}`,
    `**Assignee:** ${task.assignee}`,
    task.dueDate ? `**Due Date:** ${task.dueDate}` : null,
    task.contextTool ? `**AI Tool:** ${task.contextTool}` : null,
    task.contextUpdatedAt ? `**Context Updated:** ${formatContextTime(task.contextUpdatedAt)}` : null,
    '',
    `## Description`,
    task.description || 'No description provided.',
    '',
    `## AI Prompt Context & Instructions`,
    task.context && task.context.trim().length > 0
      ? task.context.trim()
      : `No prompt context saved yet. Please provide code implementation based on the task description and project guidelines.`,
    '',
    `---`,
    `*Generated by Vibecoding Project Tracker*`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(markdown);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  return markdown;
}

export const INITIAL_TASKS = [
  {
    id: 'TASK-101',
    projectId: 'proj-hackathon',
    title: 'Scaffold interactive task modal',
    description: 'Implement modal for creating, viewing, and editing tasks with full field support.',
    type: 'feature',
    status: 'todo',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-24',
    createdDate: '2026-10-20',
    context: `## AI Prompt Context\nBuild an accessible task modal in React supporting create/edit/delete flows. Follow DESIGN.md §4 specs.`,
    contextTool: 'Claude',
    contextUpdatedAt: '2026-10-20T10:15:00Z',
  },
  {
    id: 'TASK-102',
    projectId: 'proj-hackathon',
    title: 'Build Task Data Model & Board View',
    description: 'Render the four-column Kanban board with cards and synchronize state to localStorage.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-21',
    createdDate: '2026-10-20',
    context: `## Prompt\nRender 4 columns: To Do, In Progress, Review, Done. Synchronize with localStorage hook.`,
    contextTool: 'Cursor',
    contextUpdatedAt: '2026-10-20T11:45:00Z',
  },
  {
    id: 'TASK-103',
    projectId: 'proj-hackathon',
    title: 'Fix card badge contrast ratio',
    description: 'Ensure bug and feature type tag badges meet WCAG AA contrast standards.',
    type: 'bug',
    status: 'review',
    assignee: 'Teammate B',
    dueDate: '2026-10-19',
    createdDate: '2026-10-19',
    context: `## Audit Notes\nCheck WCAG AA 4.5:1 ratio for feature and bug badges against light card background.`,
    contextTool: 'ChatGPT',
    contextUpdatedAt: '2026-10-20T13:00:00Z',
  },
  {
    id: 'TASK-104',
    projectId: 'proj-hackathon',
    title: 'Initialize repository & Tailwind setup',
    description: 'Set up Vite React project, configure Tailwind colors from DESIGN.md, and test build.',
    type: 'feature',
    status: 'done',
    assignee: 'Teammate C',
    dueDate: '2026-10-20',
    createdDate: '2026-10-18',
    context: `Initialize project structure with Tailwind tokens configured from DESIGN.md palette.`,
    contextTool: 'Lovable',
    contextUpdatedAt: '2026-10-18T09:30:00Z',
  },
  {
    id: 'TASK-201',
    projectId: 'proj-landing',
    title: 'Draft landing page hero copy',
    description: 'Write engaging copy explaining the prompt context feature for AI vibecoders.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Saayam Mehmood',
    dueDate: '2026-10-26',
    createdDate: '2026-10-21',
    context: `## Hero Section Brief\nHighlight 1-click prompt retrieval and frictionless Kanban management.`,
    contextTool: 'Claude',
    contextUpdatedAt: '2026-10-21T09:00:00Z',
  },
  {
    id: 'TASK-202',
    projectId: 'proj-landing',
    title: 'Configure custom domain & SSL',
    description: 'Point custom domain DNS to Vercel and verify automatic SSL certificate issuance.',
    type: 'feature',
    status: 'done',
    assignee: 'Teammate B',
    dueDate: '2026-10-22',
    createdDate: '2026-10-21',
    context: `Verify DNS A and CNAME records with Vercel edge network.`,
    contextTool: 'Cursor',
    contextUpdatedAt: '2026-10-21T11:00:00Z',
  },
];

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
      /* quota or private-mode error */
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

export function PromptContextIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

export function CopyIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function EditIcon({ className = 'w-3 h-3' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

export function FolderIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function AnchorIcon({ id, className = 'w-4 h-4' }) {
  switch (id) {
    case 'presentation':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'demo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
      );
    case 'report':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'documentation':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
  }
}

/**
 * Markdown preview formatter for FR34
 */
function MarkdownPreview({ content }) {
  if (!content || !content.trim()) {
    return <p className="text-xs text-slate-400 italic">No prompt context or notes provided.</p>;
  }

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs text-slate-700 font-sans leading-relaxed">
      {lines.map((line, idx) => {
        if (line.startsWith('### ')) {
          return <h4 key={idx} className="font-bold text-slate-900 text-xs mt-2">{line.replace('### ', '')}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={idx} className="font-bold text-slate-900 text-sm mt-2">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={idx} className="font-bold text-slate-900 text-base mt-2">{line.replace('# ', '')}</h2>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>{renderFormattedText(line.substring(2))}</span>
            </div>
          );
        }
        if (line.startsWith('```')) {
          return <div key={idx} className="h-0.5 bg-slate-200 my-1" />;
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-1.5" />;
        }
        return <p key={idx}>{renderFormattedText(line)}</p>;
      })}
    </div>
  );
}

function renderFormattedText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono text-[11px]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

/**
 * Project Sidebar with Create (FR1), Edit details (FR2), Delete (FR3), List (FR4), Switch (FR5)
 */
function ProjectSidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  tasks,
  isOpen,
  onCloseMobile,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Project editing state (FR2)
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName.trim(), newProjectDesc.trim());
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreating(false);
  };

  const handleStartEdit = (project, e) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditDesc(project.description || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onEditProject(editingProjectId, editName.trim(), editDesc.trim());
    setEditingProjectId(null);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-14 px-4 border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span className="font-bold text-sm text-slate-900 truncate tracking-tight">
              Vibecoding Tracker
            </span>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Projects Section Header */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Projects
          </span>
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setEditingProjectId(null);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded transition-colors"
            title="Create new project (FR1)"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>New</span>
          </button>
        </div>

        {/* Create Project Form (FR1) */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                required
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. Mobile App Client"
                className="w-full px-2.5 py-1 text-xs bg-white border border-indigo-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Description
              </label>
              <textarea
                rows="2"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="Goals, target users, or context..."
                className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectName('');
                  setNewProjectDesc('');
                }}
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Edit Project Inline Form (FR2) */}
        {editingProjectId && (
          <form onSubmit={handleSaveEdit} className="p-3 bg-indigo-50/50 border-b border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Edit Project
              </span>
              <button
                type="button"
                onClick={() => setEditingProjectId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-white border border-indigo-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                Description
              </label>
              <textarea
                rows="2"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setEditingProjectId(null)}
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Projects List (FR4 & FR5) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.map((project) => {
            const isSelected = project.id === activeProjectId;
            const isEditing = editingProjectId === project.id;
            const projectTaskCount = tasks.filter(
              (t) => (t.projectId || projects[0]?.id) === project.id
            ).length;

            return (
              <div
                key={project.id}
                onClick={() => {
                  onSelectProject(project.id);
                  onCloseMobile();
                }}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-2xs border border-indigo-200/80'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                } ${isEditing ? 'ring-2 ring-indigo-400' : ''}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FolderIcon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <div className="min-w-0">
                    <span className="block truncate">{project.name}</span>
                    {project.description && (
                      <span className="block truncate text-[10px] text-slate-400 font-normal">
                        {project.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`min-w-[18px] h-4.5 px-1.5 rounded-full text-[10px] font-semibold flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-200/70 text-indigo-900'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    {projectTaskCount}
                  </span>

                  {/* Edit Project Button (FR2) */}
                  <button
                    type="button"
                    onClick={(e) => handleStartEdit(project, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-opacity"
                    title="Edit project details (FR2)"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Project Button (FR3) */}
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-0.5 rounded transition-opacity"
                      title="Delete project (FR3)"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50/60 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700">Workspace active</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v1.3</span>
        </div>
      </aside>
    </>
  );
}

/**
 * Team Activity Component (Displayed on Kanban tab for quick team pulse)
 */
function TeamActivitySection({ team, projectTasks, filterAssignee, onToggleFilter }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Team Activity
          </h2>
          <span className="text-[11px] text-slate-400">· Who is doing what in this project</span>
        </div>
        {filterAssignee && (
          <button
            onClick={() => onToggleFilter(null)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Clear Filter (Showing all)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {team.map((member) => {
          const memberTasks = projectTasks.filter((t) => t.assignee === member);
          const activeTask = memberTasks.find((t) => t.status === 'in-progress');
          const colors = getMemberColors(member);
          const isSelected = filterAssignee === member;

          return (
            <div
              key={member}
              onClick={() => onToggleFilter(isSelected ? null : member)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 shadow-sm'
                  : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
              title={`Click to filter board by ${member}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`inline-flex items-center justify-center h-7 w-7 rounded-full border text-[11px] font-bold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {getInitials(member)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {member}
                    </span>
                    {activeTask && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" title="Actively driving" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeTask ? (
                      <span>Driving: <span className="text-slate-700 font-medium">{activeTask.title}</span></span>
                    ) : (
                      <span>{memberTasks.length} {memberTasks.length === 1 ? 'task' : 'tasks'} assigned</span>
                    )}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1.5 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 shrink-0">
                {memberTasks.length}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * AnchorBoard Component (FR10 - FR13)
 */
function AnchorBoard({ anchors, onUpdateAnchor }) {
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState('');

  const completedCount = anchors.filter((a) => Boolean(a.url && a.url.trim())).length;

  const handleStartEdit = (anchor) => {
    setEditingId(anchor.id);
    setEditUrl(anchor.url || '');
  };

  const handleSave = (id) => {
    const trimmed = editUrl.trim();
    onUpdateAnchor(id, trimmed || null);
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Anchor Deliverables
          </h2>
          <span className="text-xs text-slate-400">· Final Project Pins</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Progress: <span className="font-semibold text-slate-900">{completedCount} of {anchors.length}</span> linked
          </span>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(completedCount / anchors.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {anchors.map((anchor) => {
          const isLinked = Boolean(anchor.url && anchor.url.trim());
          const isEditing = editingId === anchor.id;

          return (
            <div
              key={anchor.id}
              className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2.5 ${
                isLinked
                  ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  : 'bg-white border-dashed border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-flex items-center justify-center h-7 w-7 rounded-md shrink-0 ${
                      isLinked
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <AnchorIcon id={anchor.id} className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {anchor.label}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                        isLinked ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isLinked ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      {isLinked ? 'Linked' : 'Pending Link'}
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(anchor)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
                    title={`Edit ${anchor.label} link (FR12)`}
                  >
                    <EditIcon className="w-3 h-3" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="url"
                    autoFocus
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, anchor.id)}
                    placeholder="https://..."
                    className="w-full text-xs px-2 py-1.5 border border-indigo-400 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-2 py-0.5 text-[11px] text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(anchor.id)}
                      className="px-2 py-0.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  {isLinked ? (
                    <a
                      href={anchor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium truncate max-w-full hover:underline group"
                      title={anchor.url}
                    >
                      <span className="truncate">{anchor.url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLinkIcon className="w-3 h-3 shrink-0 text-indigo-400 group-hover:text-indigo-600" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(anchor)}
                      className="text-xs text-slate-400 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>+ Add deliverable URL (FR11)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * TaskCard Component with Quick Move (FR21), Handoff (FR23), and Urgency Indication (FR25)
 */
function TaskCard({ task, onSelect, onHandoff, onCopyPrompt, onMoveTask, isCopied, teamMembers }) {
  const isBug = task.type === 'bug';
  const ownerColors = getMemberColors(task.assignee);
  const dueInfo = getDueStatus(task.dueDate, task.status);
  const hasContext = Boolean(task.context && task.context.trim().length > 0);

  const currentStageIndex = STAGES.findIndex((s) => s.id === task.status);
  const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  return (
    <article
      onClick={() => onSelect && onSelect(task)}
      className={`rounded-lg border p-3.5 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col gap-2.5 text-left group border-l-4 ${
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
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono text-xs font-semibold text-slate-500 group-hover:text-slate-700">
            {task.id}
          </span>
          {hasContext && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded"
              title={`AI Context attached (${task.contextTool || 'General'})`}
            >
              <PromptContextIcon className="w-2.5 h-2.5 text-indigo-600" />
              <span>{task.contextTool || 'AI'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Column Shift (FR21) */}
          <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200" onClick={(e) => e.stopPropagation()}>
            {prevStage && (
              <button
                type="button"
                onClick={() => onMoveTask(task.id, prevStage.id)}
                className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
                title={`Move to ${prevStage.label}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {nextStage && (
              <button
                type="button"
                onClick={() => onMoveTask(task.id, nextStage.id)}
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"
                title={`Move to ${nextStage.label}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyPrompt(task);
            }}
            className={`inline-flex items-center gap-1 text-[11px] font-medium border rounded px-1.5 py-0.5 transition-all shadow-2xs ${
              isCopied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                : 'bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border-slate-200 hover:border-indigo-200'
            }`}
            title="Copy task + prompt context for AI (FR33)"
          >
            {isCopied ? (
              <>
                <CheckIcon className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3 h-3 text-slate-500 group-hover:text-indigo-600" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>

          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              isBug
                ? 'bg-red-50 text-bug border border-red-200'
                : 'bg-sky-50 text-feature border border-sky-200'
            }`}
          >
            {isBug ? <BugIcon className="w-2.5 h-2.5 text-bug" /> : <FeatureIcon className="w-2.5 h-2.5 text-feature" />}
            <span>{task.type}</span>
          </span>
        </div>
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
            title="Hand off task to a teammate (FR23)"
          >
            <option value="" disabled>
              Hand off to...
            </option>
            {teamMembers.filter((member) => member !== task.assignee).map((member) => (
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
 * TaskModal Component supporting Markdown view (FR34), AI Context (FR30 - FR33)
 */
function TaskModal({ isOpen, mode, initialTask, defaultStatus, onClose, onSave, onDelete, onCopyPrompt, isCopied, teamMembers }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature',
    status: defaultStatus || 'todo',
    assignee: teamMembers[0] || 'Saayam Mehmood',
    dueDate: '',
    context: '',
    contextTool: 'Claude',
  });

  const [contextMode, setContextMode] = useState('write'); // 'write' | 'preview'

  useEffect(() => {
    if (initialTask && mode === 'edit') {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        type: initialTask.type || 'feature',
        status: initialTask.status || 'todo',
        assignee: initialTask.assignee || teamMembers[0] || 'Saayam Mehmood',
        dueDate: initialTask.dueDate || '',
        context: initialTask.context || '',
        contextTool: initialTask.contextTool || 'Claude',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'feature',
        status: defaultStatus || 'todo',
        assignee: teamMembers[0] || 'Saayam Mehmood',
        dueDate: '',
        context: '',
        contextTool: 'Claude',
      });
    }
    setContextMode('write');
  }, [initialTask, mode, defaultStatus, isOpen, teamMembers]);

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

    const isContextChanged =
      mode === 'create'
        ? Boolean(formData.context.trim())
        : formData.context.trim() !== (initialTask?.context || '').trim() ||
          formData.contextTool !== (initialTask?.contextTool || null);

    const nowIso = new Date().toISOString();
    const contextUpdatedAt = isContextChanged
      ? nowIso
      : (initialTask?.contextUpdatedAt || null);

    if (mode === 'create') {
      const newTask = {
        id: `TASK-${Date.now().toString().slice(-4)}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        status: formData.status,
        assignee: formData.assignee,
        dueDate: formData.dueDate || null,
        createdDate: nowIso.slice(0, 10),
        context: formData.context,
        contextTool: formData.contextTool || 'Claude',
        contextUpdatedAt: formData.context.trim() ? nowIso : null,
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
        context: formData.context,
        contextTool: formData.contextTool || 'Claude',
        contextUpdatedAt,
      };
      onSave(updatedTask);
    }
  };

  const handleDelete = () => {
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
              rows="2"
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
                  {teamMembers.map((member) => (
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

          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <PromptContextIcon className="w-3.5 h-3.5 text-indigo-600" />
                  Prompt Context
                </label>
                <span className="text-[11px] text-slate-400">· Curated briefing for AI / handoffs</span>
              </div>
              {initialTask?.contextUpdatedAt && mode === 'edit' && (
                <span className="text-[10px] text-slate-400">
                  Updated {formatContextTime(initialTask.contextUpdatedAt)}
                </span>
              )}
            </div>

            <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Tool:</span>
                <div className="flex flex-wrap gap-1">
                  {CONTEXT_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => setFormData({ ...formData, contextTool: tool })}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        formData.contextTool === tool
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Markdown View Toggle (FR34) */}
                <div className="bg-slate-100 p-0.5 rounded flex items-center border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setContextMode('write')}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      contextMode === 'write' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setContextMode('preview')}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      contextMode === 'preview' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onCopyPrompt({
                      ...(initialTask || {}),
                      id: initialTask?.id || 'NEW-TASK',
                      title: formData.title,
                      description: formData.description,
                      type: formData.type,
                      status: formData.status,
                      assignee: formData.assignee,
                      dueDate: formData.dueDate,
                      context: formData.context,
                      contextTool: formData.contextTool,
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-2xs"
                  title="Copy as formatted Prompt Context (FR33)"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3 h-3 text-indigo-600" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {contextMode === 'write' ? (
              <textarea
                rows="4"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Paste the prompts, constraints, or configurations used for this task (Markdown supported: # headers, **bold**, `code`, etc)..."
                className="w-full font-mono text-xs px-3 py-2.5 rounded-md border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed resize-none"
              />
            ) : (
              <div className="p-3 rounded-md border border-slate-200 bg-slate-50/50 min-h-[96px] max-h-48 overflow-y-auto">
                <MarkdownPreview content={formData.context} />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete Task (FR17)
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
  const [projects, setProjects] = useLocalStorage('vibetracker.projects', INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useLocalStorage('vibetracker.active_project', 'proj-hackathon');
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);
  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', INITIAL_ANCHORS);

  // Active view tab: 'dashboard' | 'kanban' | 'members'
  const [activeTab, setActiveTab] = useState('kanban');

  // Mobile sidebar toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create',
    task: null,
    defaultStatus: 'todo',
  });

  const [activeToast, setActiveToast] = useState(null);
  const [copiedTaskId, setCopiedTaskId] = useState(null);

  // Kanban filters (FR27, FR28, FR29)
  const [filterAssignee, setFilterAssignee] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'feature' | 'bug'
  const [filterDueStatus, setFilterDueStatus] = useState('all'); // 'all' | 'overdue' | 'due24' | 'safe'

  // Invite member input for Members tab (FR38)
  const [newMemberName, setNewMemberName] = useState('');

  // Ensure active project exists or fallback to first
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0] || {
    id: 'proj-default',
    name: 'General Project',
    description: '',
    manager: 'Saayam Mehmood',
    members: TEAM,
  };

  // Derive dynamic project members and manager (FR35 - FR39)
  const projectMembers = currentProject.members && currentProject.members.length > 0
    ? currentProject.members
    : TEAM;
  const projectManager = currentProject.manager || projectMembers[0] || 'Saayam Mehmood';

  // Filter tasks belonging to current active project
  const projectTasks = tasks.filter((t) => (t.projectId || projects[0]?.id) === currentProject.id);

  // Filter anchors for active project
  const currentProjectAnchors = (() => {
    const existing = anchors.filter((a) => (a.projectId || projects[0]?.id) === currentProject.id);
    if (existing.length === 4) return existing;
    return [
      { id: 'presentation',  projectId: currentProject.id, label: 'Presentation',  url: null },
      { id: 'demo',          projectId: currentProject.id, label: 'Demo',          url: null },
      { id: 'report',        projectId: currentProject.id, label: 'Report',        url: null },
      { id: 'documentation', projectId: currentProject.id, label: 'Documentation', url: null },
    ];
  })();

  const featureCount = projectTasks.filter((t) => t.type === 'feature').length;
  const bugCount = projectTasks.filter((t) => t.type === 'bug').length;
  const doneCount = projectTasks.filter((t) => t.status === 'done').length;
  const remainingCount = projectTasks.length - doneCount;
  const overdueTasks = projectTasks.filter((t) => getDueStatus(t.dueDate, t.status).state === 'overdue');
  const overdueCount = overdueTasks.length;
  const warningCount = projectTasks.filter((t) => getDueStatus(t.dueDate, t.status).state === 'warning').length;

  // Upcoming deadlines for Dashboard (FR7)
  const upcomingDeadlineTasks = projectTasks
    .filter((t) => t.status !== 'done' && t.dueDate)
    .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));

  const showToast = (message) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast((current) => (current === message ? null : current));
    }, 3500);
  };

  // FR1: Create new project (creator becomes PM - FR36)
  const handleCreateProject = (name, description) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      description: description || '',
      createdAt: new Date().toISOString().slice(0, 10),
      manager: 'Saayam Mehmood', // Auto assigned PM role to creator (FR36)
      members: ['Saayam Mehmood', 'Teammate B', 'Teammate C'],
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setActiveTab('dashboard');
    showToast(`Project "${name}" created`);
  };

  // FR2: Edit existing project details
  const handleEditProject = (projId, newName, newDesc) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projId ? { ...p, name: newName, description: newDesc } : p
      )
    );
    showToast(`Project details updated`);
  };

  // FR3: Delete existing project
  const handleDeleteProject = (projId) => {
    if (projects.length <= 1) return;
    if (window.confirm('Delete this project and all its tasks?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projId));
      setTasks((prev) => prev.filter((t) => t.projectId !== projId));
      if (activeProjectId === projId) {
        const remaining = projects.filter((p) => p.id !== projId);
        setActiveProjectId(remaining[0].id);
      }
      showToast('Project deleted');
    }
  };

  // FR38: Invite new member to project
  const handleInviteMember = (e) => {
    e.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;
    if (projectMembers.includes(trimmed)) {
      showToast(`${trimmed} is already a member`);
      return;
    }

    const updatedMembers = [...projectMembers, trimmed];
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id ? { ...p, members: updatedMembers } : p
      )
    );
    setNewMemberName('');
    showToast(`${trimmed} invited to project`);
  };

  // FR39: Remove member from project
  const handleRemoveMember = (memberName) => {
    if (memberName === projectManager) {
      alert('The Project Manager cannot be removed.');
      return;
    }
    if (window.confirm(`Remove ${memberName} from this project?`)) {
      const updatedMembers = projectMembers.filter((m) => m !== memberName);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === currentProject.id ? { ...p, members: updatedMembers } : p
        )
      );
      // Reassign any tasks assigned to this member to project manager
      setTasks((prev) =>
        prev.map((t) =>
          t.projectId === currentProject.id && t.assignee === memberName
            ? { ...t, assignee: projectManager }
            : t
        )
      );
      showToast(`${memberName} removed from project`);
    }
  };

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
    showToast(`Task handed off to ${newOwner}`);
  };

  // FR21: Move task between columns
  const handleMoveTask = (taskId, targetStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
    const targetStage = STAGES.find((s) => s.id === targetStatus);
    showToast(`Task moved to ${targetStage ? targetStage.label : targetStatus}`);
  };

  const handleCopyPromptContext = async (task) => {
    try {
      await serializeAndCopyTask(task);
      setCopiedTaskId(task.id);
      showToast('Context copied. Ready for AI');
      setTimeout(() => {
        setCopiedTaskId((current) => (current === task.id ? null : current));
      }, 2500);
    } catch (err) {
      console.error('Failed to copy prompt context:', err);
      showToast('Failed to copy to clipboard');
    }
  };

  const handleSaveTask = (taskToSave) => {
    if (modalState.mode === 'create') {
      const taskWithProject = {
        ...taskToSave,
        projectId: currentProject.id,
      };
      setTasks((prev) => [taskWithProject, ...prev]);
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

  const handleHandoff = (taskId, newOwner) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, assignee: newOwner } : task
      )
    );
    triggerHandoffToast(newOwner);
  };

  const handleUpdateAnchor = (id, newUrl) => {
    setAnchors((prev) => {
      const exists = prev.some((a) => a.id === id && (a.projectId || projects[0]?.id) === currentProject.id);
      if (exists) {
        return prev.map((a) =>
          a.id === id && (a.projectId || projects[0]?.id) === currentProject.id
            ? { ...a, url: newUrl }
            : a
        );
      }
      const slotDef = INITIAL_ANCHORS.find((x) => x.id === id);
      return [
        ...prev,
        {
          id,
          projectId: currentProject.id,
          label: slotDef?.label || id,
          url: newUrl,
        },
      ];
    });
    showToast(newUrl ? 'Deliverable link updated' : 'Deliverable link removed');
  };

  // Filter tasks based on member (FR27), type (FR28), and due date status (FR29)
  const displayedTasks = projectTasks.filter((task) => {
    if (filterAssignee && task.assignee !== filterAssignee) return false;
    if (filterType !== 'all' && task.type !== filterType) return false;
    if (filterDueStatus !== 'all') {
      const dueStatus = getDueStatus(task.dueDate, task.status);
      if (filterDueStatus === 'overdue' && dueStatus.state !== 'overdue') return false;
      if (filterDueStatus === 'due24' && dueStatus.state !== 'warning') return false;
      if (filterDueStatus === 'safe' && dueStatus.state !== 'safe') return false;
      if (filterDueStatus === 'none' && dueStatus.state !== 'none') return false;
    }
    return true;
  });

  const isFiltering = Boolean(filterAssignee || filterType !== 'all' || filterDueStatus !== 'all');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar for Projects (FR4 & FR5) */}
      <ProjectSidebar
        projects={projects}
        activeProjectId={currentProject.id}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setFilterAssignee(null);
          setFilterType('all');
          setFilterDueStatus('all');
        }}
        onCreateProject={handleCreateProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        tasks={tasks}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Compact Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100"
              title="Open projects sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Active Project Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline uppercase tracking-wider">Project /</span>
              <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
                {currentProject.name}
              </h1>
            </div>
          </div>

          {/* Section Navigation Tabs: Dashboard, Kanban, Members */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'kanban'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span>Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'members'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Members</span>
            </button>
          </nav>
        </header>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* TAB 1: DASHBOARD (FR6 - FR13) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Project Header Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Active Project
                      </span>
                      <span className="text-xs text-slate-400">Created {currentProject.createdAt || 'recently'}</span>
                      <span className="text-xs text-slate-400">· PM: <strong className="text-slate-700">{projectManager}</strong></span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {currentProject.name}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {currentProject.description || 'No description provided for this project yet. Edit or add details from the sidebar.'}
                    </p>
                  </div>

                  {/* Completion Rate Badge */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Completion Rate</span>
                      <span className="text-2xl font-black text-indigo-600">
                        {projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${projectTasks.length > 0 ? (doneCount / projectTasks.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Progress Statistics (FR8 & FR9) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                    <span className="text-xs text-slate-500 font-medium block">Total Tasks</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">{projectTasks.length}</span>
                    <span className="text-[10px] text-slate-400">{featureCount} features, {bugCount} bugs</span>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-lg p-3">
                    <span className="text-xs text-emerald-800 font-medium block">Completed Tasks</span>
                    <span className="text-xl font-bold text-emerald-600 mt-0.5 block">{doneCount}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Shipped & Done</span>
                  </div>

                  <div className="bg-sky-50/50 border border-sky-200/80 rounded-lg p-3">
                    <span className="text-xs text-sky-800 font-medium block">Remaining Tasks</span>
                    <span className="text-xl font-bold text-sky-700 mt-0.5 block">{remainingCount}</span>
                    <span className="text-[10px] text-sky-600 font-medium">In flight & planned</span>
                  </div>

                  <div className={`rounded-lg p-3 border ${
                    overdueCount > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-slate-50 border-slate-200/80 text-slate-900'
                  }`}>
                    <span className={`text-xs font-medium block ${overdueCount > 0 ? 'text-red-700 font-semibold' : 'text-slate-500'}`}>
                      Overdue Tasks (FR9)
                    </span>
                    <span className={`text-xl font-bold mt-0.5 block ${overdueCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                      {overdueCount}
                    </span>
                    <span className={`text-[10px] ${overdueCount > 0 ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                      {overdueCount > 0 ? 'Needs immediate attention' : 'No overdue tasks'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines & Project Activity Overview (FR7) */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Upcoming Deadlines & Project Schedule (FR7)
                    </h3>
                    <span className="text-xs text-slate-400">· Timeline monitor</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {upcomingDeadlineTasks.length} {upcomingDeadlineTasks.length === 1 ? 'task' : 'tasks'} scheduled
                  </span>
                </div>

                {upcomingDeadlineTasks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {upcomingDeadlineTasks.map((task) => {
                      const dueInfo = getDueStatus(task.dueDate, task.status);
                      const isOverdue = dueInfo.state === 'overdue';
                      const isWarning = dueInfo.state === 'warning';

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleOpenEditModal(task)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-xs flex flex-col justify-between gap-2 ${
                            isOverdue
                              ? 'bg-red-50/40 border-red-200'
                              : isWarning
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] text-slate-400 font-semibold">{task.id}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${dueInfo.badgeClass}`}>
                              <ClockIcon className="w-2.5 h-2.5" />
                              <span>{dueInfo.label}</span>
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-slate-900 truncate">{task.title}</h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">Assigned to {task.assignee}</p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                            <span>Due {task.dueDate}</span>
                            <span className="capitalize font-medium text-slate-600">{task.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                    No active tasks with due dates in this project. Assign dates in the Kanban board to track deadlines here.
                  </div>
                )}
              </div>

              {/* Deliverable Anchor Board (FR10 - FR13) */}
              <AnchorBoard
                anchors={currentProjectAnchors}
                onUpdateAnchor={handleUpdateAnchor}
              />

              {/* Action Banner to Kanban */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold">Ready to work on tasks?</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Move tasks through To Do, In Progress, Review, and Done on the Kanban board.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('kanban')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm shrink-0"
                >
                  Open Kanban Board →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KANBAN (FR14 - FR29) */}
          {activeTab === 'kanban' && (
            <div className="space-y-4">
              {/* Kanban Toolbar: Task metrics + Filter bar (FR27, FR28, FR29) + "+ New Task" */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Task indicators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Project Tasks:</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {projectTasks.length} total
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-feature">
                      <FeatureIcon className="w-3 h-3 text-feature" />
                      {featureCount} features
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-bug">
                      <BugIcon className="w-3 h-3 text-bug" />
                      {bugCount} bugs
                    </span>
                    {(overdueCount > 0 || warningCount > 0) && (
                      <>
                        <span className="text-slate-300">|</span>
                        {overdueCount > 0 && (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#B91C1C]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#B91C1C] animate-pulse" />
                            {overdueCount} overdue
                          </span>
                        )}
                        {warningCount > 0 && (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#D97706]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                            {warningCount} due soon
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* "+ New Task" Button (FR15) */}
                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal('todo')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shrink-0 self-start sm:self-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Task</span>
                  </button>
                </div>

                {/* Filter Controls Bar (FR27, FR28, FR29) */}
                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* FR27: Filter by Team Member */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-500 font-medium">Assignee:</label>
                      <select
                        value={filterAssignee || 'all'}
                        onChange={(e) => setFilterAssignee(e.target.value === 'all' ? null : e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                      >
                        <option value="all">All Members</option>
                        {projectMembers.map((member) => (
                          <option key={member} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* FR28: Filter by Type */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-500 font-medium">Type:</label>
                      <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setFilterType('all')}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                            filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType('feature')}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                            filterType === 'feature' ? 'bg-white text-feature shadow-2xs' : 'text-slate-500 hover:text-feature'
                          }`}
                        >
                          Features
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterType('bug')}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                            filterType === 'bug' ? 'bg-white text-bug shadow-2xs' : 'text-slate-500 hover:text-bug'
                          }`}
                        >
                          Bugs
                        </button>
                      </div>
                    </div>

                    {/* FR29: Filter by Due Date Status */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-500 font-medium">Due Date:</label>
                      <select
                        value={filterDueStatus}
                        onChange={(e) => setFilterDueStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="overdue">Overdue</option>
                        <option value="due24">Due &lt;24h</option>
                        <option value="safe">Due &gt;24h / Safe</option>
                        <option value="none">No Due Date</option>
                      </select>
                    </div>
                  </div>

                  {isFiltering && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterAssignee(null);
                        setFilterType('all');
                        setFilterDueStatus('all');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Team Activity Section (in Kanban) */}
              <TeamActivitySection
                team={projectMembers}
                projectTasks={projectTasks}
                filterAssignee={filterAssignee}
                onToggleFilter={setFilterAssignee}
              />

              {/* Kanban Four-Column Board (FR14) */}
              <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start pb-6">
                {STAGES.map((stage) => {
                  const stageTasks = displayedTasks.filter((t) => t.status === stage.id);
                  return (
                    <section
                      key={stage.id}
                      className="bg-slate-100/80 rounded-xl p-3 border border-slate-200/70 flex flex-col"
                    >
                      <div className="flex items-center justify-between px-1 py-1 mb-2.5">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            {stage.label}
                          </h2>
                          <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1.5 rounded-full text-[11px] font-semibold bg-slate-200/90 text-slate-700">
                            {stageTasks.length}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenCreateModal(stage.id)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/60 transition-colors"
                          title={`Add task to ${stage.label}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-2.5 min-h-[120px]">
                        {stageTasks.length > 0 ? (
                          stageTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onSelect={handleOpenEditModal}
                              onHandoff={handleHandoff}
                              onMoveTask={handleMoveTask}
                              onCopyPrompt={handleCopyPromptContext}
                              isCopied={copiedTaskId === task.id}
                              teamMembers={projectMembers}
                            />
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-28 rounded-lg border-2 border-dashed border-slate-300/80 p-4 text-center text-xs text-slate-400 font-medium">
                            {isFiltering
                              ? `No matching tasks in ${stage.label}`
                              : 'Nothing here yet, continue coding'}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </main>
            </div>
          )}

          {/* TAB 3: MEMBERS (FR35 - FR39) - Team Activity removed per user request */}
          {activeTab === 'members' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Project Management & Member Invite Bar (FR37 & FR38) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-lg font-bold shrink-0">
                    👑
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Project Manager
                      </span>
                      <span className="text-xs text-slate-400">Creator Role (FR36, FR37)</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {projectManager}
                    </h3>
                  </div>
                </div>

                {/* Invite New Member Form (FR38) */}
                <form onSubmit={handleInviteMember} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="New member name..."
                    className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 w-48"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Invite Member</span>
                  </button>
                </form>
              </div>

              {/* Members Detailed Roster & Workload Breakdown Cards (Retained and enhanced!) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {projectMembers.map((member) => {
                  const memberTasks = projectTasks.filter((t) => t.assignee === member);
                  const inProgressTasks = memberTasks.filter((t) => t.status === 'in-progress');
                  const todoTasks = memberTasks.filter((t) => t.status === 'todo');
                  const reviewTasks = memberTasks.filter((t) => t.status === 'review');
                  const completedTasks = memberTasks.filter((t) => t.status === 'done');
                  const colors = getMemberColors(member);
                  const isManager = member === projectManager;

                  return (
                    <div
                      key={member}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Member Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`inline-flex items-center justify-center h-10 w-10 rounded-full border text-sm font-bold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              {getInitials(member)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-slate-900 truncate">
                                  {member}
                                </h3>
                                {isManager && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded" title="Project Manager">
                                    PM
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500">
                                {memberTasks.length} {memberTasks.length === 1 ? 'task' : 'tasks'} assigned
                              </span>
                            </div>
                          </div>

                          {/* Remove Member Button (FR39) */}
                          {!isManager && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title={`Remove ${member} from project (FR39)`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Status Counts Breakdown */}
                        <div className="grid grid-cols-4 gap-1 pt-2 border-t border-slate-100 text-center">
                          <div className="bg-slate-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-slate-700">{todoTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-slate-400">To Do</span>
                          </div>
                          <div className="bg-indigo-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-indigo-700">{inProgressTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-indigo-500">Doing</span>
                          </div>
                          <div className="bg-amber-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-amber-700">{reviewTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-amber-500">Review</span>
                          </div>
                          <div className="bg-emerald-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-emerald-700">{completedTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-emerald-500">Done</span>
                          </div>
                        </div>

                        {/* Assigned Tasks List */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                            Assigned Tasks:
                          </span>
                          {memberTasks.length > 0 ? (
                            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                              {memberTasks.map((task) => (
                                <li
                                  key={task.id}
                                  onClick={() => handleOpenEditModal(task)}
                                  className="text-xs p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-200/60 flex items-center justify-between gap-2 transition-colors"
                                >
                                  <span className="truncate font-medium text-slate-800">{task.title}</span>
                                  <span className="text-[10px] font-semibold text-slate-500 uppercase shrink-0">
                                    {task.status}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No tasks currently assigned</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFilterAssignee(member);
                          setActiveTab('kanban');
                        }}
                        className="w-full py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        View on Kanban Board →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal for Add, Edit, Delete (FR15 - FR17, FR30 - FR34) */}
      <TaskModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialTask={modalState.task}
        defaultStatus={modalState.defaultStatus}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onCopyPrompt={handleCopyPromptContext}
        isCopied={copiedTaskId === (modalState.task?.id || 'NEW-TASK')}
        teamMembers={projectMembers}
      />

      {/* Toast Notification */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 transition-all duration-200"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
          </span>
          <p className="text-sm font-medium pr-1">{activeToast}</p>
          <button
            type="button"
            onClick={() => setActiveToast(null)}
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
