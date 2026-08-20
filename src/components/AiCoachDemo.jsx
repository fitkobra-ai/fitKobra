import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Dumbbell, Zap, CheckCircle2, MessageSquare } from 'lucide-react';
import { logoUrl } from '../data/videoLibrary';

export default function AiCoachDemo() {
  const samplePrompts = [
    {
      q: "How much protein do I need per day?",
      a: "For optimal muscle hypertrophy and recovery, target **1.6 to 2.2 grams of protein per kilogram of body weight** (0.8 - 1.0g per lb). Distribute your protein across 3-5 meals containing 30-40g each to maximize Muscle Protein Synthesis (MPS)."
    },
    {
      q: "What's the best exercise for wide 3D shoulders?",
      a: "Focus heavily on **Cable Lateral Raises** and **Dumbbell Side Raises**. Cable raises keep constant mechanical tension on the lateral head throughout the movement. Check out our **Side Delts Video Guide** in FitKobra for exact elbow placement!"
    },
    {
      q: "How do I fix lower back pain during Romanian Deadlifts?",
      a: "Keep the barbell glued close to your shins, push your hips straight backward (hip hinge), and stop the descent once your hamstrings reach maximum stretch. Do NOT round your lumbar spine. Watch our **Back & Hamstrings Video Guide** for a form breakdown!"
    },
    {
      q: "What should I eat 1 hour before a heavy workout?",
      a: "Opt for 25-35g of fast-digesting simple carbs with 15-20g of lean protein (e.g. Oatmeal with protein powder, or Rice cakes with almond butter & honey). Keep fats under 5g to prevent stomach sluggishness."
    }
  ];

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hey there! I'm your FitKobra 24/7 AI Coach. Ask me anything about workout routines, form cues, or custom macro plans!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (userQuestion, predefinedAnswer = null) => {
    if (!userQuestion.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userQuestion }];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = predefinedAnswer;
      if (!reply) {
        reply = `That's a great fitness question! In FitKobra, our AI Coach provides custom recommendations based on your personal bio-data, daily step count, and scanned meals. Try downloading the free app to unlock unlimited personalized coaching!`;
      }
      setMessages([...newMessages, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section id="ai-coach" className="py-24 relative bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-400">
            <Bot className="w-3.5 h-3.5" />
            24/7 INTELLIGENT AI TRAINER & DIETITIAN
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            TALK TO THE <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-[#00FF75] bg-clip-text text-transparent">FITKOBRA AI COACH</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Get instant answers to form corrections, plateau breaking, meal prep questions, and custom training programming.
          </p>
        </div>

        {/* Simulator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sample Quick Questions */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Tap a Question to Ask:
            </h3>
            <div className="space-y-3">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.q, prompt.a)}
                  className="w-full text-left p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-400/50 hover:bg-slate-800/80 transition-all text-xs font-medium text-slate-200 flex items-start gap-3 group"
                >
                  <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>"{prompt.q}"</span>
                </button>
              ))}
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-purple-500/20 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Zap className="w-4 h-4 text-purple-400" /> Context-Aware Training
              </div>
              <p className="text-[11px] text-slate-400">
                FitKobra AI connects directly to your daily step logs and scanned meal history to tailor its recommendations specifically for your body composition.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Chat Interface */}
          <div className="lg:col-span-8">
            <div className="glass-panel rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col h-[520px]">
              
              {/* Chat Header */}
              <div className="px-6 py-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={logoUrl} alt="FitKobra AI" className="w-9 h-9 rounded-xl object-cover border border-purple-500/40" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00FF75] border-2 border-slate-950"></span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      FitKobra AI Coach
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="text-[10px] text-emerald-400">Online • 24/7 Active Guidance</div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-300 text-[10px] font-extrabold uppercase rounded-full border border-purple-500/20">
                  Interactive Simulator
                </span>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/60">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.sender === 'ai' ? (
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-semibold rounded-tr-none'
                          : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-purple-400 italic">
                    <Bot className="w-4 h-4 animate-bounce" /> FitKobra AI is formulating answer...
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
                className="p-4 bg-slate-900/90 border-t border-white/10 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Ask any fitness or nutrition question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/15 focus:border-purple-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-[#00FF75] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
