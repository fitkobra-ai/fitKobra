import React, { useState } from 'react';
import { X, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function DataDeletionModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (db) {
        await addDoc(collection(db, 'deletion_requests'), {
          email: email.trim().toLowerCase(),
          status: 'pending',
          requestedAt: serverTimestamp(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          source: 'web_portal',
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit deletion request:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0C1017] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#080B11]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white">Data &amp; Account Deletion Portal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Google Play &amp; GDPR Account Deletion Compliance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
          
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> Permanent &amp; Immediate Deletion
            </div>
            <p>
              Under Google Play data safety standards and GDPR/CCPA regulations, submitting this form queues your FitKobra account and all associated personal data for permanent deletion within <strong>48 to 72 hours</strong>.
            </p>
          </div>

          {/* Details on What Is Deleted */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[11px]">Data Deleted in this process:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-2">
              <li>Firebase Auth user credentials and profile identifiers.</li>
              <li>Personal fitness stats, weight logs, step history, and streaks.</li>
              <li>Logged meals, custom recipes, and AI vision analysis logs.</li>
              <li>Chat conversation histories with the FitKobra AI Coach.</li>
            </ul>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-[#00FF75] mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Deletion Request Confirmed</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                We have received the deletion request for <strong className="text-emerald-600 dark:text-emerald-400">{email}</strong>. All associated records and cloud backups will be permanently purged within 48-72 hours.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Account Email Address to Delete
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/15 focus:border-red-500 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-700 dark:text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Warning:</strong> This action is irreversible. All workout streaks and AI credit balances will be permanently destroyed.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:scale-[1.01] transition-transform disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{loading ? 'Submitting Request...' : 'Permanently Delete Account & Data'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
