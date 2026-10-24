import React from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import { INDIAN_LANGUAGES } from '../../data/languages';
import {
  Compass,
  Home,
  MessageSquare,
  BookOpen,
  FileSpreadsheet,
  FolderLock,
  ListChecks,
  ShieldAlert,
  Headphones,
  Globe2,
  LogOut,
  Laptop,
  GraduationCap,
  Sprout,
  Briefcase,
  HeartHandshake,
  Accessibility
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, userProfile, activeTab, setActiveTab, logoutCitizen } = useApp();

  const ROLE_ICONS = {
    Student: GraduationCap,
    Farmer: Sprout,
    Worker: Briefcase,
    'Senior Citizen': HeartHandshake,
    'Person with Disability': Accessibility,
  };

  const CurrentRoleIcon = ROLE_ICONS[userProfile.role] || GraduationCap;

  const TABS: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'aiGuide', label: t.aiGuide, icon: MessageSquare },
    { id: 'schemes', label: t.schemes, icon: BookOpen },
    { id: 'assistFill', label: t.assistFill, icon: FileSpreadsheet },
    { id: 'vault', label: t.vault, icon: FolderLock },
    { id: 'nextSteps', label: t.nextSteps, icon: ListChecks },
    { id: 'consent', label: t.consent, icon: ShieldAlert },
    { id: 'support', label: t.support, icon: Headphones },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200 font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                NIRVAHA AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold">
                <CurrentRoleIcon className="w-3 h-3" />
                {userProfile.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              {userProfile.state} • {userProfile.district}
            </p>
          </div>
        </div>

        {/* Right Tools: Device Bar + Language Dropdown + Switch Role */}
        <div className="flex items-center gap-2.5">
          {/* Detected Device ID */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium">
            <Laptop className="w-3.5 h-3.5 text-slate-500" />
            <span>DEV-86CJ</span>
          </div>

          {/* 13-Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={language.code}
              onChange={(e) => {
                const match = INDIAN_LANGUAGES.find((l) => l.code === e.target.value);
                if (match) setLanguage(match);
              }}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Logout / Switch Role */}
          <button
            type="button"
            onClick={logoutCitizen}
            title={t.logout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
