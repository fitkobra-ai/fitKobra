import React from 'react';
import { X, ShieldCheck, Lock, Eye, Server, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
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
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-[#00FF75]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white">FitKobra Privacy Policy</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Application ID: <span className="text-emerald-600 dark:text-emerald-400 font-mono">com.fitkobra.app</span> | Last Updated: August 2026</p>
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
          
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/20 text-slate-800 dark:text-slate-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-[#00FF75] shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>Our Privacy Commitment:</strong> FitKobra is built with user privacy and data protection as core principles. We process your fitness and pedometer data locally on your device wherever possible, encrypt cloud data in transit and at rest, and <strong>NEVER sell your personal information to third parties</strong>.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 1. Information We Collect
            </h3>
            <p>We collect information to provide, personalize, and improve the FitKobra experience:</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs pl-2 text-slate-600 dark:text-slate-300">
              <li><strong>Account Information:</strong> When you create an account, we may store your email address, display name, profile avatar, and authentication identifiers managed securely via Google Firebase Authentication.</li>
              <li><strong>Fitness &amp; Biometric Preferences:</strong> User-entered fitness goals, dietary preferences (e.g. Vegetarian, Non-Veg, Vegan), target calories, and workout logs.</li>
              <li><strong>Hardware Step Counter / Motion Sensor Data:</strong> Step count data is read directly from your device's built-in step counter hardware sensor (<code className="bg-slate-100 dark:bg-black/40 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">ACTIVITY_RECOGNITION</code>). Step data is processed locally on-device.</li>
              <li><strong>Camera &amp; Meal Photos:</strong> When you use the AI Food Scanner, photos you capture are temporarily transmitted securely via HTTPS to Google Gemini / Vertex AI models exclusively for real-time macronutrient analysis. Images are NOT used to train public models without your explicit consent.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 2. How We Use &amp; Protect Your Information
            </h3>
            <p>Your information is used strictly to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs pl-2 text-slate-600 dark:text-slate-300">
              <li>Calculate customized daily calorie and macronutrient budgets.</li>
              <li>Power the 24/7 AI Coach conversational fitness guidance.</li>
              <li>Display daily step progress and maintain workout consistency streaks.</li>
              <li>Authenticate your profile across devices using 256-bit TLS encrypted cloud sync.</li>
            </ul>
          </section>

          {/* Section 3: AI & Third-Party Processors */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 3. Third-Party Infrastructure &amp; AI Subprocessors
            </h3>
            <p>FitKobra utilizes industry-standard, GDPR-compliant cloud infrastructure providers:</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs pl-2 text-slate-600 dark:text-slate-300">
              <li><strong>Google Firebase / Google Cloud Platform:</strong> For secure database storage (Cloud Firestore), authentication, and analytics.</li>
              <li><strong>Google Gemini / Vertex AI:</strong> For real-time computer vision food identification and interactive fitness coaching advice.</li>
            </ul>
          </section>

          {/* Section 4: Data Retention & Deletion Rights */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 4. Your Rights &amp; Full Data Deletion
            </h3>
            <p>
              In compliance with Google Play Developer Policies and global privacy regulations (GDPR/CCPA), you retain complete ownership of your data. You may request permanent deletion of your account and all associated workout, calorie, and profile records at any time directly through the app or by submitting a request via our <strong className="text-emerald-600 dark:text-emerald-400">Data Deletion Request Portal</strong>.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> Contact Our Privacy &amp; Data Protection Officer
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              If you have any questions about this Privacy Policy or how your data is handled, please contact our support team at <a href="mailto:support@fitkobra.com" className="text-emerald-600 dark:text-emerald-400 underline font-mono">support@fitkobra.com</a>.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#080B11] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
          >
            I Understand &amp; Agree
          </button>
        </div>

      </div>
    </div>
  );
}
