import React, { useState } from "react";
import { ArrowRight, ChevronUp } from "lucide-react";
import { faqs } from "./aboutData";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section
      id="about-faq"
      className="relative overflow-hidden bg-[#F8FAFC] py-20 sm:py-24"
    >
      <div className="about-reveal relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#FF6B00]">
            Need clarity?
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-normal text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {visibleFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-lg bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(15,23,42,0.1)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-6 text-left sm:px-7"
                >
                  <span className="text-base font-bold text-slate-950">
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2947B8] text-white">
                    <ArrowRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 px-5 pb-6 pt-4 text-sm leading-7 text-slate-600 sm:px-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showAll && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-md bg-[#FF6B00] px-8 py-3 text-base font-black text-white shadow-[0_14px_30px_rgba(255,107,0,0.24)] transition hover:bg-[#ef5f00]"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 left-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FF8A00] bg-white text-slate-950 shadow-lg transition hover:-translate-y-1"
        aria-label="Back to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </section>
  );
};
