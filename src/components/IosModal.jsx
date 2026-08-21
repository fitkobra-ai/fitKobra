import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Apple, X, CheckCircle, Sparkles, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function IosModal({ isOpen, onClose }) {
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
        await addDoc(collection(db, 'ios_waitlist'), {
          email: email.trim().toLowerCase(),
          createdAt: serverTimestamp(),
          source: 'website_ios_modal',
        });
      }
    } catch (err) {
      console.warn('Waitlist Firestore notification logged:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md glass-panel bg-white dark:bg-slate-950 rounded-3xl border border-cyan-500/40 p-8 space-y-6 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 dark:bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-300 mx-auto shadow-lg shadow-cyan-500/20">
            <Apple className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            FitKobra is Coming to iOS Soon!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            We are currently putting the final touches on our iOS release. Enter your email below to receive early TestFlight access &amp; exclusive launch perks!
          </p>
        </div>

        {/* Form or Submitted Confirmation */}
        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-[#00FF75] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">You're on the VIP Waitlist!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              We've reserved your early access spot for <strong className="text-emerald-600 dark:text-emerald-400">{email}</strong>. Watch your inbox for launch invites!
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2.5 bg-[#00FF75] text-black font-bold text-xs rounded-xl"
            >
              Back to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="athlete@fitkobra.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/20 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00FF75] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Joining...' : 'Notify Me at Launch'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
