import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Building2,
  Lock
} from 'lucide-react';

export const ConsentTab: React.FC = () => {
  const { t, consents, updateConsentStatus } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.consent}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Full citizen sovereignty over personal data. Review, grant, or revoke department access to specific identity, educational, or land attributes at any time.
        </p>
      </div>

      {/* Consent Permissions List */}
      <div className="space-y-4">
        {consents.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">{item.department}</h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'Allowed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Denied'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                <strong>Purpose:</strong> {item.purpose}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Accessed Fields:</span>
                {item.accessedFields.map((f, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Retention: {item.retentionPeriod}</span>
                <span>•</span>
                <span>Last Accessed: {item.lastAccessed}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {item.status !== 'Allowed' && (
                <button
                  type="button"
                  onClick={() => updateConsentStatus(item.id, 'Allowed')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Allow</span>
                </button>
              )}

              {item.status === 'Allowed' && (
                <button
                  type="button"
                  onClick={() => updateConsentStatus(item.id, 'Revoked')}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Revoke Consent</span>
                </button>
              )}

              {item.status !== 'Denied' && item.status !== 'Revoked' && (
                <button
                  type="button"
                  onClick={() => updateConsentStatus(item.id, 'Denied')}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  Deny
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
