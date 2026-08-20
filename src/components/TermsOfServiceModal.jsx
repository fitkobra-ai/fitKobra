import React from 'react';
import { X, FileText, AlertTriangle, Stethoscope, Dumbbell, ShieldAlert } from 'lucide-react';

export default function TermsOfServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0C1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#080B11]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">Terms of Service & Medical Disclaimer</h2>
              <p className="text-xs text-slate-400">FitKobra Application (<span className="text-emerald-400 font-mono">com.fitkobra.app</span>)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Medical AI Fallback Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
            <Stethoscope className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-amber-300 font-bold block text-sm">IMPORTANT MEDICAL & DIETARY DISCLAIMER:</strong>
              <p>
                FitKobra and its AI Fitness Coach provide exercise guides, workout tracking, and general fitness information for educational purposes ONLY. 
                <strong>FitKobra IS NOT A LICENSED MEDICAL DOCTOR, PHYSICIAN, OR REGISTERED DIETITIAN (RD).</strong> 
                The AI Coach will refuse to prescribe therapeutic meal plans or manage medical conditions (such as Diabetes, Chronic Kidney Disease, Hypertension, Severe Allergies, Pregnancy, or Eating Disorders). Always consult a licensed healthcare professional before starting any new diet or exercise regimen.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#00FF75]" /> 1. Acceptance of Terms & Service Scope
            </h3>
            <p className="text-xs">
              By downloading, installing, or using the FitKobra mobile application or website, you agree to be bound by these Terms of Service. FitKobra provides automated step counting, 3D biomechanics video form guides, macro scanning, and general AI fitness coaching.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> 2. Assumption of Physical Risk
            </h3>
            <p className="text-xs">
              Physical exercise, weight training, and athletic activities carry inherent risks of physical injury. By performing any exercises demonstrated in FitKobra form guides or suggested by the AI Coach, you voluntarily assume all risk of injury and agree to release FitKobra from any claims or liability arising from your workout activities.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> 3. User Conduct & Referral Integrity
            </h3>
            <p className="text-xs text-slate-400">
              Users agree not to exploit, hack, or artificially inflate pedometer hardware step counts or tamper with referral rewards. FitKobra reserves the right to suspend accounts engaged in fraudulent activity or referral system abuse.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> 4. Intellectual Property
            </h3>
            <p className="text-xs text-slate-400">
              All branding, 3D skeleton animation models, video guides, software code, and logo artwork associated with FitKobra are the exclusive intellectual property of FitKobra. Unauthorized duplication or redistribution is strictly prohibited.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080B11] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00FF75] text-black font-extrabold rounded-xl text-xs hover:bg-[#00FF75]/90 transition-colors"
          >
            I Agree to Terms
          </button>
        </div>

      </div>
    </div>
  );
}
