import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthView = () => {
  const { login, register, isAuthenticated, user, logout } = useAuth();
  
  const [isLoginState, setIsLoginState] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isLoginState) {
      const res = await login(username, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Successfully authenticated! Redirecting...');
      }
    } else {
      const res = await register(username, email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Account created successfully! You can now log in.');
        setIsLoginState(true);
        setPassword('');
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto glass-premium rounded-3xl p-8 border border-slate-100 dark:border-slate-850 text-center h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-dark-lighter flex items-center justify-center text-brand-600 dark:text-brand-400 font-extrabold text-xl shadow-md mb-4 border border-brand-100 dark:border-brand-900 uppercase">
          {user?.username?.substring(0, 2)}
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">Developer Authenticated</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
          Logged in as <strong className="text-slate-700 dark:text-slate-350">{user?.username}</strong> ({user?.email})
        </p>

        <button
          onClick={logout}
          className="px-6 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-200 dark:border-red-900 transition-all active:scale-98"
        >
          Sign Out of Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto glass-premium rounded-3xl p-8 border border-slate-100 dark:border-slate-850 shadow-2xl h-[calc(100vh-10rem)] flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500 shadow-md">
          {isLoginState ? <LogIn size={22} /> : <UserPlus size={22} />}
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {isLoginState ? "Developer Login" : "Create Account"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLoginState ? "Authenticate to access cloud swatches" : "Register a private developer profile"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Developer Username</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dev_craft"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
        </div>

        {/* Email (only if register state) */}
        {!isLoginState && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Developer Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Secure Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-xs font-semibold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 text-xs font-semibold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-900/50">
            <CheckCircle size={14} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
        >
          {loading ? "Processing..." : isLoginState ? "Sign In" : "Register Profile"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        {isLoginState ? (
          <span>
            New to DevColor Studio?{" "}
            <button
              onClick={() => {
                setIsLoginState(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-brand-600 dark:text-brand-400 hover:underline bg-transparent"
            >
              Create an account
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button
              onClick={() => {
                setIsLoginState(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-brand-600 dark:text-brand-400 hover:underline bg-transparent"
            >
              Log in
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthView;
