import { useState, useEffect, useRef } from 'react';

/**
 * Vibecoding Project Tracker
 *
 * Core Features:
 * - Project Management (Create, Edit name, Delete, Sidebar listing, Switch projects)
 * - Project Access Control (Only project members have access to view and manage projects)
 * - Landing / Login Screen (Profile selection portal on website open and logout)
 * - Project Invite Code & Join Flow (Random string code; join projects via sidebar)
 * - Project Manager Role Management (Promote team members to PM, Demote PMs)
 * - Account Deletion (Available once logged in via top-right account menu)
 * - Project Dashboard (Side-by-side Project Overview & Upcoming Deadlines, Deliverables above the fold)
 * - Kanban Board (4 fixed columns, Task CRUD, Quick column movement, Member assignment, Due date urgency, Filters)
 * - AI Context (Prompts & generated output, AI model selector, Edit context, 1-click Copy, Markdown formatting)
 * - Team Management (Project members roster, Clear PM identification, Remove members)
 * - User Account System (Prototype account switcher in top bar, switch between team profiles)
 */

export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TEAM = ['Saayam Mehmood', 'Teammate B', 'Teammate C'];

export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

export function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const INITIAL_PROJECTS = [
  {
    id: 'proj-hackathon',
    name: 'Hackathon Project Tracker',
    createdAt: '2026-10-20',
    managers: ['Saayam Mehmood'],
    manager: 'Saayam Mehmood',
    members: ['Saayam Mehmood', 'Teammate B', 'Teammate C'],
    memberJoinDates: {
      'Saayam Mehmood': '2026-10-20',
      'Teammate B': '2026-10-21',
      'Teammate C': '2026-10-22',
    },
    inviteCode: 'K9X2B7',
  },
  {
    id: 'proj-landing',
    name: 'Marketing & Landing Page',
    createdAt: '2026-10-21',
    managers: ['Saayam Mehmood'],
    manager: 'Saayam Mehmood',
    members: ['Saayam Mehmood', 'Teammate B'],
    memberJoinDates: {
      'Saayam Mehmood': '2026-10-21',
      'Teammate B': '2026-10-22',
    },
    inviteCode: 'W4M8Q1',
  },
];

export const INITIAL_ANCHORS = [
  {
    id: 'presentation',
    projectId: 'proj-hackathon',
    label: 'Presentation',
    url: 'https://docs.google.com/presentation',
    lastModified: '2026-10-24',
  },
  {
    id: 'demo',
    projectId: 'proj-hackathon',
    label: 'Demo',
    url: 'https://24028511-vibecoding-project-tracker.vercel.app/',
    lastModified: '2026-10-25',
  },
  {
    id: 'report',
    projectId: 'proj-hackathon',
    label: 'Report',
    url: null,
    lastModified: null,
  },
  {
    id: 'documentation',
    projectId: 'proj-hackathon',
    label: 'Documentation',
    url: 'https://github.com/Soyam1105/24028511-vibecoding-project-tracker',
    lastModified: '2026-10-26',
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

export function getProjectManagers(project) {
  if (!project) return [];
  if (Array.isArray(project.managers) && project.managers.length > 0) {
    return project.managers;
  }
  return [project.manager || 'Saayam Mehmood'];
}

export function isProjectManager(project, user) {
  return getProjectManagers(project).includes(user);
}

export function getMemberJoinedDate(project, member) {
  if (project?.memberJoinDates && project.memberJoinDates[member]) {
    return project.memberJoinDates[member];
  }
  const initProject = INITIAL_PROJECTS.find((p) => p.id === project?.id);
  if (initProject?.memberJoinDates && initProject.memberJoinDates[member]) {
    return initProject.memberJoinDates[member];
  }
  if (project?.createdAt) {
    return project.createdAt;
  }
  return '2026-10-20';
}

/**
 * Format any date string (ISO or timestamp) to DD/MM/YYYY format
 */
export function formatDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  const matchIso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (matchIso) {
    const [, year, month, day] = matchIso;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return trimmed;
}

export function getDueStatus(dueDate, status) {
  if (status === 'done') {
    return {
      state: 'neutral',
      label: 'Completed',
      badgeClass: 'bg-slate-100 text-[#334155] border-slate-300 font-medium',
      tintClass: 'bg-slate-50/50 border-slate-200',
      pillClass: 'text-[#334155]',
      daysDiff: null,
    };
  }

  if (!dueDate) {
    return {
      state: 'none',
      label: 'No due date',
      badgeClass: 'bg-slate-100 text-[#334155] border-slate-300 font-medium',
      tintClass: 'bg-white border-slate-200/90',
      pillClass: 'text-[#334155]',
      daysDiff: null,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let year, month, day;
  if (dueDate.includes('/')) {
    const parts = dueDate.split('/').map(Number);
    if (parts.length === 3) {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
  } else if (dueDate.includes('-')) {
    const parts = dueDate.split('-').map(Number);
    if (parts.length === 3) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    }
  }

  if (!year || !month || !day) {
    return {
      state: 'none',
      label: 'No due date',
      badgeClass: 'bg-slate-100 text-[#334155] border-slate-300 font-medium',
      tintClass: 'bg-white border-slate-200/90',
      pillClass: 'text-[#334155]',
      daysDiff: null,
    };
  }

  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      state: 'overdue',
      label: overdueDays === 1 ? '1 day overdue' : `${overdueDays} days overdue`,
      badgeClass: 'bg-red-50 text-[#991B1B] border-red-300 font-semibold',
      tintClass: 'bg-red-50/30 border-red-200 hover:border-red-300',
      pillClass: 'text-[#991B1B]',
      daysDiff: diffDays,
    };
  }

  if (diffDays <= 1) {
    return {
      state: 'warning',
      label: diffDays === 0 ? 'Due today (<24h)' : 'Due tomorrow (<24h)',
      badgeClass: 'bg-amber-50 text-[#92400E] border-amber-300 font-semibold',
      tintClass: 'bg-amber-50/30 border-amber-200 hover:border-amber-300',
      pillClass: 'text-[#92400E]',
      daysDiff: diffDays,
    };
  }

  return {
    state: 'safe',
    label: `Due in ${diffDays} days`,
    badgeClass: 'bg-emerald-50 text-[#166534] border-emerald-300 font-medium',
    tintClass: 'bg-white border-slate-200/90 hover:border-slate-300',
    pillClass: 'text-[#166534]',
    daysDiff: diffDays,
  };
}

export function formatContextTime(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
    task.dueDate ? `**Due Date:** ${formatDate(task.dueDate)}` : null,
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

export function LockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
 * Markdown preview formatter
 */
function MarkdownPreview({ content }) {
  if (!content || !content.trim()) {
    return <p className="text-xs text-slate-500 italic">No prompt context or notes provided.</p>;
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
 * Landing / Login Screen for Prototype User Authentication
 * Note: Profile deletion is strictly available inside the app once logged in.
 */
function LandingLoginScreen({ accounts, projects, userEmails = {}, onSelectUser, onAddUser }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Logs into the main account (Saayam Mehmood) as requested
    onSelectUser('Saayam Mehmood');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    onAddUser(customName.trim(), customEmail.trim());
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-100/60 via-indigo-50/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[500px] h-[300px] bg-purple-100/40 blur-3xl rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">Vibecoding Tracker</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Prototype Access Portal</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 text-slate-700 shadow-2xs border border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New User</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-lg w-full mx-auto px-6 -mt-2 sm:-mt-4 pb-12 space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Sign In to Vibecoding Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Enter your credentials to access your projects, Kanban boards, and AI prompt context briefings.
          </p>
        </div>

        {/* Primary Login Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-8 shadow-sm space-y-5">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. saayam@example.com"
                className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 px-4 py-3 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">
                  Default: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[10px]">password</code>
                </span>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="password"
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 px-4 py-3 pr-11 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <span>Sign In</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-sm text-slate-600">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded px-1"
            >
              Create New Account
            </button>
          </div>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Or quick sign in as demo profile
            </h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {accounts.map((user) => {
              const colors = getMemberColors(user);
              return (
                <button
                  key={user}
                  type="button"
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all text-left group shadow-2xs hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <span
                    className={`inline-flex items-center justify-center h-9 w-9 rounded-lg border text-xs font-bold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}
                    aria-hidden="true"
                  >
                    {getInitials(user)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {user}
                    </span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      {userEmails[user] || 'Team Member'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Create New User Modal Dialog */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-user-modal-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 id="create-user-modal-heading" className="text-base font-bold text-slate-900">Create New User</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enter your name and email to create an account and sign in</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="Close dialog"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="landing-modal-full-name" className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="landing-modal-full-name"
                  type="text"
                  required
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 px-3 py-2 text-xs rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="landing-modal-email-addr" className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="landing-modal-email-addr"
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 px-3 py-2 text-xs rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label htmlFor="landing-modal-pwd" className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="landing-modal-pwd"
                  type="password"
                  placeholder="password"
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 px-3 py-2 text-xs rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Create Account &amp; Sign In →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Project Sidebar with Create, Join, Edit name, Delete, and List (No description field)
 */
function ProjectSidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onJoinProject,
  onEditProject,
  onDeleteProject,
  tasks,
  isOpen,
  onCloseMobile,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');

  // Project editing state
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName.trim());
    setNewProjectName('');
    setIsCreating(false);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    onJoinProject(inviteCodeInput.trim().toUpperCase());
    setInviteCodeInput('');
    setIsJoining(false);
  };

  const handleStartEdit = (project, e) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onEditProject(editingProjectId, editName.trim());
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

        {/* Projects Section Header with Join and New buttons */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              My Projects
            </span>
            <span className="text-[10px] text-slate-600 font-semibold">({projects.length})</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Join Project button */}
            <button
              type="button"
              onClick={() => {
                setIsJoining(true);
                setIsCreating(false);
                setEditingProjectId(null);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Join project using invite code"
              aria-label="Join project using invite code"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Join</span>
            </button>

            {/* Create Project button */}
            <button
              type="button"
              onClick={() => {
                setIsCreating(true);
                setIsJoining(false);
                setEditingProjectId(null);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Create new project"
              aria-label="Create new project"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Join Project with Invite Code Form */}
        {isJoining && (
          <form onSubmit={handleJoinSubmit} className="p-3 bg-indigo-50/70 border-b border-indigo-200 space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-indigo-950 mb-0.5">
                Enter Invite Code
              </label>
              <input
                type="text"
                autoFocus
                required
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. K9X2B7"
                className="w-full px-2.5 py-1 text-xs font-mono uppercase bg-white border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-600 tracking-wider"
              />
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsJoining(false);
                  setInviteCodeInput('');
                }}
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-2xs"
              >
                Join Project
              </button>
            </div>
          </form>
        )}

        {/* Create Project Form (Name only - no description) */}
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

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectName('');
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

        {/* Edit Project Inline Form (Name only - no description) */}
        {editingProjectId && (
          <form onSubmit={handleSaveEdit} className="p-3 bg-indigo-50/50 border-b border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Rename Project
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
                Save
              </button>
            </div>
          </form>
        )}

        {/* Projects List (Names only) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.length > 0 ? (
            projects.map((project) => {
              const isSelected = project.id === activeProjectId;
              const isEditing = editingProjectId === project.id;
              const projectTaskCount = tasks.filter(
                (t) => (t.projectId || projects[0]?.id) === project.id
              ).length;

              return (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select project ${project.name}`}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => {
                    onSelectProject(project.id);
                    onCloseMobile();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(project.id);
                      onCloseMobile();
                    }
                  }}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-2xs border border-indigo-200/80'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  } ${isEditing ? 'ring-2 ring-indigo-400' : ''}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderIcon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="block truncate">{project.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`min-w-[18px] h-4.5 px-1.5 rounded-full text-[10px] font-semibold flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-200/70 text-indigo-900'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                      aria-label={`${projectTaskCount} tasks`}
                    >
                      {projectTaskCount}
                    </span>

                    {/* Edit Project Button */}
                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(project, e)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-500 hover:text-indigo-600 p-0.5 rounded transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                      title="Rename project"
                      aria-label={`Rename project ${project.name}`}
                    >
                      <EditIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    {/* Delete Project Button */}
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-500 hover:text-red-600 p-0.5 rounded transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                        title="Delete project"
                        aria-label={`Delete project ${project.name}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-600 border border-dashed border-slate-300 rounded-lg space-y-1">
              <p>No accessible projects.</p>
              <p className="text-[10px] text-slate-500">Click <strong>Join</strong> above to enter an invite code, or <strong>New</strong> to create one.</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/**
 * AnchorBoard Component
 */
function AnchorBoard({ anchors, onUpdateAnchor }) {
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editDate, setEditDate] = useState('');

  const completedCount = anchors.filter((a) => Boolean(a.url && a.url.trim())).length;

  const handleStartEdit = (anchor) => {
    setEditingId(anchor.id);
    setEditUrl(anchor.url || '');
    setEditDate(anchor.lastModified || new Date().toISOString().slice(0, 10));
  };

  const handleSave = (id) => {
    const trimmed = editUrl.trim();
    const saveDate = trimmed ? (editDate || new Date().toISOString().slice(0, 10)) : null;
    onUpdateAnchor(id, trimmed || null, saveDate);
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Anchor Deliverables
          </h2>
          <span className="text-xs text-slate-500">· Final Project Pins</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium">
            Progress: <span className="font-semibold text-slate-900">{completedCount} of {anchors.length}</span> linked
          </span>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={anchors.length} aria-label="Deliverables progress">
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
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}
                    aria-hidden="true"
                  >
                    <AnchorIcon id={anchor.id} className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {anchor.label}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                        isLinked ? 'text-emerald-800' : 'text-slate-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isLinked ? 'bg-emerald-600' : 'bg-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      {isLinked ? 'Linked' : 'Pending Link'}
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(anchor)}
                    className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title={`Edit ${anchor.label} link`}
                    aria-label={`Edit ${anchor.label} link`}
                  >
                    <EditIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2 pt-1">
                  <div>
                    <label htmlFor={`deliverable-url-${anchor.id}`} className="sr-only">URL for {anchor.label}</label>
                    <input
                      id={`deliverable-url-${anchor.id}`}
                      type="url"
                      autoFocus
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, anchor.id)}
                      placeholder="https://..."
                      aria-label={`Deliverable link URL for ${anchor.label}`}
                      className="w-full text-xs px-2 py-1.5 border border-indigo-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1 text-[10px] text-slate-700">
                      <label htmlFor={`deliverable-date-${anchor.id}`} className="shrink-0 font-medium">Date ({formatDate(editDate)}):</label>
                      <input
                        id={`deliverable-date-${anchor.id}`}
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-2 py-0.5 text-[11px] text-slate-600 hover:text-slate-800 rounded hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(anchor.id)}
                        className="px-2 py-0.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  {isLinked ? (
                    <a
                      href={anchor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-medium truncate max-w-full hover:underline group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                      title={anchor.url}
                      aria-label={`Open ${anchor.label} link (opens in new tab)`}
                    >
                      <span className="truncate">{anchor.url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLinkIcon className="w-3 h-3 shrink-0 text-indigo-500 group-hover:text-indigo-700" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(anchor)}
                      className="text-xs text-slate-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                      aria-label={`Add deliverable URL for ${anchor.label}`}
                    >
                      <span>+ Add deliverable URL</span>
                    </button>
                  )}
                </div>
              )}

              {/* Last Modified Date Footer */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-600">
                <span className="flex items-center gap-1 text-slate-600">
                  <ClockIcon className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  <span>Last modified:</span>
                </span>
                <span className="font-semibold text-slate-800">
                  {anchor.lastModified ? formatDate(anchor.lastModified) : (isLinked ? '24/10/2026' : 'Never')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * TaskCard Component with Quick Move, Handoff, Drag & Drop, and Urgency Indication
 */
function TaskCard({
  task,
  onSelect,
  onHandoff,
  onCopyPrompt,
  onMoveTask,
  isCopied,
  teamMembers,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  const isBug = task.type === 'bug';
  const ownerColors = getMemberColors(task.assignee);
  const dueInfo = getDueStatus(task.dueDate, task.status);
  const hasContext = Boolean(task.context && task.context.trim().length > 0);
  const dragActiveRef = useRef(false);

  const currentStageIndex = STAGES.findIndex((s) => s.id === task.status);
  const prevStage = currentStageIndex > 0 ? STAGES[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < STAGES.length - 1 ? STAGES[currentStageIndex + 1] : null;

  return (
    <article
      draggable={true}
      onDragStart={(e) => {
        dragActiveRef.current = true;
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart && onDragStart(task.id);
      }}
      onDragEnd={() => {
        setTimeout(() => {
          dragActiveRef.current = false;
        }, 120);
        onDragEnd && onDragEnd();
      }}
      onClick={() => {
        if (dragActiveRef.current) return;
        onSelect && onSelect(task);
      }}
      className={`rounded-lg border p-3.5 shadow-sm hover:shadow transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2.5 text-left group border-l-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
        isBug ? 'border-l-bug' : 'border-l-feature'
      } ${dueInfo.tintClass} ${
        isDragging ? 'opacity-40 scale-[0.98] border-dashed border-indigo-400 shadow-none' : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}, type: ${task.type}, status: ${task.status}, assigned to: ${task.assignee}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(task);
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              isBug
                ? 'bg-red-50 text-red-800 border border-red-300'
                : 'bg-sky-50 text-sky-800 border border-sky-300'
            }`}
          >
            {isBug ? <BugIcon className="w-3 h-3 text-red-700" aria-hidden="true" /> : <FeatureIcon className="w-3 h-3 text-sky-700" aria-hidden="true" />}
            <span>{task.type}</span>
          </span>
          {hasContext && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200/90 px-2.5 py-1 rounded-md"
              title={`AI Context attached (${task.contextTool || 'General'})`}
              aria-label={`AI Context attached: ${task.contextTool || 'General'}`}
            >
              <PromptContextIcon className="w-3 h-3 text-indigo-700" aria-hidden="true" />
              <span>{task.contextTool || 'AI'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Column Shift */}
          <div className="flex items-center bg-slate-100 rounded-md p-1 gap-1 border border-slate-200" onClick={(e) => e.stopPropagation()}>
            {prevStage && (
              <button
                type="button"
                onClick={() => onMoveTask(task.id, prevStage.id)}
                className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                title={`Move to ${prevStage.label}`}
                aria-label={`Move task ${task.title} to ${prevStage.label}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {nextStage && (
              <button
                type="button"
                onClick={() => onMoveTask(task.id, nextStage.id)}
                className="p-1 rounded text-slate-600 hover:text-indigo-700 hover:bg-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
                title={`Move to ${nextStage.label}`}
                aria-label={`Move task ${task.title} to ${nextStage.label}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {task.dueDate && (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] border ${dueInfo.badgeClass}`}
            title={`Due date: ${formatDate(task.dueDate)} (${dueInfo.label})`}
          >
            <ClockIcon className="w-3 h-3 shrink-0" />
            <span>{dueInfo.label} ({formatDate(task.dueDate)})</span>
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
            title="Hand off task to a teammate"
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
 * TaskModal Component supporting Markdown preview and AI Context
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-heading"
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 id="task-modal-heading" className="text-base font-bold text-slate-900">
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            {mode === 'edit' && (
              <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                {initialTask?.id}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            title="Close modal (Esc)"
            aria-label="Close task dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="task-modal-title-input" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              id="task-modal-title-input"
              type="text"
              required
              autoFocus
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement user authentication"
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          <div>
            <label htmlFor="task-modal-desc-input" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              id="task-modal-desc-input"
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details, acceptance criteria, or vibe notes..."
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Type
              </span>
              <div role="radiogroup" aria-label="Task type" className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.type === 'feature'}
                  onClick={() => setFormData({ ...formData, type: 'feature' })}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    formData.type === 'feature'
                      ? 'bg-sky-50 text-sky-800 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FeatureIcon className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                  <span>Feature</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.type === 'bug'}
                  onClick={() => setFormData({ ...formData, type: 'bug' })}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    formData.type === 'bug'
                      ? 'bg-red-50 text-red-800 border-red-400 ring-1 ring-red-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <BugIcon className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                  <span>Bug</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="task-modal-status-select" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                id="task-modal-status-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
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
              <label htmlFor="task-modal-assignee-select" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center h-8 w-8 rounded-full border text-xs font-bold shrink-0 ${selectedOwnerColors.bg} ${selectedOwnerColors.text} ${selectedOwnerColors.border}`}
                  aria-hidden="true"
                >
                  {getInitials(formData.assignee)}
                </span>
                <select
                  id="task-modal-assignee-select"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
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
                <label htmlFor="task-modal-duedate-input" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Due Date {formData.dueDate ? `(${formatDate(formData.dueDate)})` : ''}
                </label>
                {formData.dueDate && modalDueInfo.state !== 'none' && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${modalDueInfo.badgeClass}`}>
                    <ClockIcon className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
                    {modalDueInfo.label}
                  </span>
                )}
              </div>
              <input
                id="task-modal-duedate-input"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <label htmlFor="task-modal-context-input" className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <PromptContextIcon className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                  Prompt Context
                </label>
                <span className="text-[11px] text-slate-500">· Curated briefing for AI / handoffs</span>
              </div>
              {initialTask?.contextUpdatedAt && mode === 'edit' && (
                <span className="text-[10px] text-slate-500 font-medium">
                  Updated {formatContextTime(initialTask.contextUpdatedAt)}
                </span>
              )}
            </div>

            <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Tool:</span>
                <div role="radiogroup" aria-label="AI Tool" className="flex flex-wrap gap-1">
                  {CONTEXT_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      role="radio"
                      aria-checked={formData.contextTool === tool}
                      onClick={() => setFormData({ ...formData, contextTool: tool })}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600 ${
                        formData.contextTool === tool
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Markdown View Toggle */}
                <div className="bg-slate-100 p-0.5 rounded flex items-center border border-slate-200">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={contextMode === 'write'}
                    onClick={() => setContextMode('write')}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600 ${
                      contextMode === 'write' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={contextMode === 'preview'}
                    onClick={() => setContextMode('preview')}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600 ${
                      contextMode === 'preview' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 transition-colors shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                  title="Copy as formatted Prompt Context"
                  aria-label="Copy prompt context to clipboard"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3 h-3 text-indigo-600" aria-hidden="true" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {contextMode === 'write' ? (
              <textarea
                id="task-modal-context-input"
                rows="4"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Paste the prompts, constraints, or configurations used for this task (Markdown supported: # headers, **bold**, `code`, etc)..."
                aria-label="AI Prompt Context markdown"
                className="w-full font-mono text-xs px-3 py-2.5 rounded-md border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 leading-relaxed resize-none"
              />
            ) : (
              <div className="p-3 rounded-md border border-slate-200 bg-slate-50/50 min-h-[96px] max-h-48 overflow-y-auto" tabIndex={0} aria-label="Markdown prompt context preview">
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
  const [projects, setProjects] = useLocalStorage('vibetracker.projects', INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useLocalStorage('vibetracker.active_project', 'proj-hackathon');
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', INITIAL_TASKS);
  const [anchors, setAnchors] = useLocalStorage('vibetracker.anchors', INITIAL_ANCHORS);

  // Prototype User Account System: active user + account list
  const [currentUser, setCurrentUser] = useLocalStorage('vibetracker.current_user', 'Saayam Mehmood');
  const [accounts, setAccounts] = useLocalStorage('vibetracker.accounts', TEAM);
  const [userEmails, setUserEmails] = useLocalStorage('vibetracker.user_emails', {
    'Saayam Mehmood': 'saayam@example.com',
    'Teammate B': 'teammate.b@example.com',
    'Teammate C': 'teammate.c@example.com',
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);
  const userMenuRef = useRef(null);

  // Landing / Login Screen state (prompt on session start or when logged out)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return window.sessionStorage.getItem('vibetracker.session_active') === 'true';
    } catch {
      return false;
    }
  });

  // Active view tab: 'dashboard' | 'kanban' | 'members'
  const [activeTab, setActiveTab] = useState('dashboard');

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
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverStageId, setDragOverStageId] = useState(null);

  // Kanban filters
  const [filterAssignee, setFilterAssignee] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'feature' | 'bug'
  const [filterDueStatus, setFilterDueStatus] = useState('all'); // 'all' | 'overdue' | 'due24' | 'safe'

  // Close user account dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Available prototype accounts
  const availableAccounts = Array.from(new Set([...accounts, ...TEAM]));

  // Project Access Control: Only projects where currentUser is in members or is a manager
  const accessibleProjects = projects.filter((project) => {
    const members = project.members && project.members.length > 0 ? project.members : TEAM;
    return members.includes(currentUser) || isProjectManager(project, currentUser);
  });

  // Ensure currentProject is an accessible project or fallback to first accessible
  const currentProject = accessibleProjects.find((p) => p.id === activeProjectId) || accessibleProjects[0] || null;

  // Derive dynamic project members and managers for the active project
  const projectMembers = currentProject?.members && currentProject.members.length > 0
    ? currentProject.members
    : (currentProject ? [currentUser] : []);
  const projectManagers = getProjectManagers(currentProject);
  const isCurrentUserPM = isProjectManager(currentProject, currentUser);

  // Filter tasks belonging to current active project
  const projectTasks = currentProject
    ? tasks.filter((t) => (t.projectId || projects[0]?.id) === currentProject.id)
    : [];

  // Filter anchors for active project
  const currentProjectAnchors = (() => {
    if (!currentProject) return [];
    const existing = anchors.filter((a) => (a.projectId || projects[0]?.id) === currentProject.id);
    const slots = [
      { id: 'presentation',  label: 'Presentation' },
      { id: 'demo',          label: 'Demo' },
      { id: 'report',        label: 'Report' },
      { id: 'documentation', label: 'Documentation' },
    ];
    return slots.map((slot) => {
      const match = existing.find((a) => a.id === slot.id);
      const initMatch = INITIAL_ANCHORS.find((a) => a.id === slot.id && a.projectId === currentProject.id);
      return {
        id: slot.id,
        projectId: currentProject.id,
        label: slot.label,
        url: match?.url !== undefined ? match.url : (initMatch?.url || null),
        lastModified: match?.lastModified || initMatch?.lastModified || (match?.url ? '2026-10-24' : null),
      };
    });
  })();

  const featureCount = projectTasks.filter((t) => t.type === 'feature').length;
  const bugCount = projectTasks.filter((t) => t.type === 'bug').length;
  const doneCount = projectTasks.filter((t) => t.status === 'done').length;
  const remainingCount = projectTasks.length - doneCount;
  const overdueTasks = projectTasks.filter((t) => getDueStatus(t.dueDate, t.status).state === 'overdue');
  const overdueCount = overdueTasks.length;

  // Upcoming deadlines for Dashboard: sort by due date, show first 3 tasks, but ensure all overdue & <24h tasks are shown
  const upcomingDeadlineTasks = (() => {
    const parseDueDate = (d) => {
      if (!d) return 0;
      if (d.includes('/')) {
        const [day, mon, yr] = d.split('/').map(Number);
        return new Date(yr, mon - 1, day).getTime();
      }
      return new Date(d).getTime();
    };
    const activeTasksWithDue = projectTasks
      .filter((t) => t.status !== 'done' && t.dueDate)
      .sort((a, b) => (parseDueDate(a.dueDate) > parseDueDate(b.dueDate) ? 1 : -1));

    const urgentCount = activeTasksWithDue.filter((t) => {
      const status = getDueStatus(t.dueDate, t.status);
      return status.state === 'overdue' || status.state === 'warning';
    }).length;

    const limit = Math.max(3, urgentCount);
    return activeTasksWithDue.slice(0, limit);
  })();

  const showToast = (message) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast((current) => (current === message ? null : current));
    }, 3500);
  };

  // Create new project (Name only - random string invite code generated)
  const handleCreateProject = (name) => {
    const inviteCode = generateRandomCode(6);
    const today = new Date().toISOString().slice(0, 10);
    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      createdAt: today,
      managers: [currentUser],
      manager: currentUser,
      members: [currentUser],
      memberJoinDates: {
        [currentUser]: today,
      },
      inviteCode,
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(newProj.id);
    setActiveTab('dashboard');
    showToast(`Project "${name}" created (Code: ${inviteCode})`);
  };

  // Join existing project using Invite Code
  const handleJoinProject = (code) => {
    const targetCode = code.trim().toUpperCase();
    const foundProject = projects.find((p) => {
      const projCode = p.inviteCode || 'K9X2B7';
      return projCode.toUpperCase() === targetCode;
    });

    if (!foundProject) {
      showToast('Invalid invite code. Please check and try again.');
      return;
    }

    const existingMembers = foundProject.members || [foundProject.manager || 'Saayam Mehmood'];
    if (existingMembers.includes(currentUser)) {
      setActiveProjectId(foundProject.id);
      showToast(`You are already a member of "${foundProject.name}"`);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const updatedMembers = [...existingMembers, currentUser];
    const updatedJoinDates = {
      ...(foundProject.memberJoinDates || {}),
      [currentUser]: today,
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === foundProject.id ? { ...p, members: updatedMembers, memberJoinDates: updatedJoinDates } : p
      )
    );
    setActiveProjectId(foundProject.id);
    setActiveTab('dashboard');
    showToast(`Joined project "${foundProject.name}"!`);
  };

  // Copy Project Invite Code to Clipboard
  const handleCopyInviteCode = async (code) => {
    const codeToCopy = code || currentProject?.inviteCode || 'K9X2B7';
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(codeToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = codeToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedInviteCode(true);
      showToast(`Invite code ${codeToCopy} copied to clipboard`);
      setTimeout(() => setCopiedInviteCode(false), 2500);
    } catch {
      showToast(`Invite code: ${codeToCopy}`);
    }
  };

  // Regenerate Project Invite Code (PM only)
  const handleRegenerateInviteCode = () => {
    if (!currentProject || !isCurrentUserPM) return;
    const newCode = generateRandomCode(6);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id ? { ...p, inviteCode: newCode } : p
      )
    );
    showToast(`New invite code generated: ${newCode}`);
  };

  // Promote team member to Project Manager
  const handlePromoteMember = (memberName) => {
    if (!currentProject || !isCurrentUserPM) return;
    const currentManagers = getProjectManagers(currentProject);
    if (currentManagers.includes(memberName)) return;
    const updatedManagers = [...currentManagers, memberName];
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id
          ? { ...p, managers: updatedManagers, manager: updatedManagers[0] }
          : p
      )
    );
    showToast(`${memberName} promoted to Project Manager`);
  };

  // Demote Project Manager to regular member
  const handleDemoteMember = (memberName) => {
    if (!currentProject || !isCurrentUserPM) return;
    const currentManagers = getProjectManagers(currentProject);
    if (currentManagers.length <= 1) {
      alert('A project must have at least one Project Manager.');
      return;
    }
    if (!window.confirm(`Demote ${memberName} from Project Manager to Team Member?`)) {
      return;
    }
    const updatedManagers = currentManagers.filter((m) => m !== memberName);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id
          ? { ...p, managers: updatedManagers, manager: updatedManagers[0] }
          : p
      )
    );
    showToast(`${memberName} demoted to Team Member`);
  };

  // Delete User Account (Available once logged in)
  const handleDeleteAccount = (targetUser = currentUser) => {
    if (
      !window.confirm(
        `Are you sure you want to delete your account "${targetUser}"? This will remove this profile from all project memberships.`
      )
    ) {
      return;
    }

    const updatedAccounts = accounts.filter((a) => a !== targetUser);
    const fallbackList = updatedAccounts.length > 0 ? updatedAccounts : ['Saayam Mehmood'];
    setAccounts(fallbackList);

    // Remove user from all project rosters and reassign management if necessary
    setProjects((prev) =>
      prev.map((p) => {
        const newMembers = (p.members || []).filter((m) => m !== targetUser);
        const newJoinDates = { ...(p.memberJoinDates || {}) };
        delete newJoinDates[targetUser];
        const currentPMs = getProjectManagers(p).filter((m) => m !== targetUser);
        const newPMs = currentPMs.length > 0 ? currentPMs : (newMembers.length > 0 ? [newMembers[0]] : [fallbackList[0]]);
        return {
          ...p,
          members: newMembers.length > 0 ? newMembers : [newPMs[0]],
          memberJoinDates: newJoinDates,
          managers: newPMs,
          manager: newPMs[0],
        };
      })
    );

    // Reassign tasks
    setTasks((prev) =>
      prev.map((t) =>
        t.assignee === targetUser ? { ...t, assignee: fallbackList[0] } : t
      )
    );

    // Clean up stored email
    setUserEmails((prev) => {
      const copy = { ...prev };
      delete copy[targetUser];
      return copy;
    });

    if (targetUser === currentUser) {
      setIsLoggedIn(false);
      setUserMenuOpen(false);
      try {
        window.sessionStorage.removeItem('vibetracker.session_active');
      } catch {}
      setCurrentUser(fallbackList[0]);
      showToast(`Account "${targetUser}" deleted. Signed out.`);
    } else {
      showToast(`Profile "${targetUser}" deleted`);
    }
  };

  // Edit existing project name (No description)
  const handleEditProject = (projId, newName) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projId ? { ...p, name: newName } : p
      )
    );
    showToast(`Project renamed to "${newName}"`);
  };

  // Delete existing project
  const handleDeleteProject = (projId) => {
    if (projects.length <= 1) return;
    if (window.confirm('Delete this project and all its tasks?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projId));
      setTasks((prev) => prev.filter((t) => t.projectId !== projId));
      if (activeProjectId === projId) {
        const remaining = accessibleProjects.filter((p) => p.id !== projId);
        if (remaining.length > 0) {
          setActiveProjectId(remaining[0].id);
        }
      }
      showToast('Project deleted');
    }
  };

  // Remove member from project (revokes access)
  const handleRemoveMember = (memberName) => {
    if (!currentProject) return;
    if (isProjectManager(currentProject, memberName)) {
      alert('Demote the Project Manager to a Team Member before removing them from the project.');
      return;
    }
    if (window.confirm(`Remove ${memberName} from this project? They will no longer have access.`)) {
      const updatedMembers = projectMembers.filter((m) => m !== memberName);
      const updatedJoinDates = { ...(currentProject.memberJoinDates || {}) };
      delete updatedJoinDates[memberName];
      setProjects((prev) =>
        prev.map((p) =>
          p.id === currentProject.id ? { ...p, members: updatedMembers, memberJoinDates: updatedJoinDates } : p
        )
      );
      setTasks((prev) =>
        prev.map((t) =>
          t.projectId === currentProject.id && t.assignee === memberName
            ? { ...t, assignee: projectManagers[0] }
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

  // Move task between columns
  const handleMoveTask = (taskId, targetStatus) => {
    const existing = tasks.find((t) => t.id === taskId);
    if (existing && existing.status === targetStatus) return;
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
    if (!currentProject) return;
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

  const handleUpdateAnchor = (id, newUrl, customDate) => {
    if (!currentProject) return;
    const modifiedDate = customDate || new Date().toISOString().slice(0, 10);
    setAnchors((prev) => {
      const exists = prev.some((a) => a.id === id && (a.projectId || projects[0]?.id) === currentProject.id);
      if (exists) {
        return prev.map((a) =>
          a.id === id && (a.projectId || projects[0]?.id) === currentProject.id
            ? { ...a, url: newUrl, lastModified: newUrl ? modifiedDate : null }
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
          lastModified: newUrl ? modifiedDate : null,
        },
      ];
    });
    showToast(newUrl ? 'Deliverable link updated' : 'Deliverable link removed');
  };

  // Filter tasks based on member, type, and due date status
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
  const currentUserColors = getMemberColors(currentUser);

  // If user has not selected profile yet on open, show Landing Login Screen (No deletion buttons)
  if (!isLoggedIn) {
    return (
      <LandingLoginScreen
        accounts={availableAccounts}
        projects={projects}
        userEmails={userEmails}
        onSelectUser={(userName) => {
          setCurrentUser(userName);
          setIsLoggedIn(true);
          try {
            window.sessionStorage.setItem('vibetracker.session_active', 'true');
          } catch {}
          showToast(`Signed in as ${userName}`);
        }}
        onAddUser={(newUserName, newUserEmail) => {
          setAccounts((prev) => Array.from(new Set([...prev, newUserName])));
          if (newUserEmail) {
            setUserEmails((prev) => ({ ...prev, [newUserName]: newUserEmail }));
          }
          setCurrentUser(newUserName);
          setIsLoggedIn(true);
          try {
            window.sessionStorage.setItem('vibetracker.session_active', 'true');
          } catch {}
          showToast(`Created account and signed in as ${newUserName}`);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar for Projects (Only displays projects accessible to currentUser) */}
      <ProjectSidebar
        projects={accessibleProjects}
        activeProjectId={currentProject?.id || null}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setFilterAssignee(null);
          setFilterType('all');
          setFilterDueStatus('all');
        }}
        onCreateProject={handleCreateProject}
        onJoinProject={handleJoinProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        tasks={tasks}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-700 focus:text-white focus:rounded-lg focus:shadow-xl focus:ring-2 focus:ring-white text-xs font-bold"
      >
        Skip to main content
      </a>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar with Project Breadcrumb, Navigation Tabs, and User Account Switcher */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              title="Open projects sidebar"
              aria-label="Open projects sidebar"
              aria-expanded={mobileSidebarOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Active Project Title */}
            <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
              <span className="text-xs font-semibold text-slate-500 hidden lg:inline uppercase tracking-wider">Project /</span>
              <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
                {currentProject ? currentProject.name : 'No Accessible Project'}
              </h1>
            </div>
          </div>

          {/* Section Navigation Tabs: Dashboard, Kanban, Members */}
          {currentProject && (
            <nav aria-label="Project sections" className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 shrink-0">
              <div role="tablist" aria-label="Project views" className="flex items-center gap-1">
                <button
                  type="button"
                  role="tab"
                  id="tab-dashboard"
                  aria-selected={activeTab === 'dashboard'}
                  aria-controls="panel-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-kanban"
                  aria-selected={activeTab === 'kanban'}
                  aria-controls="panel-kanban"
                  onClick={() => setActiveTab('kanban')}
                  className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    activeTab === 'kanban'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  <span className="hidden sm:inline">Kanban</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-members"
                  aria-selected={activeTab === 'members'}
                  aria-controls="panel-members"
                  onClick={() => setActiveTab('members')}
                  className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                    activeTab === 'members'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="hidden sm:inline">Members</span>
                </button>
              </div>
            </nav>
          )}

          {/* User Account Switcher in Top Right Corner */}
          <div className="relative shrink-0" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label={`User menu for ${currentUser}`}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              title="Switch user account (Prototype)"
            >
              <span
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full border text-[10px] font-bold shrink-0 ${currentUserColors.bg} ${currentUserColors.text} ${currentUserColors.border}`}
              >
                {getInitials(currentUser)}
              </span>
              <div className="text-left hidden md:block min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="block text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                    {currentUser}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" title="Online" />
                </div>
                <span className="block text-[10px] text-slate-600 font-normal leading-tight mt-0.5">
                  {currentProject && isCurrentUserPM ? 'Project Manager' : 'Team Member'}
                </span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu for Switching Accounts & Account Deletion */}
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Active Account Header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Logged In As
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full border text-xs font-bold shrink-0 ${currentUserColors.bg} ${currentUserColors.text} ${currentUserColors.border}`}>
                      {getInitials(currentUser)}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 truncate">{currentUser}</span>
                      {userEmails && userEmails[currentUser] && (
                        <span className="block text-[10px] text-slate-600 truncate">{userEmails[currentUser]}</span>
                      )}
                      <span className="block text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
                        Active Profile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch Account List */}
                <div className="p-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-2 py-1 block">
                    Switch Account
                  </span>
                  <div className="space-y-0.5 mt-0.5 max-h-44 overflow-y-auto">
                    {availableAccounts.map((account) => {
                      const isCurrent = account === currentUser;
                      const colors = getMemberColors(account);
                      const isManager = isProjectManager(currentProject, account);

                      return (
                        <button
                          key={account}
                          type="button"
                          onClick={() => {
                            setCurrentUser(account);
                            setUserMenuOpen(false);
                            showToast(`Switched account to ${account}`);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                            isCurrent
                              ? 'bg-indigo-50 text-indigo-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full border text-[10px] font-bold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>
                              {getInitials(account)}
                            </span>
                            <div className="min-w-0">
                              <span className="block truncate leading-tight">{account}</span>
                              {userEmails && userEmails[account] && (
                                <span className="block text-[10px] text-slate-600 truncate">{userEmails[account]}</span>
                              )}
                              {isManager && (
                                <span className="block text-[9px] text-amber-800 font-normal">Project Manager</span>
                              )}
                            </div>
                          </div>
                          {isCurrent && (
                            <CheckIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions: Log Out / Switch Profile & Delete Account */}
                  <div className="pt-2 mt-1 border-t border-slate-100 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUserMenuOpen(false);
                        try {
                          window.sessionStorage.removeItem('vibetracker.session_active');
                        } catch {}
                        showToast('Logged out');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log Out</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(currentUser)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete My Account</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Tab Content Area with Skip Target */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 md:p-6 focus:outline-none">
          {/* EMPTY STATE: User is not a member of any project */}
          {!currentProject && (
            <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <LockIcon className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">No Accessible Projects</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are signed in as <strong className="text-slate-800">{currentUser}</strong>. People who are not members of a project cannot view or modify its deliverables or tasks.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCreateProject(`New Project (${currentUser.split(' ')[0]})`)}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  + Create New Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const code = window.prompt('Enter project invite code (e.g. K9X2B7):');
                    if (code) handleJoinProject(code);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  Join with Code
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD (Side-by-side Overview & Deadlines, Deliverables immediately visible) */}
          {currentProject && activeTab === 'dashboard' && (
            <div role="tabpanel" id="panel-dashboard" aria-labelledby="tab-dashboard" className="space-y-5 max-w-6xl mx-auto">
              {/* Row 1: Side-by-Side 50/50 Grid (Project Progress & Upcoming Deadlines) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
                {/* Box 1: Project Header & Progress Stats (Half width) */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Active Project
                        </span>
                        <span className="text-xs text-slate-500">Created {formatDate(currentProject.createdAt) || 'recently'}</span>
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                        {currentProject.name}
                      </h2>
                    </div>

                    {/* Completion Rate Pill */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">Done</span>
                        <span className="text-lg font-black text-indigo-600 leading-none">
                          {projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label="Project task completion percentage">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${projectTasks.length > 0 ? (doneCount / projectTasks.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Progress Statistics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                      <span className="text-[11px] text-slate-600 font-medium block">Total Tasks</span>
                      <span className="text-lg font-bold text-slate-900 mt-0.5 block">{projectTasks.length}</span>
                      <span className="text-[10px] text-slate-600 font-medium block whitespace-nowrap">
                        {featureCount} {featureCount === 1 ? 'feat' : 'feats'} · {bugCount} {bugCount === 1 ? 'bug' : 'bugs'}
                      </span>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-lg p-2.5">
                      <span className="text-[11px] text-emerald-800 font-medium block">Completed</span>
                      <span className="text-lg font-bold text-emerald-700 mt-0.5 block">{doneCount}</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Shipped</span>
                    </div>

                    <div className="bg-sky-50/50 border border-sky-200/80 rounded-lg p-2.5">
                      <span className="text-[11px] text-sky-800 font-medium block">Remaining</span>
                      <span className="text-lg font-bold text-sky-700 mt-0.5 block">{remainingCount}</span>
                      <span className="text-[10px] text-sky-700 font-medium">In flight</span>
                    </div>

                    <div className={`rounded-lg p-2.5 border ${
                      overdueCount > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-slate-50 border-slate-200/80 text-slate-900'
                    }`}>
                      <span className={`text-[11px] font-medium block ${overdueCount > 0 ? 'text-red-700 font-semibold' : 'text-slate-600'}`}>
                        Overdue
                      </span>
                      <span className={`text-lg font-bold mt-0.5 block ${overdueCount > 0 ? 'text-red-700' : 'text-slate-900'}`}>
                        {overdueCount}
                      </span>
                      <span className={`text-[10px] ${overdueCount > 0 ? 'text-red-700 font-semibold' : 'text-slate-500'}`}>
                        {overdueCount > 0 ? 'Urgent' : 'All clear'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Box 2: Upcoming Deadlines (Half width side-by-side) */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Upcoming Deadlines
                      </h3>
                      <span className="text-xs text-slate-500">· Schedule monitor</span>
                    </div>
                    <span className="text-xs text-slate-600 font-medium">
                      {upcomingDeadlineTasks.length} scheduled
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-52 space-y-2 pr-1">
                    {upcomingDeadlineTasks.length > 0 ? (
                      upcomingDeadlineTasks.map((task) => {
                        const dueInfo = getDueStatus(task.dueDate, task.status);
                        const isOverdue = dueInfo.state === 'overdue';
                        const isWarning = dueInfo.state === 'warning';

                        return (
                          <div
                            key={task.id}
                            role="button"
                            tabIndex={0}
                            aria-label={`View task ${task.title}, due ${formatDate(task.dueDate) || 'no date'}, status ${task.status}`}
                            onClick={() => handleOpenEditModal(task)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleOpenEditModal(task);
                              }
                            }}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer hover:shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 flex items-center justify-between gap-2.5 ${
                              isOverdue
                                ? 'bg-red-50/50 border-red-200'
                                : isWarning
                                ? 'bg-amber-50/50 border-amber-200'
                                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-slate-900 truncate">{task.title}</h4>
                              <p className="text-[10px] text-slate-600 truncate mt-0.5">Assigned to {task.assignee}</p>
                            </div>

                            <div className="shrink-0 text-right">
                              <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${dueInfo.badgeClass}`}>
                                <ClockIcon className="w-2.5 h-2.5" />
                                <span>{dueInfo.label}</span>
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">{formatDate(task.dueDate)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-5 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                        No active tasks with upcoming deadlines in this project.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Anchor Deliverables Board (Immediately visible above the fold) */}
              <AnchorBoard
                anchors={currentProjectAnchors}
                onUpdateAnchor={handleUpdateAnchor}
              />
            </div>
          )}

          {/* TAB 2: KANBAN */}
          {currentProject && activeTab === 'kanban' && (
            <div role="tabpanel" id="panel-kanban" aria-labelledby="tab-kanban" className="space-y-4">
              {/* Kanban Toolbar */}
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
                    {overdueCount > 0 && (
                      <>
                        <span className="text-slate-300">|</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#B91C1C]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#B91C1C] animate-pulse" />
                          {overdueCount} overdue
                        </span>
                      </>
                    )}
                  </div>

                  {/* "+ New Task" Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal('todo')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 shrink-0 self-start sm:self-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Task</span>
                  </button>
                </div>

                {/* Filter Controls Bar */}
                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Filter by Team Member */}
                    <div className="flex items-center gap-1.5">
                      <label htmlFor="kanban-filter-assignee" className="text-slate-700 font-medium">Assignee:</label>
                      <select
                        id="kanban-filter-assignee"
                        aria-label="Filter tasks by assignee"
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

                    {/* Filter by Type */}
                    <div className="flex items-center gap-1.5">
                      <span id="kanban-filter-type-label" className="text-slate-700 font-medium">Type:</span>
                      <div role="radiogroup" aria-labelledby="kanban-filter-type-label" className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={filterType === 'all'}
                          onClick={() => setFilterType('all')}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                            filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={filterType === 'feature'}
                          onClick={() => setFilterType('feature')}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                            filterType === 'feature' ? 'bg-white text-feature shadow-2xs' : 'text-slate-600 hover:text-feature'
                          }`}
                        >
                          Features
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={filterType === 'bug'}
                          onClick={() => setFilterType('bug')}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                            filterType === 'bug' ? 'bg-white text-bug shadow-2xs' : 'text-slate-600 hover:text-bug'
                          }`}
                        >
                          Bugs
                        </button>
                      </div>
                    </div>

                    {/* Filter by Due Date Status */}
                    <div className="flex items-center gap-1.5">
                      <label htmlFor="kanban-filter-duedate" className="text-slate-700 font-medium">Due Date:</label>
                      <select
                        id="kanban-filter-duedate"
                        aria-label="Filter tasks by due date status"
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

              {/* Kanban Four-Column Board */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start pb-6">
                {STAGES.map((stage) => {
                  const stageTasks = displayedTasks.filter((t) => t.status === stage.id);
                  const isDragOver = dragOverStageId === stage.id;
                  return (
                    <section
                      key={stage.id}
                      aria-label={`${stage.label} stage, ${stageTasks.length} tasks`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragOverStageId(stage.id);
                      }}
                      onDragLeave={(e) => {
                        if (e.currentTarget.contains(e.relatedTarget)) return;
                        if (dragOverStageId === stage.id) setDragOverStageId(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData('text/plain');
                        setDragOverStageId(null);
                        setDraggingTaskId(null);
                        if (taskId) {
                          handleMoveTask(taskId, stage.id);
                        }
                      }}
                      className={`rounded-xl p-3 border flex flex-col transition-all duration-150 ${
                        isDragOver
                          ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm'
                          : 'bg-slate-100/80 border-slate-200/70'
                      }`}
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
                          className="text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-200/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                          aria-label={`Add task to ${stage.label}`}
                          title={`Add task to ${stage.label}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-2.5 min-h-[120px] max-h-[540px] overflow-y-auto pr-1 flex-1">
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
                              isDragging={draggingTaskId === task.id}
                              onDragStart={(id) => setDraggingTaskId(id)}
                              onDragEnd={() => {
                                setDraggingTaskId(null);
                                setDragOverStageId(null);
                              }}
                            />
                          ))
                        ) : (
                          <div className={`flex items-center justify-center h-28 rounded-lg border-2 border-dashed p-4 text-center text-xs font-medium transition-colors ${
                            isDragOver
                              ? 'border-indigo-400 bg-indigo-100/60 text-indigo-700'
                              : 'border-slate-300/80 text-slate-600'
                          }`}>
                            {isDragOver
                              ? `Drop task here for ${stage.label}`
                              : isFiltering
                              ? `No matching tasks in ${stage.label}`
                              : 'Nothing here yet, continue coding'}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERS */}
          {currentProject && activeTab === 'members' && (
            <div role="tabpanel" id="panel-members" aria-labelledby="tab-members" className="space-y-6 max-w-6xl mx-auto">
              {/* Project Management & Invite Code Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-lg font-bold shrink-0">
                    👑
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Project Manager{projectManagers.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                      {projectManagers.join(', ')}
                    </h2>
                  </div>
                </div>

                {/* Random String Project Invite Code Display & Copy */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                      Team Invite Code
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Share with teammates to join from their sidebar
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-white text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 tracking-wider shadow-2xs select-all">
                      {currentProject.inviteCode || 'K9X2B7'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyInviteCode(currentProject.inviteCode || 'K9X2B7')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      aria-label="Copy team invite code"
                      title="Copy invite code"
                    >
                      {copiedInviteCode ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {isCurrentUserPM && (
                      <button
                        type="button"
                        onClick={handleRegenerateInviteCode}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-200/60 text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        aria-label="Generate a new random invite code"
                        title="Generate a new random invite code"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Members Detailed Roster & Workload Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {projectMembers.map((member) => {
                  const memberTasks = projectTasks.filter((t) => t.assignee === member);
                  const inProgressTasks = memberTasks.filter((t) => t.status === 'in-progress');
                  const todoTasks = memberTasks.filter((t) => t.status === 'todo');
                  const reviewTasks = memberTasks.filter((t) => t.status === 'review');
                  const completedTasks = memberTasks.filter((t) => t.status === 'done');
                  const colors = getMemberColors(member);
                  const isManager = isProjectManager(currentProject, member);
                  const isCurrentLoggedIn = member === currentUser;
                  const joinedDate = getMemberJoinedDate(currentProject, member);

                  return (
                    <div
                      key={member}
                      className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                        isCurrentLoggedIn ? 'border-indigo-300 ring-1 ring-indigo-300' : 'border-slate-200'
                      }`}
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
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-sm font-bold text-slate-900 truncate">
                                  {member}
                                </h3>
                                {isManager ? (
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded flex items-center gap-0.5" title="Project Manager">
                                    <span>👑</span>
                                    <span>PM</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                                    Member
                                  </span>
                                )}
                                {isCurrentLoggedIn && (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-600">
                                {memberTasks.length} {memberTasks.length === 1 ? 'task' : 'tasks'} assigned
                              </span>
                            </div>
                          </div>

                          {/* Remove Member Button (Disabled if PM) */}
                          {!isManager && isCurrentUserPM && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member)}
                              className="text-slate-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                              aria-label={`Remove ${member} from project`}
                              title={`Remove ${member} from project`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Member Join Date Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 text-slate-500" aria-hidden="true" />
                            <span>Date Joined:</span>
                          </span>
                          <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {formatDate(joinedDate)}
                          </span>
                        </div>

                        {/* Project Manager Role Promotion / Demotion Controls */}
                        {isCurrentUserPM && !isCurrentLoggedIn && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-700">Role:</span>
                            {isManager ? (
                              <button
                                type="button"
                                onClick={() => handleDemoteMember(member)}
                                className="px-2 py-0.5 text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                                aria-label={`Demote ${member} from Project Manager`}
                                title="Demote to Team Member"
                              >
                                Demote from PM
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handlePromoteMember(member)}
                                className="px-2 py-0.5 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                aria-label={`Promote ${member} to Project Manager`}
                                title="Promote to Project Manager"
                              >
                                👑 Promote to PM
                              </button>
                            )}
                          </div>
                        )}

                        {/* Status Counts Breakdown */}
                        <div className="grid grid-cols-4 gap-1 pt-2 border-t border-slate-100 text-center">
                          <div className="bg-slate-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-slate-700">{todoTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-slate-600">To Do</span>
                          </div>
                          <div className="bg-indigo-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-indigo-700">{inProgressTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-indigo-700">Doing</span>
                          </div>
                          <div className="bg-amber-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-amber-800">{reviewTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-amber-800">Review</span>
                          </div>
                          <div className="bg-emerald-50 p-1.5 rounded">
                            <span className="block text-xs font-bold text-emerald-800">{completedTasks.length}</span>
                            <span className="text-[9px] uppercase font-semibold text-emerald-800">Done</span>
                          </div>
                        </div>

                        {/* Assigned Tasks List */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                            Assigned Tasks:
                          </span>
                          {memberTasks.length > 0 ? (
                            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                              {memberTasks.map((task) => (
                                <li
                                  key={task.id}
                                  role="button"
                                  tabIndex={0}
                                  aria-label={`View task ${task.title}, status ${task.status}`}
                                  onClick={() => handleOpenEditModal(task)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleOpenEditModal(task);
                                    }
                                  }}
                                  className="text-xs p-2 rounded-md bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-200/60 flex items-center justify-between gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                >
                                  <span className="truncate font-medium text-slate-800">{task.title}</span>
                                  <span className="text-[10px] font-semibold text-slate-600 uppercase shrink-0">
                                    {task.status}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-600 italic">No tasks currently assigned</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFilterAssignee(member);
                          setActiveTab('kanban');
                        }}
                        aria-label={`View ${member}'s tasks on Kanban Board`}
                        className="w-full py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      >
                        View on Kanban Board →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Task Modal for Add, Edit, Delete */}
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
