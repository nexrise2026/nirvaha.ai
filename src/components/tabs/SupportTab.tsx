import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones,
  PhoneCall,
  MapPin,
  Clock,
  Globe2,
  FileText,
  Printer,
  Copy,
  Check,
  Building2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface HelplineDesk {
  title: string;
  department: string;
  phone: string;
  hours: string;
  languages: string;
  address: string;
}

export const SupportTab: React.FC = () => {
  const { t, userProfile, documents, filteredSchemes } = useApp();

  const [issueNotes, setIssueNotes] = useState('');
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const HELPLINES: HelplineDesk[] = [
    {
      title: 'Gram One & Seva Sindhu Citizen Facilitation Desk',
      department: 'Department of E-Governance, Karnataka',
      phone: '080-22230282 / 1902',
      hours: 'Mon - Sat: 9:00 AM – 6:00 PM',
      languages: 'Kannada, English, Hindi',
      address: 'Near Taluk Office / Mini Vidhana Soudha, Bengaluru',
    },
    {
      title: 'Kisan Call Centre (Agriculture Grievances)',
      department: 'Ministry of Agriculture & Farmers Welfare',
      phone: '1800-180-1551 (Toll-Free)',
      hours: 'All 7 Days: 6:00 AM – 10:00 PM',
      languages: 'Kannada, Telugu, Tamil, Hindi, English',
      address: 'Centralized Agri Support Grid',
    },
    {
      title: 'Social Welfare & Post-Matric Scholarship Helpdesk (SSP)',
      department: 'Department of Social Welfare',
      phone: '080-22634300 / 0120-6619540',
      hours: 'Mon - Fri: 10:00 AM – 5:30 PM',
      languages: 'Kannada, English',
      address: 'Dr. B.R. Ambedkar Veedhi, Bengaluru',
    },
    {
      title: 'Labour Welfare Commissioner & BOCW Liaison',
      department: 'Karnataka Labour Welfare Board',
      phone: '155214 / 080-22271871',
      hours: 'Mon - Sat: 9:30 AM – 5:30 PM',
      languages: 'Kannada, Hindi, English',
      address: 'Karmika Bhavana, Bannerghatta Road, Bengaluru',
    },
  ];

  const handleGenerateBrief = () => {
    const verifiedDocs = documents
      .filter((d) => d.status === 'Verified')
      .map((d) => d.name)
      .join(', ');

    const eligibleSchemesList = filteredSchemes.map((s) => s.title).join('\n - ');

    const brief = `OFFICIAL CITIZEN ISSUE SUMMARY BRIEF
Prepared by NIRVAHA AI Public Service Navigation Agent
Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}

I. CITIZEN PARTICULARS:
- Full Name: ${userProfile.fullName}
- Citizen Role: ${userProfile.role}
- Domicile: ${userProfile.district}, ${userProfile.state}
- Social Category: ${userProfile.socialCategory} | Annual Income: ${userProfile.annualIncome}
- Ration Card: ${userProfile.rationCard}
- Identification / Proof No.: ${userProfile.roleProofNumber}

II. CITIZEN GRIEVANCE / ISSUE STATEMENT:
${issueNotes.trim() || 'Seeking statutory welfare assistance and verification of eligibility criteria.'}

III. VERIFIED RECORDS CURRENTLY HELD IN VAULT:
${verifiedDocs || 'Aadhaar Card, Income Certificate'}

IV. RELEVANT STATUTORY SCHEMES IDENTIFIED:
 - ${eligibleSchemesList}

V. ACTION REQUESTED FROM CONCERNED LIAISON OFFICER:
Expedite document attestation, biometric e-KYC validation, and submission processing under applicable state/central guidelines.`;

    setGeneratedBrief(brief);
  };

  const handleCopy = () => {
    if (!generatedBrief) return;
    navigator.clipboard.writeText(generatedBrief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Headphones className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.support}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Connect directly with district liaison desks or generate an official printed brief to present at government counters.
        </p>
      </div>

      {/* Issue Summary Generator Tool */}
      <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            {t.prepareSummary}
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Visiting a government office or Seva Kendra in person? Type your situation in simple words below. NIRVAHA AI will format it into a formal, clear administrative brief mentioning your verified documents and relevant schemes.
        </p>

        <textarea
          rows={3}
          value={issueNotes}
          onChange={(e) => setIssueNotes(e.target.value)}
          placeholder="Describe what help you need from the officer (e.g., My crop insurance intimation was delayed due to hospital stay; I need help submitting manual claim appeal)..."
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 outline-none"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateBrief}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Brief</span>
          </button>
        </div>

        {/* Generated Brief Box */}
        {generatedBrief && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed animate-fade-in relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-sans text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Brief Ready for Print / Copy
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
            {generatedBrief}
          </div>
        )}
      </div>

      {/* Helplines Directory Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-600" />
          <span>Local Citizen Helpdesks & Liaison Officers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HELPLINES.map((hl, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3"
            >
              <div>
                <h3 className="font-bold text-sm text-slate-900">{hl.title}</h3>
                <span className="text-[11px] text-slate-500 block">{hl.department}</span>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{hl.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hl.hours}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Languages: {hl.languages}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hl.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
