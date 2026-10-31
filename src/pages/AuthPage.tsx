import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Hospital,
  Pill,
  Stethoscope,
  Sparkles,
  SearchX,
  Laugh,
  ArrowDown,
  RefreshCw,
  FileQuestion,
} from 'lucide-react';
import { useAuth, DEMO_ORGANIZATIONS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FUNNY_MESSAGES = [
  {
    title: '🚨 Diagnostic 404: User Not Found in Hospital Archives!',
    subtitle: 'Dr. Watson searched all 4 floors, checked behind the CT scanner, and even asked the cafeteria chef... nobody exists with these credentials!',
    rx: 'Prescription: Do not panic. Simply click the shiny "Tester Login" button right below to bypass!',
  },
  {
    title: '🩺 Medical Chart Alert: Patient/User Record Missing!',
    subtitle: 'Nurse Nancy pulled every file drawer from 1994 to today. You are completely off the medical grid!',
    rx: 'Treatment Plan: Abandon typing and hit "Tester Login" for immediate VIP clearance.',
  },
  {
    title: '🧬 Biometric Scan Result: 0.00% Match!',
    subtitle: 'Our laboratory centrifuge spun your email and password at 16,000 RPM and found only saline solution!',
    rx: 'Clinical Advice: Bypass credentials instantly using the Tester Login button below.',
  },
  {
    title: '🩻 X-Ray Analysis: Zero Account Traces Detected!',
    subtitle: 'The radiologist squinted, held the negative up to the light, and confirmed: definitely a ghost account.',
    rx: 'Doctor Note: Click "Tester Login" — it works every single time with zero paperwork!',
  },
];

export const AuthPage: React.FC = () => {
  const { login, completeOnboarding } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isErrorActive, setIsErrorActive] = useState(false);
  const [funnyIndex, setFunnyIndex] = useState(0);
  const [wobbleKey, setWobbleKey] = useState(0);
  const [isTesterLoading, setIsTesterLoading] = useState(false);

  // When the regular LOGIN button is pressed -> DO NOT ALLOW ENTRY, show funny animation and message!
  const handleRegularLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsErrorActive(true);
    setWobbleKey((prev) => prev + 1);
    setFunnyIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);

    showToast(
      '⚠️ User Not Found!',
      'Hospital archives returned zero records! Try the "Tester Login" button below.',
      'error'
    );
  };

  // TESTER LOGIN -> Gains immediate full access without email and password
  const handleTesterLogin = (orgType: 'Hospital' | 'Pharmacy' | 'Clinic' = 'Hospital') => {
    setIsTesterLoading(true);
    const org = DEMO_ORGANIZATIONS[orgType];

    setTimeout(() => {
      login('tester.procurement@medsupplydirect.com', orgType);
      completeOnboarding(orgType);
      setIsTesterLoading(false);
      showToast(
        '🧪 Tester Access Granted',
        `Authenticated as Lead Procurement Specialist (${org.name})`,
        'success'
      );
      navigate('/');
    }, 450);
  };

  const activeFunny = FUNNY_MESSAGES[funnyIndex];

  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0E9AA7] text-white shadow-lg shadow-[#0E9AA7]/20 mb-3 animate-bounce-gentle">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <rect x="9.5" y="4" width="5" height="16" rx="1.5" />
            <rect x="4" y="9.5" width="16" height="5" rx="1.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#12304A]">
          MedSupply Direct
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          B2B Wholesale Medical Portal · Procurement Authentication
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div
          key={wobbleKey}
          className={`bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 transition-all ${
            isErrorActive ? 'animate-wobble border-[#F26B5B] shadow-rose-100 ring-2 ring-[#F26B5B]/30' : ''
          }`}
        >
          {/* FUNNY "USER NOT FOUND" ANIMATED DISPLAY */}
          {isErrorActive && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FEF2F1] border-2 border-[#F26B5B] text-xs text-slate-800 space-y-3 relative overflow-hidden transition-all shadow-sm">
              <div className="flex items-start gap-3">
                {/* Animated searching doctor / magnifying glass */}
                <div className="w-12 h-12 rounded-2xl bg-white text-[#F26B5B] border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <SearchX className="w-6 h-6 animate-spin text-[#F26B5B]" style={{ animationDuration: '3s' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-rose-900 leading-snug">
                      {activeFunny.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-rose-200/80 text-rose-800 px-1.5 py-0.5 rounded">
                      Attempt #{wobbleKey}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    {activeFunny.subtitle}
                  </p>
                </div>
              </div>

              {/* Prescription joke banner */}
              <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                  <Laugh className="w-4 h-4 text-[#F26B5B] shrink-0" />
                  <span>{activeFunny.rx}</span>
                </div>
                <ArrowDown className="w-4 h-4 text-[#0E9AA7] animate-bounce shrink-0" />
              </div>
            </div>
          )}

          {/* MAIN LOGIN FORM (Email + Password + Login Button) */}
          <form onSubmit={handleRegularLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Medical Officer / Procurement Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isErrorActive) setIsErrorActive(false);
                  }}
                  placeholder="procurement@hospital-trust.org"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7] text-[#12304A] bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-[#0E9AA7] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isErrorActive) setIsErrorActive(false);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0E9AA7] text-[#12304A] bg-slate-50/50"
                />
              </div>
            </div>

            {/* Regular Login Button (Always triggers user-not-found message as requested) */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              Sign In with Credentials <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-bold text-slate-400 text-[10px] tracking-wider">
                OR BYPASS WITH TESTER ACCESS
              </span>
            </div>
          </div>

          {/* TESTER LOGIN BUTTON (PROMINENT 1-CLICK INSTANT BYPASS) */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isTesterLoading}
              onClick={() => handleTesterLogin('Hospital')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0E9AA7] to-[#086D77] hover:from-[#0B8591] hover:to-[#06545C] shadow-md shadow-[#0E9AA7]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 group"
            >
              {isTesterLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Loading MedSupply Direct Workspace...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Tester Login (1-Click Instant Bypass)</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 font-medium">
              ✨ Instant demo access: No email or password needed for evaluating the wholesale portal.
            </p>

            {/* Quick Organization Presets for Testing */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Or Test As Specific Organization Type:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTesterLogin('Hospital')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0E9AA7] hover:bg-[#E6F4FA]/50 text-center transition-all group"
                >
                  <Hospital className="w-4 h-4 text-[#0E9AA7] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#12304A] block">Hospital</span>
                  <span className="text-[9px] text-slate-400 block">$150k Limit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTesterLogin('Pharmacy')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0E9AA7] hover:bg-[#E6F4FA]/50 text-center transition-all group"
                >
                  <Pill className="w-4 h-4 text-[#0E9AA7] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#12304A] block">Pharmacy</span>
                  <span className="text-[9px] text-slate-400 block">$45k Limit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTesterLogin('Clinic')}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0E9AA7] hover:bg-[#E6F4FA]/50 text-center transition-all group"
                >
                  <Stethoscope className="w-4 h-4 text-[#0E9AA7] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-[#12304A] block">Clinic</span>
                  <span className="text-[9px] text-slate-400 block">$30k Limit</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ISO 27001 & NHS Healthcare Procurement Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
