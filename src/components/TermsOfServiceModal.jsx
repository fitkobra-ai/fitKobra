import React from 'react';
import { X, FileText, AlertTriangle, Stethoscope, Dumbbell, ShieldAlert } from 'lucide-react';

export default function TermsOfServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0C1017] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#080B11]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white">Terms of Service &amp; Medical Disclaimer</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">FitKobra Application (<span className="text-emerald-600 dark:text-emerald-400 font-mono">com.fitkobra.app</span>)</p>
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
          
          {/* Medical AI Fallback Box */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <Stethoscope className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="text-amber-700 dark:text-amber-300 font-bold block text-sm">IMPORTANT MEDICAL &amp; DIETARY DISCLAIMER:</strong>
              <p>
                FitKobra and its AI Fitness Coach provide exercise guides, workout tracking, and general fitness information for educational purposes ONLY. 
                <strong>FitKobra IS NOT A LICENSED MEDICAL DOCTOR, PHYSICIAN, OR REGISTERED DIETITIAN (RD).</strong> 
                The AI Coach will refuse to prescribe therapeutic meal plans or manage medical conditions (such as Diabetes, Chronic Kidney Disease, Hypertension, Severe Allergies, Pregnancy, or Eating Disorders). Always consult a licensed healthcare professional before starting any new diet or exercise regimen.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 1. Acceptance of Terms &amp; Physical Activity Assumption
            </h3>
            <p>
              By accessing or using the FitKobra mobile application or website, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not use the service. You acknowledge that physical exercise involves inherent risk of physical injury. You assume full personal responsibility for your workouts, form execution, and safety.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 2. AI Content &amp; Exercise Form Demonstrations
            </h3>
            <p>
              The 50+ video exercise demonstrations and AI coaching responses are created to showcase proper biomechanical technique. However, individual biomechanics, mobility constraints, and past injuries vary. Always prioritize personal safety and listen to your body over any automated recommendation.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 3. Free App Tier &amp; Account Policies
            </h3>
            <p>
              FitKobra is provided 100% free of charge. Users may earn bonus AI credits through daily engagement and streaks. Abuse, scraping, or automated reverse-engineering of the AI models is strictly prohibited and subject to account suspension.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#080B11] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#00FF75] text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-transform"
          >
            I Accept Terms &amp; Disclaimer
          </button>
        </div>

      </div>
    </div>
  );
}
