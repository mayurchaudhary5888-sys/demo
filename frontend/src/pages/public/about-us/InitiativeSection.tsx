import React from "react";
import { CheckCircle2 } from "lucide-react";
import { aboutImages, initiativeHighlights } from "./aboutData";

export const InitiativeSection: React.FC = () => {
  return (
    <section id="about-initiative" className="relative overflow-hidden bg-[#F8FAFC] py-20 sm:py-24">
      <div className="absolute left-0 top-0 h-full w-[34%] bg-white" />

      <div className="about-reveal relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-lg shadow-[0_28px_80px_rgba(7,20,74,0.18)]">
            <img
              src={aboutImages.collaboration}
              alt="Startup team placing hands together"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
          <div className="absolute -right-6 -top-6 hidden max-w-[260px] rounded-lg bg-[#07144A] p-5 text-white shadow-[0_22px_60px_rgba(7,20,74,0.22)] sm:block">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#F9B233]">
              BHASKAR ID
            </p>
            <p className="mt-2 text-sm leading-6 text-white/76">
              A shared identity layer for clearer ecosystem participation.
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="rounded-lg bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#FF6B00]">
              The initiative
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
              What is the BHASKAR Initiative?
            </h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-slate-700">
              <p>
                Bharat Startup Knowledge Access Registry, BHASKAR, is envisioned
                as a one-stop digital platform where diverse startup ecosystem
                stakeholders can seamlessly connect and collaborate, catalysing
                the growth and success of the startup ecosystem across India.
              </p>
              <p>
                By providing a comprehensive platform for connection, knowledge
                sharing, and searchability, BHASKAR empowers entrepreneurs and
                ecosystem stakeholders at every stage of their journey.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {initiativeHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B00]" />
                  <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
