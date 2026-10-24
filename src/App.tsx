import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navbar/Navbar';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { HomeTab } from './components/tabs/HomeTab';
import { AIGuideTab } from './components/tabs/AIGuideTab';
import { SchemesTab } from './components/tabs/SchemesTab';
import { AssistFillTab } from './components/tabs/AssistFillTab';
import { DocumentVaultTab } from './components/tabs/DocumentVaultTab';
import { NextStepsTab } from './components/tabs/NextStepsTab';
import { ConsentTab } from './components/tabs/ConsentTab';
import { SupportTab } from './components/tabs/SupportTab';

const AppContent: React.FC = () => {
  const { onboardingStep, activeTab } = useApp();

  // If user is undergoing onboarding, render high-contrast onboarding screens
  if (onboardingStep > 0) {
    return <OnboardingView />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'aiGuide' && <AIGuideTab />}
        {activeTab === 'schemes' && <SchemesTab />}
        {activeTab === 'assistFill' && <AssistFillTab />}
        {activeTab === 'vault' && <DocumentVaultTab />}
        {activeTab === 'nextSteps' && <NextStepsTab />}
        {activeTab === 'consent' && <ConsentTab />}
        {activeTab === 'support' && <SupportTab />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">NIRVAHA AI</span>
            <span>—</span>
            <span>Multilingual Public Service Navigation Agent for Indian Citizens</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Official Welfare Directory</span>
            <span>•</span>
            <span>Direct In-App AssistFill</span>
            <span>•</span>
            <span>13 Indian Languages</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
