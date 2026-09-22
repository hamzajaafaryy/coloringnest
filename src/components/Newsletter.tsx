"use client";

import { useState } from "react";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="my-12 p-8 sm:p-12 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Weekly Free Printables</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Get New Free Coloring Pages Every Week!
        </h2>
        <p className="text-indigo-200 text-sm leading-relaxed max-w-xl mx-auto">
          Join thousands of parents, teachers, and coloring enthusiasts. Receive instant access to exclusive new coloring sheets, seasonal packs, and activity guides.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-semibold rounded-2xl text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Thank you! You are now subscribed to CraftColoring updates.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all shrink-0"
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
