import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Scheme, SubmissionReceipt } from '../../types';
import {
  FileSpreadsheet,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FolderLock,
  ArrowRight,
  ExternalLink,
  Download,
  Printer,
  RotateCcw,
  Building2,
  Info,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const AssistFillTab: React.FC = () => {
  const {
    t,
    userProfile,
    filteredSchemes,
    activeAssistFillScheme,
    setActiveAssistFillScheme,
    documents,
    submitAssistFillApplication,
    submissionReceipts,
  } = useApp();

  // Active scheme being filled (default to first filtered scheme or preselected)
  const currentScheme: Scheme | undefined =
    activeAssistFillScheme || filteredSchemes[0];

  // Wizard Steps: 1 = Profile Review, 2 = Form Details, 3 = Attach Vault Docs, 4 = Review & Submit, 5 = Receipt
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dynamic Form Field Values
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [autoFilledFromVault, setAutoFilledFromVault] = useState<boolean>(false);
  const [attachedDocIds, setAttachedDocIds] = useState<string[]>([]);
  const [latestReceipt, setLatestReceipt] = useState<SubmissionReceipt | null>(null);

  // Initialize form fields when current scheme changes
  useEffect(() => {
    if (currentScheme) {
      const initial: Record<string, string> = {};
      currentScheme.formFields.forEach((field) => {
        initial[field.id] = field.defaultValue || '';
      });
      setFormValues(initial);
      setAutoFilledFromVault(false);
      setCurrentStep(1);
      setLatestReceipt(null);

      // Default attach existing verified documents
      const verifiedIds = documents
        .filter((d) => d.status === 'Verified')
        .map((d) => d.id);
      setAttachedDocIds(verifiedIds);
    }
  }, [currentScheme?.id]);

  if (!currentScheme) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Eligible Scheme Selected</h3>
        <p className="text-xs text-slate-500 mt-1">
          Please select a scheme from the Services Directory to initiate AssistFill.
        </p>
      </div>
    );
  }

  // Auto-Access Vault & Fill Form Feature
  const handleAutoAccessVaultAndFill = () => {
    const updatedValues = { ...formValues };

    currentScheme.formFields.forEach((field) => {
      // Find matching document in vault
      documents.forEach((doc) => {
        if (doc.vaultData) {
          if (doc.vaultData[field.id]) {
            updatedValues[field.id] = doc.vaultData[field.id];
          }
          // Also match common field patterns
          if (field.id === 'casteCertRdNumber' && doc.vaultData.casteCertRdNumber) {
            updatedValues[field.id] = doc.vaultData.casteCertRdNumber;
          }
          if (field.id === 'fruitsId' && doc.vaultData.fruitsId) {
            updatedValues[field.id] = doc.vaultData.fruitsId;
          }
          if (field.id === 'bocwCardNo' && doc.vaultData.bocwCardNo) {
            updatedValues[field.id] = doc.vaultData.bocwCardNo;
          }
          if (field.id === 'udidNumber' && doc.vaultData.udidNumber) {
            updatedValues[field.id] = doc.vaultData.udidNumber;
          }
          if (field.id === 'bplRationCardNumber' && doc.vaultData.bplRationCardNumber) {
            updatedValues[field.id] = doc.vaultData.bplRationCardNumber;
          }
          if (field.id === 'satsId' && doc.vaultData.satsId) {
            updatedValues[field.id] = doc.vaultData.satsId;
          }
        }
      });
    });

    setFormValues(updatedValues);
    setAutoFilledFromVault(true);
  };

  // Toggle Document Attachment
  const handleToggleDocAttachment = (docId: string) => {
    setAttachedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  // Submit in-app Application
  const handleSubmitFinal = () => {
    const attachedDocNames = documents
      .filter((d) => attachedDocIds.includes(d.id))
      .map((d) => d.name);

    const receipt = submitAssistFillApplication(currentScheme, formValues, attachedDocNames);
    setLatestReceipt(receipt);
    setCurrentStep(5);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title & Scheme Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-slate-900">
              In-App AssistFill Form Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero external redirection. NIRVAHA AI accesses your Document Vault to automatically fill and submit verified government forms.
          </p>
        </div>

        {/* Change Scheme Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 shrink-0">Scheme:</label>
          <select
            value={currentScheme.id}
            onChange={(e) => {
              const selected = filteredSchemes.find((s) => s.id === e.target.value);
              if (selected) setActiveAssistFillScheme(selected);
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 max-w-xs"
          >
            {filteredSchemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Guided Form Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Step Indicator Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center justify-between overflow-x-auto no-scrollbar text-xs">
          {[
            { step: 1, label: '1. Citizen Profile' },
            { step: 2, label: '2. Scheme Details' },
            { step: 3, label: '3. Attach Records' },
            { step: 4, label: '4. Final Review' },
            { step: 5, label: '5. Receipt' },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <div
                key={s.step}
                className={`flex items-center gap-1.5 whitespace-nowrap font-bold ${
                  isActive
                    ? 'text-indigo-600'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.step}
                </span>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          {/* STEP 1: CITIZEN PROFILE VERIFICATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Step 1 of 4
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Review Pre-Filled Citizen Profile
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These verified profile attributes are automatically retrieved from your local profile session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Applicant Name</span>
                  <span className="text-slate-900 font-bold text-sm">{userProfile.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Role Category</span>
                  <span className="text-indigo-700 font-bold text-sm">{userProfile.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">State & District</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {userProfile.state}, {userProfile.district}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Social Category</span>
                  <span className="text-slate-900 font-bold text-sm">{userProfile.socialCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Annual Income</span>
                  <span className="text-slate-900 font-bold text-sm">{userProfile.annualIncome}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Ration Card Category</span>
                  <span className="text-slate-900 font-bold text-sm">{userProfile.rationCard}</span>
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex items-start gap-3 text-xs text-indigo-900">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Target Scheme: {currentScheme.title}</span>
                  <span className="text-indigo-800/90 mt-0.5 block">
                    Statutory Benefit: <strong>{currentScheme.benefitAmount}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <span>Proceed to Scheme Form →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCHEME SPECIFIC DETAILS WITH AUTO-VAULT ACCESS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                    Step 2 of 4
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Scheme-Specific Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill the remaining application fields or use Auto-Access to populate from your Vault.
                  </p>
                </div>

                {/* Auto-Access Vault Button */}
                <button
                  type="button"
                  onClick={handleAutoAccessVaultAndFill}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.autoFillVaultBtn}</span>
                </button>
              </div>

              {autoFilledFromVault && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Successfully extracted and auto-filled data from your verified Document Vault records.
                  </span>
                </div>
              )}

              {/* Dynamic Scheme Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentScheme.formFields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={formValues[field.id] || ''}
                        onChange={(e) =>
                          setFormValues({ ...formValues, [field.id]: e.target.value })
                        }
                        className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-600 focus:outline-none w-full"
                      >
                        <option value="">-- Select an option --</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formValues[field.id] || ''}
                        onChange={(e) =>
                          setFormValues({ ...formValues, [field.id]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-600 focus:outline-none w-full"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Attach Verified Records →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ATTACH DOCUMENT VAULT RECORDS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Step 3 of 4
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Attach Verified Records from Document Vault
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the documents from your vault that will be attached to this application bundle.
                </p>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => {
                  const isAttached = attachedDocIds.includes(doc.id);

                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleToggleDocAttachment(doc.id)}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isAttached
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            isAttached
                              ? 'bg-indigo-600 text-white'
                              : 'border border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{doc.name}</span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {doc.fileName || 'Verified digital credential'} • {doc.verifiedBy}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          doc.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Review Application Bundle →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Step 4 of 4
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Review & Submit Application
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm the accuracy of your form inputs before dispatching via NIRVAHA AI.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Applying For</span>
                    <span className="text-slate-900 font-bold text-sm">{currentScheme.title}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Benefit: {currentScheme.benefitAmount}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block">Applicant</span>
                    <span className="text-slate-800 font-semibold">{userProfile.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Role & Location</span>
                    <span className="text-slate-800 font-semibold">
                      {userProfile.role} ({userProfile.district}, {userProfile.state})
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    Form Specific Fields
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(formValues).map(([k, v]) => (
                      <div key={k} className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[11px] text-slate-500 block capitalize">{k}</span>
                        <span className="text-slate-900 font-bold text-xs">{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Attached Records ({attachedDocIds.length})
                  </span>
                  <p className="text-slate-600 font-medium">
                    {documents
                      .filter((d) => attachedDocIds.includes(d.id))
                      .map((d) => d.name)
                      .join(' • ')}
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  ← Edit Information
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSubmitFinal}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>{t.submitApplicationBtn}</span>
                  </button>
                </div>
              </div>

              {/* Optional Unobtrusive Manual Portal Link */}
              <div className="pt-4 text-center border-t border-slate-100">
                <a
                  href={currentScheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t.manualPortalLink} ({currentScheme.officialPortalUrl})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* STEP 5: DIGITAL SUBMISSION RECEIPT */}
          {currentStep === 5 && latestReceipt && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h2 className="text-xl font-black text-slate-900">
                  {t.receiptTitle}
                </h2>
                <p className="text-xs text-emerald-900 font-medium max-w-md mx-auto">
                  {t.receiptSubtitle}
                </p>

                <div className="inline-block bg-white border border-emerald-300 px-4 py-2 rounded-xl font-mono text-sm font-extrabold text-slate-900 shadow-xs">
                  Acknowledgement No: {latestReceipt.applicationId}
                </div>
              </div>

              {/* Printable Verification Slip Card */}
              <div
                id="printable-slip"
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">NIRVAHA AI ASSISTFILL SLIP</span>
                    <span className="text-slate-400">Timestamp: {latestReceipt.submittedAt}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                    {latestReceipt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block">Scheme Applied</span>
                    <span className="text-slate-900 font-bold">{latestReceipt.schemeTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Citizen Name</span>
                    <span className="text-slate-900 font-bold">{latestReceipt.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">State / District</span>
                    <span className="text-slate-900 font-bold">
                      {latestReceipt.state}, {latestReceipt.district}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Role Category</span>
                    <span className="text-slate-900 font-bold">{latestReceipt.role}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block font-bold mb-1">Attached Digital Records:</span>
                  <span className="text-slate-700 font-medium">
                    {latestReceipt.attachedDocs.join(', ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.downloadSlip}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Submit Another Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
