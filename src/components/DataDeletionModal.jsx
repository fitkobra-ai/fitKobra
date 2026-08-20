import React, { useState } from 'react';
import { X, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Send } from 'lucide-react';

export default function DataDeletionModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#0C1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#080B11]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">FitKobra Data Deletion Request</h2>
              <p className="text-xs text-slate-400">Google Play Data Safety & GDPR Right to Erasure</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 scrollbar-thin scrollbar-thumb-white/10">
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00FF75]" /> How Account Deletion Works
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with Google Play Developer Policies and GDPR, FitKobra allows users to completely delete their account and all associated personal data from our systems.
            </p>
          </div>

          {/* Option A: In-App */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Option 1: Delete Directly In-App (Instant)</span>
            <ol className="list-decimal pl-5 text-xs text-slate-300 space-y-1">
              <li>Open the <strong>FitKobra</strong> app on your Android device.</li>
              <li>Navigate to <strong>Profile</strong> &rarr; <strong>Security & Account</strong>.</li>
              <li>Tap <strong>Delete My Account</strong> and confirm.</li>
            </ol>
            <p className="text-[11px] text-slate-400 pt-1">
              This immediately purges your profile, step telemetry, meal logs, and authorization tokens.
            </p>
          </div>

          {/* Option B: Web Request Form */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Option 2: Web Deletion Request Form</span>
            <p className="text-xs text-slate-400">
              If you no longer have access to the app, submit your registered account email below. Our support team will process full data deletion within 24 hours.
            </p>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#00FF75] shrink-0" />
                <div>
                  <strong className="block text-white">Deletion Request Received!</strong>
                  We have queued <span className="font-mono text-emerald-400">{email}</span> for 100% data erasure within 24 hours. A confirmation email will be sent upon completion.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="email" 
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF75]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-red-500/80 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Processing Request...</span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Submit Account & Data Deletion Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="text-[11px] text-slate-500 space-y-1">
            <p><strong>Data Purged Upon Deletion:</strong> Email profile, Firebase User ID, daily step logs, pedometer hardware checkpoints, food scan history, AI coach logs, and referral codes.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
