import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_SUGGESTIONS } from '../../data/suggestions';
import {
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Compass,
  User,
  Sparkles,
  Bot
} from 'lucide-react';

export const AIGuideTab: React.FC = () => {
  const {
    language,
    t,
    userProfile,
    chatMessages,
    isAiStreaming,
    sendChatMessage,
    clearChat,
    setActiveTab,
    setActiveAssistFillScheme,
    filteredSchemes,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiStreaming]);

  // Handle Text Submit
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAiStreaming) return;
    const query = inputQuery.trim();
    setInputQuery('');
    sendChatMessage(query, false);
  };

  // Inline Mic Toggle
  const handleToggleInlineMic = async () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const recognition = new SpeechRecognition();
      recognition.lang = language.bcp47;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setIsRecording(true);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputQuery(transcript);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      alert('Microphone permission denied or not available.');
      setIsRecording(false);
    }
  };

  // TTS Read Aloud
  const handleReadAloud = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (playingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language.bcp47;

    utterance.onend = () => setPlayingMsgId(null);
    utterance.onerror = () => setPlayingMsgId(null);

    setPlayingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const suggestions =
    ROLE_SUGGESTIONS[language.code]?.[userProfile.role] ||
    ROLE_SUGGESTIONS.en[userProfile.role] ||
    [];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[78vh] bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                NIRVAHA AI Guide
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-700 font-semibold">Active</span>
            </div>
            <p className="text-xs text-slate-500">
              Verified public welfare assistant ({language.nativeName})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearChat}
            title="Reset Chat"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {/* Voice Badge */}
                {msg.isVoice && (
                  <div className="mb-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold text-white">
                    <Mic className="w-3 h-3" />
                    <span>🎙️ Spoken to NIRVAHA AI (Speech-to-Text)</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text || (isAiStreaming ? 'Thinking...' : '')}</p>

                <div
                  className={`mt-2 flex items-center justify-between text-[11px] ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {/* Read Aloud button for AI messages */}
                  {!isUser && msg.text && (
                    <button
                      type="button"
                      onClick={() => handleReadAloud(msg.id, msg.text)}
                      className="ml-3 text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {playingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{t.stopAudio}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t.readAloud}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Row */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          Suggestions:
        </span>
        {suggestions.map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => sendChatMessage(sug, false)}
            disabled={isAiStreaming}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleToggleInlineMic}
          title="Voice Input"
          className={`p-3 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t.typeYourMessage}
          disabled={isAiStreaming}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isAiStreaming}
          className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
