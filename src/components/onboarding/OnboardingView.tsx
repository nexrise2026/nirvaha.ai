import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRole, SocialCategory } from '../../types';
import { STATES_AND_DISTRICTS } from '../../data/districts';
import { INDIAN_LANGUAGES } from '../../data/languages';
import {
  ShieldCheck,
  Smartphone,
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  Sprout,
  Briefcase,
  HeartHandshake,
  Accessibility,
  CheckCircle2,
  Globe2,
  Laptop,
  Sparkles,
  Info
} from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    onboardingStep,
    setOnboardingStep,
    userProfile,
    setUserProfile,
    quickDemoLogin,
  } = useApp();

  // Step 1 Form State
  const [identifier, setIdentifier] = useState('9845012345');
  const [password, setPassword] = useState('••••••••••');
  const [isOtherDevice, setIsOtherDevice] = useState(false);
  const [otp, setOtp] = useState('482910');

  // Step 2 Form State
  const [selectedRole, setSelectedRole] = useState<CitizenRole>(userProfile.role || 'Student');

  // Step 3 Form State
  const [name, setName] = useState(userProfile.fullName || 'Ramesh Gowda');
  const [selectedState, setSelectedState] = useState(userProfile.state || 'Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState(userProfile.district || 'Bengaluru Urban');
  const [socialCategory, setSocialCategory] = useState<SocialCategory>(userProfile.socialCategory || 'OBC');
  const [annualIncome, setAnnualIncome] = useState(userProfile.annualIncome || 'Below ₹1 Lakh');
  const [rationCard, setRationCard] = useState(userProfile.rationCard || 'Priority Household (PHH)');
  const [gender, setGender] = useState(userProfile.gender || 'Male');
  const [roleProofNumber, setRoleProofNumber] = useState(userProfile.roleProofNumber || 'SATS-2026-98421');

  // Current districts based on state
  const currentDistricts =
    STATES_AND_DISTRICTS.find((s) => s.state === selectedState)?.districts || [
      'Bengaluru Urban',
      'Bengaluru Rural',
      'Mysuru',
    ];

  // Handle Step 1 Submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingStep(2);
  };

  // Handle Step 2 Submit
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      role: selectedRole,
      roleProofNumber:
        selectedRole === 'Student'
          ? 'SATS-2026-98421'
          : selectedRole === 'Farmer'
          ? 'FID-KA-991204'
          : selectedRole === 'Worker'
          ? 'KA-BOCW-2024-81729'
          : selectedRole === 'Senior Citizen'
          ? 'PEN-KA-65-8912'
          : 'KA2910481940182910',
    }));
    setRoleProofNumber(
      selectedRole === 'Student'
        ? 'SATS-2026-98421'
        : selectedRole === 'Farmer'
        ? 'FID-KA-991204'
        : selectedRole === 'Worker'
        ? 'KA-BOCW-2024-81729'
        : selectedRole === 'Senior Citizen'
        ? 'PEN-KA-65-8912'
        : 'KA2910481940182910'
    );
    setOnboardingStep(3);
  };

  // Handle Step 3 Submit
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      fullName: name,
      role: selectedRole,
      state: selectedState,
      district: selectedDistrict,
      socialCategory,
      annualIncome,
      rationCard,
      gender,
      roleProofNumber,
      phone: identifier.includes('@') ? '9845012345' : identifier,
      email: identifier.includes('@') ? identifier : 'ramesh.gowda@gmail.com',
      isAuthenticated: true,
    });
    setOnboardingStep(0);
  };

  const ROLES: {
    role: CitizenRole;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      role: 'Student',
      title: 'Student / Scholastic Beneficiary',
      description: 'Post-matric scholarships, fee concessions, Vidyasiri grants, exams & hostel aids',
      icon: GraduationCap,
    },
    {
      role: 'Farmer',
      title: 'Farmer / Agri Cultivator',
      description: 'Bhoomi FRUITS portal, PM-KISAN, crop insurance loss relief (PMFBY) & input subsidies',
      icon: Sprout,
    },
    {
      role: 'Worker',
      title: 'Worker / Artisan / Labour',
      description: 'BOCW construction welfare card, e-Shram social security, tool kits & accidental coverage',
      icon: Briefcase,
    },
    {
      role: 'Senior Citizen',
      title: 'Senior Citizen (60+ Years)',
      description: 'Sandhya Suraksha pension, IGNOAPS, KSRTC bus pass concessions & health assistance',
      icon: HeartHandshake,
    },
    {
      role: 'Person with Disability',
      title: 'Person with Disability (Divyangjan)',
      description: 'UDID smart cards, Mythri monthly sustenance pension, motorized tricycles & ADIP aids',
      icon: Accessibility,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      {/* Language Switcher Bar at Top */}
      <div className="w-full max-w-xl mb-6 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-indigo-400" />
          <span className="font-medium">Language / ಭಾಷೆ / भाषा:</span>
        </div>
        <select
          value={language.code}
          onChange={(e) => {
            const match = INDIAN_LANGUAGES.find((l) => l.code === e.target.value);
            if (match) setLanguage(match);
          }}
          className="bg-slate-900/90 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-indigo-400 focus:outline-none"
        >
          {INDIAN_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>

      {/* Main High-Contrast Solid White Card */}
      <div className="w-full max-w-xl bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              N
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight block">
                NIRVAHA AI
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Public Service Navigation Agent
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                onboardingStep === 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              1
            </span>
            <span className="text-slate-300">━</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                onboardingStep === 2
                  ? 'bg-indigo-600 text-white'
                  : onboardingStep > 2
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </span>
            <span className="text-slate-300">━</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                onboardingStep === 3
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </span>
          </div>
        </div>

        {/* STEP 1: CITIZEN SECURE SIGN-IN */}
        {onboardingStep === 1 && (
          <div>
            <div className="text-center mb-6">
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs px-3 py-1 rounded-full mb-3">
                CITIZEN SECURE SIGN-IN
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-2">
                {t.signInTitle}
              </h1>
              <p className="text-sm text-slate-600 font-normal text-center mb-6 leading-relaxed">
                {t.signInSubtitle}
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g., 9845012345 or citizen@gmail.com"
                    className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium text-sm rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                  Password / PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium text-sm rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none w-full"
                  />
                </div>
              </div>

              {/* Checkbox for Other / New Device */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOtherDevice}
                    onChange={(e) => setIsOtherDevice(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Logging in with other / new device?
                  </span>
                </label>
              </div>

              {/* OTP Input if other device */}
              {isOtherDevice && (
                <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-900">Enter 6-Digit OTP</span>
                    <span className="text-indigo-600 font-medium cursor-pointer">Resend OTP (28s)</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-bold bg-white border border-indigo-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Device Status Bar */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-slate-500" />
                  <span>Detected: Windows PC</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Device ID:</span>
                  <span className="bg-white border border-slate-300 text-slate-800 font-mono px-2 py-0.5 rounded text-[11px] font-bold">
                    DEV-86CJ
                  </span>
                </div>
              </div>

              {/* Submit Continue Button */}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-md transition-all w-full flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Bypass */}
            <div className="mt-5 pt-4 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={() => quickDemoLogin('Student')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.quickDemoSignIn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ROLE SELECTION */}
        {onboardingStep === 2 && (
          <div>
            <div className="text-center mb-6">
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs px-3 py-1 rounded-full mb-3">
                STEP 2 OF 3
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-2">
                {t.selectRoleTitle}
              </h1>
              <p className="text-sm text-slate-600 font-normal text-center mb-6 leading-relaxed">
                {t.selectRoleSubtitle}
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-3">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`bg-white hover:bg-indigo-50/50 border transition-all rounded-xl p-4 cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">
                          {r.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">
                        {r.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Profile →</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: PROFILE CONFIGURATION */}
        {onboardingStep === 3 && (
          <div>
            <div className="text-center mb-6">
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs px-3 py-1 rounded-full mb-3">
                STEP 3 OF 3
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-2">
                {t.profileConfigTitle}
              </h1>
              <p className="text-sm text-slate-600 font-normal text-center mb-6 leading-relaxed">
                {t.profileConfigSubtitle}
              </p>
            </div>

            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                  Citizen Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    State / Territory
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setSelectedState(newState);
                      const stateDistricts =
                        STATES_AND_DISTRICTS.find((s) => s.state === newState)?.districts || [];
                      if (stateDistricts.length > 0) {
                        setSelectedDistrict(stateDistricts[0]);
                      }
                    }}
                    className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                  >
                    {STATES_AND_DISTRICTS.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Social Category
                  </label>
                  <select
                    value={socialCategory}
                    onChange={(e) => setSocialCategory(e.target.value as SocialCategory)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Annual Income Band
                  </label>
                  <select
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                  >
                    <option value="Below ₹1 Lakh">Below ₹1 Lakh / year</option>
                    <option value="₹1 - 2.5 Lakhs">₹1 - 2.5 Lakhs / year</option>
                    <option value="₹2.5 - 5 Lakhs">₹2.5 - 5 Lakhs / year</option>
                    <option value="Above ₹5 Lakhs">Above ₹5 Lakhs / year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Ration Card Type
                  </label>
                  <select
                    value={rationCard}
                    onChange={(e) => setRationCard(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                  >
                    <option value="Priority Household (PHH)">Priority Household (BPL / PHH)</option>
                    <option value="Antyodaya Anna Yojana (AAY)">Antyodaya Anna Yojana (AAY)</option>
                    <option value="Non-Priority (NPHH)">Non-Priority (APL / NPHH)</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                  {selectedRole === 'Student'
                    ? 'Student Registration / SATS ID'
                    : selectedRole === 'Farmer'
                    ? 'FRUITS Farmer ID (FID) / Survey No.'
                    : selectedRole === 'Worker'
                    ? 'Labour Smart Card / e-Shram UAN'
                    : selectedRole === 'Senior Citizen'
                    ? 'Pension Sanction ID / Senior Proof'
                    : 'UDID Card Number (18 Digits)'}
                </label>
                <input
                  type="text"
                  required
                  value={roleProofNumber}
                  onChange={(e) => setRoleProofNumber(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero sensitive credentials stored.</strong> All identification stays in
                  your local session with granular department consent.
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.saveProfileBtn}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
