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
    <section className="my-12 rounded-3xl border-2 border-[#2b2140] bg-[#fff3d6] px-6 py-10 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2b2140] bg-[#ffd23f] text-[#2b2140]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-[#2b2140]">{title}</h2>
        </div>
        {description && (
          <p className="mb-8 text-sm leading-7 text-[#514461]">
            {description}
          </p>
        )}

        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border-2 border-[#2b2140] bg-white shadow-[4px_4px_0_rgba(43,33,64,0.16)] transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-bold text-[#2b2140] transition-colors hover:bg-[#fffaf0] sm:px-6 sm:text-base"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#2b2140] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t-2 border-[#2b2140]/15 px-4 pb-5 pt-3 text-sm leading-7 text-[#514461] sm:px-6">
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
