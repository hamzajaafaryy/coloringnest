"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQ({
  items,
  title = "Frequently Asked Questions",
  description = "Find quick answers to common questions about our free printable and online coloring pages.",
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="my-12 py-10 px-6 sm:px-10 bg-slate-50 rounded-3xl border border-slate-200/80">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        {description && (
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            {description}
          </p>
        )}

        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-bold text-slate-900 transition-colors hover:text-violet-600 sm:px-6 sm:text-base"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-3 text-sm leading-relaxed text-slate-600 border-t border-slate-50 sm:px-6">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
