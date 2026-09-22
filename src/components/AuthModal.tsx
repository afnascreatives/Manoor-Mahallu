import React, { useState } from 'react';
import {
  Lock,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  Key
} from 'lucide-react';
import { User } from '../types/index.ts';
import { api, setStoredSession } from '../lib/api.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // Login Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register Form - Simple & straightforward: First Name + Password + Optional Details
  const [regFirstName, setRegFirstName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regHouseName, setRegHouseName] = useState('');
  const [regWard, setRegWard] = useState('Ward 4 - Juma Masjid Road');

  if (!isOpen) return null;

  const isAdminTerm = username.trim().toLowerCase() === 'afnas';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isAdminTerm && (!passkey || passkey.length !== 4)) {
      setError('Please enter the 4-digit Admin security passkey.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.login(username.trim(), password, passkey.trim() || undefined);
      setStoredSession(res.token, res.user);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!regFirstName.trim()) {
      setError('Please enter your First Name.');
      setLoading(false);
      return;
    }
    if (!regPassword || regPassword.length < 1) {
      setError('Please create a password for your account.');
      setLoading(false);
      return;
    }

    try {
      const name = regFirstName.trim();
      const loginName = (regUsername.trim() || name.split(' ')[0]).toLowerCase().replace(/[^a-z0-9]/g, '');

      const res = await api.register({
        fullName: name,
        firstName: name,
        username: loginName,
        password: regPassword,
        phone: regPhone.trim() || '+91 94470 00000',
        houseName: regHouseName.trim() || `${name} Manzil`,
        ward: regWard,
      });

      setStoredSession(res.token, res.user);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Manoor Mahallu Portal
            </span>
            <h3 className="font-display text-2xl font-extrabold text-slate-900 mt-1">
              {tab === 'LOGIN' ? 'Account Sign In' : 'Member Registration'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTab('LOGIN')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'LOGIN'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('REGISTER')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'REGISTER'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register (New Member)
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {tab === 'LOGIN' ? (
          <div className="space-y-4">
            {/* Standard Login Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Name or Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or member name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* 4-Digit Security Passkey for Admin Access */}
              {isAdminTerm && (
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-600" />
                      <span>4-Digit Security Passkey</span>
                    </label>
                    <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">Required for Admin</span>
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    className="w-full px-4 py-2 tracking-[0.3em] font-mono text-center rounded-xl bg-white border border-blue-300 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-blue-700">
                    Enter the authorized 4-digit Mahallu administrator passkey.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>{loading ? 'Verifying...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          /* Streamlined Member Registration Form */
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 text-xs leading-relaxed">
              Register with your <strong>First Name</strong> and <strong>Created Password</strong>. You can immediately sign in with them after registering.
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                First Name (or Full Name) *
              </label>
              <input
                type="text"
                required
                value={regFirstName}
                onChange={(e) => {
                  setRegFirstName(e.target.value);
                  if (!regUsername) {
                    setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                  }
                }}
                placeholder="e.g. Afnas, Rashid, Amina"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Create Password *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create your password (e.g. 123)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Login Username (Optional)
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Defaults to first name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 94470 00000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  House Name (Optional)
                </label>
                <input
                  type="text"
                  value={regHouseName}
                  onChange={(e) => setRegHouseName(e.target.value)}
                  placeholder="e.g. Kalluvila House"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ward
                </label>
                <select
                  value={regWard}
                  onChange={(e) => setRegWard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Ward 1 - School Road">Ward 1 - School Road</option>
                  <option value="Ward 2 - Market Road">Ward 2 - Market Road</option>
                  <option value="Ward 3 - River View">Ward 3 - River View</option>
                  <option value="Ward 4 - Juma Masjid Road">Ward 4 - Juma Masjid Road</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Member Account...' : 'Register & Enter Member Portal'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Encrypted Session</span>
          <span className="text-blue-700 font-semibold">Manoor Mahallu WAKF Board</span>
        </div>

      </div>
    </div>
  );
};
