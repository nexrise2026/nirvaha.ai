import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, DocumentStatus } from '../../types';
import {
  FolderLock,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  BellOff,
  FileText,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';

export const DocumentVaultTab: React.FC = () => {
  const { t, userProfile, documents, addDocument, toggleDocReminder } = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCode, setDocCode] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);

  // Filter documents relevant to user's role
  const roleDocs = documents.filter((d) => d.requiredForRoles.includes(userProfile.role));

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: docName.trim(),
      code: docCode.trim() || 'CIT-DOC-2026',
      requiredForRoles: [userProfile.role],
      status: 'Uploaded',
      fileName: docFile?.name || `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: 'Permanent (Self-certified)',
      verifiedBy: 'Pending Authority Attestation',
      fileSize: '1.5 MB',
      enableExpiryReminder: false,
    };

    addDocument(newDoc);
    setShowUploadModal(false);
    setDocName('');
    setDocCode('');
    setDocFile(null);
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case 'Expiring soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            Expiring soon
          </span>
        );
      case 'Uploaded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            <FileText className="w-3 h-3" />
            Uploaded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
            Not uploaded
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.vault}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {userProfile.role} Checklist
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof digital records utilized by AssistFill for instant, verified application filing without re-uploading.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Record</span>
        </button>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
        {roleDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">{doc.name}</span>
                  {getStatusBadge(doc.status)}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-mono text-slate-600">{doc.fileName}</span>
                  <span>•</span>
                  <span>Size: {doc.fileSize}</span>
                  <span>•</span>
                  <span>Verified by: <strong className="text-slate-700">{doc.verifiedBy}</strong></span>
                </div>

                <div className="mt-1.5 text-[11px] text-slate-400">
                  Uploaded: {doc.uploadDate} | Validity: {doc.expiryDate}
                </div>
              </div>
            </div>

            {/* Expiry Reminder Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleDocReminder(doc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  doc.enableExpiryReminder
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {doc.enableExpiryReminder ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reminder Active (30 Days)</span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Enable Expiry Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Simulator Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Upload Record to Vault
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Land Revenue Receipt 2026 or College ID"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 block">
                  Select File (PDF / JPG)
                </label>
                <input
                  type="file"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-700"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Records are encrypted locally and shared exclusively with department APIs with your explicit consent.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
