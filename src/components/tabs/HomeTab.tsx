import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_SUGGESTIONS } from '../../data/suggestions';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FolderLock,
  ListChecks,
  Building2,
  Calendar,
  Volume2,
  Maximize2
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const {
    language,
    t,
    userProfile,
    setActiveTab,
    sendChatMessage,
    filteredSchemes,
    setActiveAssistFillScheme,
    documents,
    tasks,
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [showVoiceFallbackModal, setShowVoiceFallbackModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleStartVoice = async () => {
    setErrorMessage(null);
    setLiveTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowVoiceFallbackModal(true);
      return;
    }

    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 2. Immediately stop audio hardware tracks to prevent device lock
      stream.getTracks().forEach((track) => track.stop());

      // 3. Initialize SpeechRecognition with current BCP-47 tag
      const recognition = new SpeechRecognition();
      recognition.lang = language.bcp47;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setShowVoiceFallbackModal(true);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Microphone access denied or error:', err);
      setShowVoiceFallbackModal(true);
      setIsRecording(false);
    }
  };

  const handleStopVoiceAndSend = (textToSend?: string) => {
    const finalQuery = textToSend || liveTranscript;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);

    if (finalQuery.trim()) {
      setActiveTab('aiGuide');
      sendChatMessage(finalQuery.trim(), true);
    }
  };

  const handleOpenStandaloneWindow = () => {
    window.open(window.location.href, '_blank');
  };

  const suggestions =
    ROLE_SUGGESTIONS[language.code]?.[userProfile.role] ||
    ROLE_SUGGESTIONS.en[userProfile.role] ||
    [];

  const verifiedDocsCount = documents.filter((d) => d.status === 'Verified').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Voice Interaction Hero Banner */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle background circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-4">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Voice-First Public Service Navigation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.speakToAi}
          </h1>

          <p className="mt-2 text-sm text-indigo-200/80 max-w-lg leading-relaxed">
            {t.speakInstruction}
          </p>

          {/* Voice Microphone Center Button */}
          <div className="my-6 relative flex flex-col items-center">
            {isRecording && (
              <div className="absolute inset-0 w-28 h-28 -m-3 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
            )}

            <button
              type="button"
              onClick={isRecording ? () => handleStopVoiceAndSend() : handleStartVoice}
              className={`w-22 h-22 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white hover:bg-rose-700 scale-105 ring-4 ring-rose-400/50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 ring-4 ring-indigo-400/30'
              }`}
            >
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            <span className="mt-3 text-xs font-semibold tracking-wide text-indigo-100">
              {isRecording ? t.listening : 'Click to Speak'}
            </span>
          </div>

          {/* Live Transcript Box */}
          {liveTranscript && (
            <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-left mb-4 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
                <span className="font-semibold">Speech-to-Text Live Transcript:</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-white italic">
                "{liveTranscript}"
              </p>
              <button
                type="button"
                onClick={() => handleStopVoiceAndSend()}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <span>{t.pasteToChatbot}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Standalone Window helper for embedded iframe environments */}
          {isInIframe && (
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenStandaloneWindow}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white underline decoration-indigo-400/60 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t.openStandalone}</span>
              </button>
            </div>
          )}

          {/* Suggestion Chips */}
          <div className="mt-6 pt-4 border-t border-indigo-800/40 w-full text-left">
            <span className="text-xs font-semibold text-indigo-300 block mb-2">
              Popular questions for {userProfile.role}:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveTab('aiGuide');
                    sendChatMessage(sug, false);
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/10 transition-colors text-left cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('schemes')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              {t.eligibleSchemes}
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {filteredSchemes.length} Schemes
            </span>
            <span className="text-xs text-emerald-700 font-medium mt-0.5 block">
              Strictly filtered for {userProfile.role}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('vault')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              {t.verifiedDocs}
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {verifiedDocsCount} Records
            </span>
            <span className="text-xs text-emerald-700 font-medium mt-0.5 block">
              Ready for in-app AssistFill
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FolderLock className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('nextSteps')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              {t.pendingTasks}
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {pendingTasksCount} Tasks
            </span>
            <span className="text-xs text-amber-700 font-medium mt-0.5 block">
              Prioritized by urgency
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ListChecks className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Top Matching Schemes List */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Recommended Welfare Schemes</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matching your location: <strong className="text-slate-700">{userProfile.state}</strong> • <strong className="text-slate-700">{userProfile.district}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('schemes')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({filteredSchemes.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {filteredSchemes.slice(0, 3).map((scheme) => (
            <div
              key={scheme.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    {scheme.categoryTag}
                  </span>
                  {scheme.isStateSpecific && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {userProfile.state} Specific
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{scheme.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">
                    Benefit: {scheme.benefitAmount}
                  </span>
                  <span>•</span>
                  <span>Deadline: {scheme.deadline}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAssistFillScheme(scheme);
                    setActiveTab('assistFill');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{t.applyViaAssistFill}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voice Fallback / Permission Modal */}
      {showVoiceFallbackModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Microphone Access Required
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In this preview environment, your browser may restrict microphone access inside an embedded iframe. You can either open Nirvaha AI in a standalone window or type directly in AI Guide.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleOpenStandaloneWindow}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Open in Standalone Window</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVoiceFallbackModal(false);
                  setActiveTab('aiGuide');
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Type in AI Guide Instead
              </button>

              <button
                type="button"
                onClick={() => setShowVoiceFallbackModal(false)}
                className="w-full py-2 text-slate-400 text-xs hover:text-slate-600 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
