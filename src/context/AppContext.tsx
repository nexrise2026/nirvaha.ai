import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Language,
  CitizenRole,
  DocumentItem,
  ConsentItem,
  NextStepTask,
  ChatMessage,
  Scheme,
  SubmissionReceipt,
} from '../types';
import { INDIAN_LANGUAGES, DEFAULT_LANGUAGE } from '../data/languages';
import { TRANSLATIONS, TranslationBundle } from '../data/translations';
import { INITIAL_DOCUMENTS, INITIAL_CONSENTS, DEFAULT_TASKS_BY_ROLE } from '../data/defaults';
import { ALL_SCHEMES } from '../data/schemes';

export type AppTab =
  | 'home'
  | 'aiGuide'
  | 'schemes'
  | 'assistFill'
  | 'vault'
  | 'nextSteps'
  | 'consent'
  | 'support';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationBundle;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  chatMessages: ChatMessage[];
  isAiStreaming: boolean;
  sendChatMessage: (text: string, isVoice?: boolean) => Promise<void>;
  clearChat: () => void;
  documents: DocumentItem[];
  addDocument: (doc: DocumentItem) => void;
  toggleDocReminder: (id: string) => void;
  consents: ConsentItem[];
  updateConsentStatus: (id: string, status: 'Allowed' | 'Denied' | 'Revoked') => void;
  tasks: NextStepTask[];
  toggleTask: (id: string) => void;
  addTask: (title: string, urgency: NextStepTask['urgency'], dueDate: string) => void;
  activeAssistFillScheme: Scheme | null;
  setActiveAssistFillScheme: (scheme: Scheme | null) => void;
  submissionReceipts: SubmissionReceipt[];
  submitAssistFillApplication: (
    scheme: Scheme,
    formData: Record<string, string>,
    attachedDocs: string[]
  ) => SubmissionReceipt;
  logoutCitizen: () => void;
  quickDemoLogin: (role?: CitizenRole) => void;
  filteredSchemes: Scheme[];
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Ramesh Gowda',
  role: 'Student',
  state: 'Karnataka',
  district: 'Bengaluru Urban',
  socialCategory: 'OBC',
  annualIncome: '₹85,000 / year',
  rationCard: 'Priority Household (PHH)',
  gender: 'Male',
  roleProofNumber: 'SATS-2026-98421',
  phone: '9845012345',
  email: 'ramesh.gowda@gmail.com',
  isAuthenticated: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nirvaha_lang');
    if (saved) {
      const match = INDIAN_LANGUAGES.find((l) => l.code === saved);
      if (match) return match;
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nirvaha_lang', lang.code);
    document.documentElement.lang = lang.bcp47;
    document.documentElement.dir = lang.isRTL ? 'rtl' : 'ltr';
  };

  const t: TranslationBundle = TRANSLATIONS[language.code] || TRANSLATIONS.en;

  // User Profile & Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nirvaha_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_PROFILE;
  });

  const [onboardingStep, setOnboardingStep] = useState<number>(() => {
    return userProfile.isAuthenticated ? 0 : 1;
  });

  // Active Tab State
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Documents & Consents State
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [consents, setConsents] = useState<ConsentItem[]>(INITIAL_CONSENTS);

  // Next Steps Tasks
  const [tasks, setTasks] = useState<NextStepTask[]>(() => {
    return DEFAULT_TASKS_BY_ROLE[userProfile.role] || DEFAULT_TASKS_BY_ROLE.Student;
  });

  // Receipts State
  const [submissionReceipts, setSubmissionReceipts] = useState<SubmissionReceipt[]>([]);

  // Selected Scheme for AssistFill Form
  const [activeAssistFillScheme, setActiveAssistFillScheme] = useState<Scheme | null>(null);

  // Chat Messages & Streaming State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'model',
        text:
          language.code === 'kn'
            ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಿರ್ವಾಹ AI ಸಾರ್ವಜನಿಕ ಸೇವಾ ಸಹಾಯಕ. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರ ನೀವು ಸಂಬಂಧಿಸಿದ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ನಿಮಗೆ ಯಾವ ಯೋಜನೆ ಅಥವಾ ದಾಖಲೆಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು?'
            : language.code === 'hi'
            ? 'नमस्ते! मैं आपका निर्वाह AI लोक सेवा साथी हूं। आपकी प्रोफ़ाइल और स्थान के अनुसार कई कल्याणकारी योजनाएं उपलब्ध हैं। आपको किस सेवा के बारे में जानकारी चाहिए?'
            : 'Hello! I am your NIRVAHA AI public service guide. Based on your citizen profile and location, you have verified welfare schemes available. How can I help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('nirvaha_profile', JSON.stringify(userProfile));
    setTasks(DEFAULT_TASKS_BY_ROLE[userProfile.role] || DEFAULT_TASKS_BY_ROLE.Student);
  }, [userProfile.role, userProfile.isAuthenticated]);

  // Strict Role + State + District Filtering
  // item.role === userProfile.role && (item.states === "ALL" || item.states.includes(userProfile.state)) && (item.districts === "ALL" || !item.districts || item.districts.includes(userProfile.district))
  const filteredSchemes = ALL_SCHEMES.filter((item) => {
    const roleMatches = item.role === userProfile.role;
    const stateMatches = item.states === 'ALL' || item.states.includes(userProfile.state);
    const districtMatches =
      item.districts === 'ALL' ||
      !item.districts ||
      (Array.isArray(item.districts) && item.districts.includes(userProfile.district));
    return roleMatches && stateMatches && districtMatches;
  });

  // Handle Chat Streaming via /api/chat endpoint
  const sendChatMessage = async (text: string, isVoice = false) => {
    if (!text.trim() || isAiStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice,
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setIsAiStreaming(true);

    const modelMsgId = `model-${Date.now()}`;
    const initialModelMsg: ChatMessage = {
      id: modelMsgId,
      sender: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...newMessages, initialModelMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ sender: m.sender, text: m.text })),
          userProfile,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setChatMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === modelMsgId ? { ...msg, text: accumulatedText } : msg
                    )
                  );
                }
              } catch (e) {
                // partial JSON, ignore
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat stream error:', err);
      // Local fallback
      const fallbackMsg =
        language.code === 'kn'
          ? 'ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕ ಸಮಸ್ಯೆಯಾಗಿದೆ. ನಿಮ್ಮ ಪಾತ್ರಕ್ಕೆ ಸೂಕ್ತವಾದ ಯೋಜನೆಗಳನ್ನು ಸರ್ವಿಸ್ ಡೈರೆಕ್ಟರಿ ಅಥವಾ ಅಸಿಸ್ಟ್‌ಫಿಲ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ನೋಡಬಹುದು.'
          : language.code === 'hi'
          ? 'माफ़ कीजिए, संपर्क में समस्या आई है। आप सेवा डायरेक्टरी या असिस्टफिल में सीधे अपने लिए उपलब्ध योजनाएं देख सकते हैं।'
          : 'I apologize, there was a connection hiccup. You can directly browse your eligible schemes in the Services Directory or apply via AssistFill.';

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId ? { ...msg, text: fallbackMsg } : msg
        )
      );
    } finally {
      setIsAiStreaming(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'model',
        text:
          language.code === 'kn'
            ? 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ. ನಾನು ನಿಮಗೆ ತಕ್ಷಣ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ.'
            : language.code === 'hi'
            ? 'नमस्ते! अपना नया प्रश्न पूछें। मैं आपकी तुरंत सहायता करूँगा।'
            : 'Hello! Ask your question and I will assist you with verified next steps.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const addDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const toggleDocReminder = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, enableExpiryReminder: !doc.enableExpiryReminder } : doc
      )
    );
  };

  const updateConsentStatus = (id: string, status: 'Allowed' | 'Denied' | 'Revoked') => {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, lastAccessed: 'Just now' } : c))
    );
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (title: string, urgency: NextStepTask['urgency'], dueDate: string) => {
    const newTask: NextStepTask = {
      id: `task-${Date.now()}`,
      title,
      urgency,
      dueDate,
      completed: false,
      isCustom: true,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const submitAssistFillApplication = (
    scheme: Scheme,
    formData: Record<string, string>,
    attachedDocs: string[]
  ): SubmissionReceipt => {
    const rolePrefix = scheme.role.substring(0, 3).toUpperCase();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const applicationId = `NIR-${rolePrefix}-2026-${randomDigits}`;

    const receipt: SubmissionReceipt = {
      applicationId,
      schemeId: scheme.id,
      schemeTitle: scheme.title,
      submittedAt: new Date().toLocaleString(),
      applicantName: userProfile.fullName,
      role: userProfile.role,
      state: userProfile.state,
      district: userProfile.district,
      attachedDocs,
      formData,
      status: 'Submitted - Pending Officer Verification',
    };

    setSubmissionReceipts((prev) => [receipt, ...prev]);

    // Automatically mark associated task or add tracking task
    const trackingTask: NextStepTask = {
      id: `task-${Date.now()}`,
      title: `Track submitted application: ${receipt.applicationId} (${scheme.title})`,
      schemeTitle: scheme.title,
      urgency: 'Due soon',
      dueDate: '14 Days Tracking Window',
      completed: false,
      isCustom: true,
    };
    setTasks((prev) => [trackingTask, ...prev]);

    return receipt;
  };

  const logoutCitizen = () => {
    setUserProfile((prev) => ({ ...prev, isAuthenticated: false }));
    setOnboardingStep(1);
    localStorage.removeItem('nirvaha_profile');
  };

  const quickDemoLogin = (role: CitizenRole = 'Student') => {
    const sampleProfile: UserProfile = {
      fullName: 'Ramesh Gowda',
      role,
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      socialCategory: 'OBC',
      annualIncome: '₹85,000 / year',
      rationCard: 'Priority Household (PHH)',
      gender: 'Male',
      roleProofNumber:
        role === 'Student'
          ? 'SATS-2026-98421'
          : role === 'Farmer'
          ? 'FID-KA-991204'
          : role === 'Worker'
          ? 'KA-BOCW-2024-81729'
          : role === 'Senior Citizen'
          ? 'PEN-KA-65-8912'
          : 'KA2910481940182910',
      phone: '9845012345',
      email: 'ramesh.gowda@gmail.com',
      isAuthenticated: true,
    };

    setUserProfile(sampleProfile);
    setOnboardingStep(0);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userProfile,
        setUserProfile,
        onboardingStep,
        setOnboardingStep,
        activeTab,
        setActiveTab,
        chatMessages,
        isAiStreaming,
        sendChatMessage,
        clearChat,
        documents,
        addDocument,
        toggleDocReminder,
        consents,
        updateConsentStatus,
        tasks,
        toggleTask,
        addTask,
        activeAssistFillScheme,
        setActiveAssistFillScheme,
        submissionReceipts,
        submitAssistFillApplication,
        logoutCitizen,
        quickDemoLogin,
        filteredSchemes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
