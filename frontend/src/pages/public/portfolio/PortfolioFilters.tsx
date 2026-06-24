import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type PortfolioFiltersProps = {
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: Array<{
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
  }>;
  onClear: () => void;
};

export const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  title,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  onClear,
}) => {
  return (
    <section className="portfolio-reveal bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#FF6B00]">Filters</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal text-[#2947B8]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]/5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-12 w-full rounded-md border border-slate-300 bg-white pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2947B8] focus:ring-4 focus:ring-[#2947B8]/10"
            />
          </label>

          {filters.map((filter) => (
            <select
              key={filter.label}
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
              className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2947B8] focus:ring-4 focus:ring-[#2947B8]/10"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>
    </section>
  );
};
