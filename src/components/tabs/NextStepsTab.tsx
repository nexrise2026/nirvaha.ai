import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NextStepTask } from '../../types';
import {
  ListChecks,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  X
} from 'lucide-react';

export const NextStepsTab: React.FC = () => {
  const { t, userProfile, tasks, toggleTask, addTask } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskUrgency, setTaskUrgency] = useState<NextStepTask['urgency']>('Due soon');
  const [taskDueDate, setTaskDueDate] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle.trim(), taskUrgency, taskDueDate || 'Flexible');
    setShowAddModal(false);
    setTaskTitle('');
    setTaskDueDate('');
  };

  const getUrgencyBadge = (urgency: NextStepTask['urgency']) => {
    switch (urgency) {
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        );
      case 'Due soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
            <Clock className="w-3 h-3" />
            Due soon
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            <Calendar className="w-3 h-3" />
            Upcoming
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            Optional
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.nextSteps}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {userProfile.role} Roadmap
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized action items and deadlines sorted by critical urgency to prevent missing statutory benefits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Task Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-5 flex items-start gap-4 transition-colors ${
              task.completed ? 'bg-slate-50/60' : 'hover:bg-slate-50/40'
            }`}
          >
            {/* Checkbox */}
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all cursor-pointer mt-0.5 shrink-0 ${
                task.completed
                  ? 'bg-emerald-600 text-white'
                  : 'border-2 border-slate-300 hover:border-indigo-600'
              }`}
            >
              {task.completed && <CheckCircle2 className="w-4 h-4" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`text-sm font-bold ${
                    task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}
                >
                  {task.title}
                </span>
                {getUrgencyBadge(task.urgency)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {task.schemeTitle && (
                  <>
                    <span className="font-semibold text-indigo-600">{task.schemeTitle}</span>
                    <span>•</span>
                  </>
                )}
                <span>Due: <strong className="text-slate-700">{task.dueDate}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Action Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Visit Tahsildar office for verification"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                    Urgency
                  </label>
                  <select
                    value={taskUrgency}
                    onChange={(e) => setTaskUrgency(e.target.value as NextStepTask['urgency'])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    <option value="Overdue">Overdue</option>
                    <option value="Due soon">Due soon</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                    Target Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 20 Nov 2026"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
