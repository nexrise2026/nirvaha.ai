import React, { useState } from 'react';
import {
  GraduationCap,
  Sprout,
  Briefcase,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Compass,
  CheckCircle2,
  Info,
  Sparkles,
  FileText,
  Building2,
  PhoneCall,
  ShieldCheck,
  ListChecks,
  ExternalLink,
  ChevronRight,
  HelpCircle as HelpIcon,
  Copy,
  Check
} from 'lucide-react';

// Category types supported by Nirvaha AI
type Category = 'Education' | 'Farming' | 'Jobs & Income' | 'Other Problems';

interface CategoryOption {
  id: Category;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'Education',
    title: 'Education',
    description: 'Scholarships, college fees, admissions, student grants & academic support',
    icon: GraduationCap,
  },
  {
    id: 'Farming',
    title: 'Farming',
    description: 'Crop loss compensation, fertilizers, irrigation subsidies & equipment grants',
    icon: Sprout,
  },
  {
    id: 'Jobs & Income',
    title: 'Jobs & Income',
    description: 'Skill development, employment exchanges, pensions, wages & livelihood aid',
    icon: Briefcase,
  },
  {
    id: 'Other Problems',
    title: 'Other Problems',
    description: 'Identity documentation, healthcare assistance, civic grievances & legal aid',
    icon: HelpCircle,
  },
];

// Sample problems to help users quickly explore guidance
const SAMPLE_PROBLEMS: { label: string; category: Category; text: string }[] = [
  {
    label: 'College Scholarship',
    category: 'Education',
    text: 'I am a first-year undergraduate student from a low-income family. I missed the state scholarship application deadline and need alternative financial assistance and fee waiver options.',
  },
  {
    label: 'Crop Damage Relief',
    category: 'Farming',
    text: 'Unseasonal heavy rain damaged 3 acres of my standing mustard crop. I need guidance on claiming government crop insurance compensation under PMFBY.',
  },
  {
    label: 'Vocational Training',
    category: 'Jobs & Income',
    text: 'I am looking for government-certified vocational skill training programs with job placement support in technical or digital skills.',
  },
  {
    label: 'Delayed Pension Papers',
    category: 'Other Problems',
    text: 'My elderly parent has faced delays in receiving their monthly widow/senior citizen pension for four months due to Aadhaar-bank account linking errors.',
  },
];

// Detailed structured guidance templates per category
interface GuidanceDetails {
  headline: string;
  overview: string;
  checklist: string[];
  schemes: { name: string; portal: string; description: string }[];
  helplines: { agency: string; phone: string; availability: string }[];
}

const GUIDANCE_DATA: Record<Category, GuidanceDetails> = {
  Education: {
    headline: 'Education & Financial Aid Guidance Plan',
    overview:
      'Educational hurdles often stem from rigid deadlines, missed documentation, or unawareness of institutional discretionary funds. Here are verified avenues to secure aid and academic continuity.',
    checklist: [
      'Collect last year mark sheets, family income certificate, and Aadhaar card.',
      'Submit a formal written letter to your College Principal or Dean of Student Welfare requesting a fee instalment extension.',
      'Check the National Scholarship Portal (NSP) for centrally sponsored post-matric and merit-cum-means schemes.',
      'Search state e-Kalyan / state social welfare portals for second-round application windows.',
    ],
    schemes: [
      {
        name: 'National Scholarship Portal (NSP)',
        portal: 'scholarships.gov.in',
        description: 'Single-window platform for Central Sector and minority pre/post-matric scholarship schemes.',
      },
      {
        name: 'Vidyasaarathi & Vidya Lakshmi Portal',
        portal: 'vidyalakshmi.co.in',
        description: 'Government-managed educational loan and CSR scholarship platform with subsidized interest rates.',
      },
    ],
    helplines: [
      {
        agency: 'National Scholarship Helpdesk',
        phone: '0120-6619540',
        availability: 'Mon - Fri, 9:00 AM - 5:30 PM',
      },
      {
        agency: 'UGC Student Grievance Redressal',
        phone: '1800-111-656',
        availability: 'Toll-Free Helpline',
      },
    ],
  },
  Farming: {
    headline: 'Agricultural Relief & Farm Support Action Plan',
    overview:
      'In cases of crop damage, natural calamities, or subsidy needs, timely reporting within official notification windows (typically within 72 hours) is essential for insurance claim acceptance.',
    checklist: [
      'Notify your local Agriculture Officer, Gram Sevak, or Patwari within 72 hours of damage.',
      'Capture clear, geotagged photos or video footage of the submerged or affected crop field.',
      'Gather Land Records (7/12 or Khasra/Khatauni), Sowing Certificate, and Bank Passbook linked with Aadhaar.',
      'File an intimation claim through the Crop Insurance App or through your local bank branch that issued KCC.',
    ],
    schemes: [
      {
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        portal: 'pmfby.gov.in',
        description: 'Comprehensive risk insurance coverage against non-preventable natural risks from pre-sowing to post-harvest.',
      },
      {
        name: 'PM-KISAN Samman Nidhi',
        portal: 'pmkisan.gov.in',
        description: 'Direct income support of ₹6,000 per year in three equal instalments to all landholding farmer families.',
      },
    ],
    helplines: [
      {
        agency: 'Kisan Call Centre (Nationwide)',
        phone: '1800-180-1551',
        availability: 'Toll-Free, 6:00 AM - 10:00 PM (All 7 Days)',
      },
      {
        agency: 'PMFBY Crop Insurance Grievance',
        phone: '14447',
        availability: 'Dedicated Toll-Free Claim Line',
      },
    ],
  },
  'Jobs & Income': {
    headline: 'Livelihood, Skill Development & Career Roadmap',
    overview:
      'Government vocational training initiatives and state livelihood missions offer free certification, stipend support, and job fairs for youth, women, and self-employed individuals.',
    checklist: [
      'Register your profile on the National Career Service (NCS) portal for verified private and government job openings.',
      'Enroll in free accredited skill certification courses under Skill India (PMKVY 4.0).',
      'For self-employment or small enterprise, prepare a project brief for PM Mudra Yojana loans up to ₹10 Lakhs.',
      'Visit your local District Industries Centre (DIC) or Rural Self Employment Training Institute (RSETI).',
    ],
    schemes: [
      {
        name: 'Skill India Digital & PMKVY',
        portal: 'skillindiadigital.gov.in',
        description: 'Free skill training, industry-recognized certificates, and direct job fair connections.',
      },
      {
        name: 'National Career Service (NCS)',
        portal: 'ncs.gov.in',
        description: 'Ministry of Labour & Employment platform matching jobseekers with verified employers.',
      },
    ],
    helplines: [
      {
        agency: 'National Career Service Helpline',
        phone: '1800-425-1514',
        availability: 'Tue - Sun, 8:00 AM - 8:00 PM',
      },
      {
        agency: 'MSME Champions Portal & Toll-Free',
        phone: '011-23063800',
        availability: 'Enterprise Guidance & Credit Assistance',
      },
    ],
  },
  'Other Problems': {
    headline: 'Citizen Services, Welfare & Grievance Resolution Plan',
    overview:
      'Administrative delays, documentation errors (Aadhaar, Voter ID, Ration Card), or welfare bottlenecks can be resolved systematically through official grievance portals and Common Service Centres.',
    checklist: [
      'Verify if your Aadhaar number is properly seeded and NPCI-mapped with your active bank account.',
      'Visit your nearest Common Service Centre (CSC) or citizen e-Seva centre for physical verification.',
      'Lodge a formal citizen grievance with supporting reference numbers on the CPGRAMS central portal.',
      'Keep note of the grievance registration docket number to track escalation within 30 days.',
    ],
    schemes: [
      {
        name: 'CPGRAMS (Centralised Public Grievance Portal)',
        portal: 'pgportal.gov.in',
        description: '24/7 online grievance redressal platform directly connecting citizens with government departments.',
      },
      {
        name: 'National Social Assistance Programme (NSAP)',
        portal: 'nsap.nic.in',
        description: 'Pensions for elderly, widows, and persons with disabilities living below the poverty line.',
      },
    ],
    helplines: [
      {
        agency: 'National Consumer Helpline',
        phone: '1915',
        availability: 'Toll-Free, 24/7 Citizen Assistance',
      },
      {
        agency: 'Senior Citizen National Helpline (Elderline)',
        phone: '14567',
        availability: 'Free Assistance & Pension Follow-ups',
      },
    ],
  },
};

export default function App() {
  // Form input state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [problemDescription, setProblemDescription] = useState<string>('');
  
  // Validation error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copied state for checklist
  const [copied, setCopied] = useState(false);

  // Submitted result state
  const [submittedData, setSubmittedData] = useState<{
    category: Category;
    description: string;
    submittedAt: string;
  } | null>(null);

  // Handle category toggle
  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
    if (errorMessage) setErrorMessage(null);
  };

  // Handle form submission with required validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedDescription = problemDescription.trim();

    // Validation: Require at least a category OR problem description
    if (!selectedCategory && !trimmedDescription) {
      setErrorMessage(
        'Please select a category or describe your problem before proceeding.'
      );
      return;
    }

    setErrorMessage(null);

    // Default category fallback to 'Other Problems' if user only typed text
    const finalCategory: Category = selectedCategory || 'Other Problems';

    // Record submission state
    setSubmittedData({
      category: finalCategory,
      description: trimmedDescription || `Inquiry regarding ${finalCategory} issues`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Smooth scroll down to results section
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle resetting the form
  const handleReset = () => {
    setSelectedCategory(null);
    setProblemDescription('');
    setErrorMessage(null);
    setSubmittedData(null);
    setCopied(false);
  };

  // Quick fill sample helper
  const handleLoadSample = (sample: typeof SAMPLE_PROBLEMS[0]) => {
    setSelectedCategory(sample.category);
    setProblemDescription(sample.text);
    setErrorMessage(null);
  };

  // Copy checklist helper
  const handleCopyChecklist = (steps: string[]) => {
    const textToCopy = `Nirvaha AI Action Plan:\n` + steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeGuidance = submittedData ? GUIDANCE_DATA[submittedData.category] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-200">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">Nirvaha AI</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Life Problem Guidance Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Guidance Assistant Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* Hero Section */}
        <section className="text-center sm:text-left bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-100/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Empowering Everyday Decisions
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tell us what's wrong.{' '}
            <span className="text-emerald-700 block sm:inline">
              Discover what to do next.
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Navigating everyday life difficulties can feel overwhelming—from complicated
            government welfare schemes to unexpected crop failures, educational fees, or job
            searches. <strong className="font-medium text-slate-800">Nirvaha AI</strong> is
            designed to help you understand your problem clearly and discover structured,
            verified next steps and local support.
          </p>
        </section>

        {/* Input Form Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Step 1: Select Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Select a category
                </label>
                <span className="text-xs text-slate-400">Choose one that fits best</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {cat.title}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {cat.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Describe the Problem */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="problem-text" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Describe your problem
                </label>
                <span className="text-xs text-slate-400">In plain words</span>
              </div>

              <textarea
                id="problem-text"
                rows={4}
                value={problemDescription}
                onChange={(e) => {
                  setProblemDescription(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Example: I lost my crops due to unseasonal rain last week and I don't know which government compensation scheme to apply for or what documents are needed..."
                className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
              />

              {/* Sample prompt buttons */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Try an example:
                </span>
                {SAMPLE_PROBLEMS.map((sample) => (
                  <button
                    type="button"
                    key={sample.label}
                    onClick={() => handleLoadSample(sample)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-sm shadow-emerald-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Find My Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {(selectedCategory || problemDescription) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear Form</span>
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Results Area */}
        {submittedData && activeGuidance && (
          <section
            id="result-section"
            className="bg-white border-2 border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
          >
            {/* Confirmation Banner */}
            <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Action Plan Ready
                  </h2>
                  <span className="text-xs text-slate-400">
                    Generated at {submittedData.submittedAt}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  We have mapped your issue to relevant government programs, immediate steps, and support helplines.
                </p>
              </div>
            </div>

            {/* User Submission Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Submitted Request
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Category</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                    {submittedData.category}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-500 block">Your Description</span>
                  <p className="text-slate-800 text-sm italic mt-0.5 whitespace-pre-wrap">
                    "{submittedData.description}"
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Headline & Overview */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-700" />
                {activeGuidance.headline}
              </h3>
              <p className="text-sm text-emerald-900/90 mt-1.5 leading-relaxed">
                {activeGuidance.overview}
              </p>
            </div>

            {/* Step-by-Step Action Checklist */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-600" />
                  Immediate Action Checklist
                </h3>
                <button
                  type="button"
                  onClick={() => handleCopyChecklist(activeGuidance.checklist)}
                  className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Checklist</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2.5">
                {activeGuidance.checklist.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 hover:border-emerald-200 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relevant Government Schemes & Welfare Initiatives */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Relevant Government Schemes & Official Portals
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeGuidance.schemes.map((scheme, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between hover:border-emerald-200 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{scheme.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {scheme.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-700 font-medium">
                        {scheme.portal}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Support Helplines */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Verified Support & Grievance Helplines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeGuidance.helplines.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-medium text-slate-900 block">
                        {line.agency}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {line.availability}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                      {line.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset / Submit Another Query Button */}
            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Search Another Problem</span>
              </button>
            </div>
          </section>
        )}

        {/* Informational Benefits Section */}
        <section className="border border-slate-200 bg-white rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              How Nirvaha AI Supports You
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Nirvaha AI demystifies government procedures and complex administrative hurdles into simple, actionable steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-semibold text-slate-800 block mb-1">
                Plain-Language Guidance
              </span>
              <p className="text-slate-500 leading-relaxed">
                Describe your situation without legal or bureaucratic jargon and receive an easy-to-read explanation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-semibold text-slate-800 block mb-1">
                Verified Welfare Access
              </span>
              <p className="text-slate-500 leading-relaxed">
                Connect directly with official government portals, criteria requirements, and active welfare schemes.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-semibold text-slate-800 block mb-1">
                Direct Helplines
              </span>
              <p className="text-slate-500 leading-relaxed">
                Access toll-free grievance helplines and nearby citizen service centres to resolve bottlenecks quickly.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-700">Nirvaha AI</span>
            <span>—</span>
            <span>Empowering citizens with clear, accessible life guidance</span>
          </div>
          <div>
            Built with React, TypeScript, and Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}
