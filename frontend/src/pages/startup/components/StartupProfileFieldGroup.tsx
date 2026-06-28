import React from "react";

type Field = {
  label: string;
  value: React.ReactNode;
};

type StartupProfileFieldGroupProps = {
  fields: Field[];
  className?: string;
};

export const StartupProfileFieldGroup: React.FC<StartupProfileFieldGroupProps> = ({ fields, className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {fields.map((field) => (
        <div
          key={field.label}
          className="grid gap-1 border-b border-slate-200/80 pb-4 text-sm last:border-b-0 last:pb-0 sm:grid-cols-[minmax(170px,210px)_16px_minmax(0,1fr)] sm:items-start"
        >
          <div className="font-semibold text-slate-600">{field.label}</div>
          <div className="hidden text-slate-300 sm:block">:</div>
          <div className="min-w-0 break-words font-semibold leading-6 text-slate-900">{field.value}</div>
        </div>
      ))}
    </div>
  );
};
