import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Smartphone, X, CheckCircle, Sparkles, Send, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.fitkobra.app';

export default function AndroidDownloadModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      if (db) {
        await addDoc(collection(db, 'android_launch_waitlist'), {
          email: email.trim().toLowerCase(),
          createdAt: serverTimestamp(),
          source: 'website_android_modal',
        });
      }
    } catch (err) {
      console.warn('Waitlist Firestore notification logged:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg glass-panel bg-white dark:bg-slate-950 rounded-3xl border border-emerald-500/40 p-8 space-y-6 shadow-2xl overflow-hidden">
        
        {/* Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#00FF75]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-[#00FF75] mx-auto shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> GOOGLE PLAY STORE • SUBMISSION IN REVIEW
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Get FitKobra for Android
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            FitKobra is officially submitted to the Google Play Store and currently undergoing final review. You can visit our store listing or sign up for instant launch alerts!
          </p>
        </div>

        {/* Official Play Store Button */}
        <div className="space-y-3">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 hover:scale-[1.02] hover:shadow-emerald-500/40 transition-all"
          >
            <Smartphone className="w-5 h-5 fill-black" />
            <span>Open Google Play Store</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </a>
          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF75]" /> Verified 100% Free • No Subscription Required
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-white/10 w-full"></div>
          <span className="bg-white dark:bg-slate-950 px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">or get launch alert</span>
          <div className="border-t border-slate-200 dark:border-white/10 w-full"></div>
        </div>

        {/* Email Notification Form */}
        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-[#00FF75] mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">You're on the VIP Launch List!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              We'll send an instant download alert to <strong className="text-emerald-600 dark:text-emerald-400">{email}</strong> as soon as Google Play approval is complete!
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 bg-[#00FF75] text-black font-bold text-xs rounded-xl"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enter Email for Direct Launch Link &amp; Free AI Credits</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="athlete@fitkobra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 focus:border-emerald-500 dark:focus:border-[#00FF75] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 border border-slate-700 dark:border-white/20 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#00FF75]" />
                  <span>{loading ? 'Joining...' : 'Alert Me'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
