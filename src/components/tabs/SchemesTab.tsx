import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scheme } from '../../types';
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  Search,
  Filter,
  FileText,
  BadgeAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SchemesTab: React.FC = () => {
  const {
    t,
    userProfile,
    filteredSchemes,
    setActiveTab,
    setActiveAssistFillScheme,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  const displayedSchemes = filteredSchemes.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.categoryTag.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedSchemeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.schemes}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {userProfile.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying welfare initiatives matching your state (<strong className="text-slate-700">{userProfile.state}</strong>) and district (<strong className="text-slate-700">{userProfile.district}</strong>).
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes or benefits..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      {displayedSchemes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700">No matching schemes found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or verify your citizen role in profile settings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedSchemes.map((scheme) => {
            const isExpanded = expandedSchemeId === scheme.id;

            return (
              <div
                key={scheme.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {scheme.categoryTag}
                      </span>
                      {scheme.isStateSpecific && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {userProfile.state} Portal
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {scheme.deadline}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">{scheme.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{scheme.department}</p>

                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 font-semibold">
                      Benefit: {scheme.benefitAmount}
                    </div>

                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                      {scheme.description}
                    </p>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:min-w-44">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAssistFillScheme(scheme);
                        setActiveTab('assistFill');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>{t.applyViaAssistFill}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(scheme.id)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Eligibility'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-[11px] text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors pt-1"
                    >
                      <span>Portal Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Collapsible Eligibility & Required Docs */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Eligibility Criteria
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {scheme.eligibility.map((el, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Required Verified Records
                      </h4>
                      <ul className="space-y-1.5 text-slate-600">
                        {scheme.requiredDocs.map((doc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
