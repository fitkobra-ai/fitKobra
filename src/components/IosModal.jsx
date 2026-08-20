import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Apple, X, CheckCircle, Sparkles, Send } from 'lucide-react';

export default function IosModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md glass-panel bg-slate-950 rounded-3xl border border-cyan-500/40 p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto shadow-lg shadow-cyan-500/20">
            <Apple className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-heading text-white">
            FitKobra is Coming to iOS Soon!
          </h3>
          <p className="text-xs text-slate-300">
            We are currently putting the final touches on our iOS release. Enter your email below to receive early TestFlight access & exclusive launch perks!
          </p>
        </div>

        {/* Form or Submitted Confirmation */}
        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-[#00FF75] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">You're on the VIP Waitlist!</h4>
            <p className="text-xs text-slate-300">
              We've reserved your early access spot for <strong className="text-emerald-400">{email}</strong>. Watch your inbox for launch invites!
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
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="athlete@fitkobra.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/20 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00FF75] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
            >
              <Send className="w-4 h-4" />
              Notify Me at Launch
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
