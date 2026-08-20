import React from 'react';
import { X, ShieldCheck, Lock, Eye, Server, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
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
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#00FF75]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">FitKobra Privacy Policy</h2>
              <p className="text-xs text-slate-400">Application ID: <span className="text-emerald-400 font-mono">com.fitkobra.app</span> | Last Updated: August 2026</p>
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
          
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-slate-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#00FF75] shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>Our Privacy Commitment:</strong> FitKobra is built with user privacy and data protection as core principles. We process your fitness and pedometer data locally on your device wherever possible, encrypt cloud data in transit and at rest, and <strong>NEVER sell your personal information to third parties</strong>.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#00FF75]" /> 1. Information We Collect
            </h3>
            <p>To deliver AI coaching, macro tracking, and hardware-based step counting, FitKobra collects the following data types:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li><strong className="text-slate-200">Account Credentials:</strong> Email address, display name, and unique user identifier (processed securely via Firebase Authentication).</li>
              <li><strong className="text-slate-200">Hardware Activity & Pedometer Telemetry:</strong> Step count readings provided by your phone's low-power hardware step sensor (<code className="text-emerald-400 font-mono">TYPE_STEP_COUNTER</code>), distance walked, and estimated active calories. Step readings are saved locally in device storage (<code className="text-emerald-400 font-mono">AsyncStorage</code>) for background/pocket step tracking.</li>
              <li><strong className="text-slate-200">Fitness Profile & Metrics:</strong> Height, body weight, fitness goals, and daily calorie targets entered by you.</li>
              <li><strong className="text-slate-200">AI Scanner & Meal Images:</strong> Food photos uploaded for AI vision macro estimation, meal logs, and dietary preferences.</li>
              <li><strong className="text-slate-200">AI Coach Conversations:</strong> Text queries submitted to the AI fitness coach (processed securely with medical safety filters).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> 2. AI Technologies, Visual Media & Content Standards
            </h3>
            <p className="text-xs">FitKobra integrates advanced artificial intelligence models (such as Google Gemini) to deliver personalized wellness capabilities:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li><strong className="text-slate-200">AI-Generated Exercise Guides:</strong> Biomechanical exercise demonstrations and 3D muscle anatomy guides are produced with generative AI modeling. All exercise models are presented in standard, appropriate athletic sportswear (gym shorts, tops) designed strictly to illustrate correct physiological posture, joint alignment, and muscular engagement with zero sexually explicit or suggestive content.</li>
              <li><strong className="text-slate-200">AI Vision Meal Estimations:</strong> Recipe and meal photos captured with your device camera are analyzed in real-time to calculate approximate calories and macronutrients. Photos are processed Ephemerally and never permanently stored.</li>
              <li><strong className="text-slate-200">Informational Medical Disclaimer:</strong> All AI-generated fitness recommendations, workout plans, and nutritional estimations are provided exclusively for general educational and athletic purposes and do not substitute for certified clinical or medical diagnosis.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Data Protection & Regulatory Compliance
            </h3>
            <p className="text-xs">FitKobra strictly complies with international privacy frameworks:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-emerald-400 block">GDPR (EU/UK)</span>
                <span className="text-[11px] text-slate-400">Full rights to access, rectify, export, or erase all personal data stored in our systems.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-cyan-400 block">CCPA / CPRA (USA)</span>
                <span className="text-[11px] text-slate-400">We do not sell personal information or share data for cross-context behavioral advertising.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-purple-400 block">DPDP Act / FSSAI (India)</span>
                <span className="text-[11px] text-slate-400">Data processed with explicit consent. Medical AI safety disclaimers strictly enforced.</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> 4. Data Retention & Account Deletion
            </h3>
            <p className="text-xs">
              We retain account data only for as long as your account remains active. You can request <strong>100% complete deletion of your account and all associated data</strong> at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li><strong className="text-slate-200">In-App Deletion:</strong> Go to Profile &rarr; Security &rarr; Delete My Account.</li>
              <li><strong className="text-slate-200">Web Request:</strong> Use our <a href="#data-deletion" onClick={onClose} className="text-[#00FF75] underline">Data Deletion Request Portal</a> on this website.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> 5. Contact Us
            </h3>
            <p className="text-xs text-slate-400">
              For privacy inquiries, data export requests, or regulatory questions, contact our Data Protection Officer at:
              <br />
              <span className="font-mono text-emerald-400">privacy@fitkobra.app</span> or <span className="font-mono text-cyan-400">support@fitkobra.app</span>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080B11] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00FF75] text-black font-extrabold rounded-xl text-xs hover:bg-[#00FF75]/90 transition-colors"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
}
