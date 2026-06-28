/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  MessageSquareText,
} from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { INDIAN_STATES } from "../../constants/options";
import { AuthShell } from "../../components/auth/AuthShell";
import { contentApi } from "../../services/contentApi";

const CITIES_BY_STATE: Record<string, string[]> = {
  Delhi: ["New Delhi", "Connaught Place", "Dwarka"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli-Dharwad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
};

const queryOptions = [
  "Seed Fund guidance",
  "Startup registration support",
  "Incubator coordination",
  "Program eligibility",
  "Technical assistance",
  "General query",
];

export const ContactUs: React.FC = () => {
  const { showToast } = useAppState();

  const [formFields, setFormFields] = useState({
    entityType: "",
    entityName: "",
    name: "",
    email: "",
    state: "",
    city: "",
    queryType: "",
    message: "",
  });

  const [cities, setCities] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [ticketDetails, setTicketDetails] = useState<{ id: string; date: string } | null>(null);

  useEffect(() => {
    if (formFields.state) {
      const list = CITIES_BY_STATE[formFields.state] || ["Regional Block", "Capital City"];
      setCities(list);
      setFormFields((f) => ({ ...f, city: list[0] }));
    } else {
      setCities([]);
      setFormFields((f) => ({ ...f, city: "" }));
    }
  }, [formFields.state]);

  const updateField = (key: keyof typeof formFields, value: string) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formFields.name.trim()) errs.name = "Full name required.";
    if (!formFields.email.trim()) errs.email = "Email address required.";
    else if (!/\S+@\S+\.\S+/.test(formFields.email)) errs.email = "Enter a valid email address.";
    if (!formFields.state) errs.state = "Select state.";
    if (!formFields.city) errs.city = "Select city.";
    if (!formFields.queryType) errs.queryType = "Select query type.";
    if (!formFields.message.trim()) errs.message = "Please add a short query description.";
    if (formFields.entityType && !formFields.entityName.trim()) errs.entityName = "Enterprise name required.";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the validation markings before submitting.", "error");
      return;
    }

    try {
      const created = await contentApi.createQuery(formFields);
      const formattedDate = new Date(created.submittedDate || Date.now()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setTicketDetails({ id: created.id, date: formattedDate });
      showToast("Query ticket created successfully.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit query right now.";
      showToast(message, "error");
    }
  };

  return (
    <AuthShell
      badge="dpiit helpdesk"
      title="Contact & Query Facilitation"
      description="Reach the official nodal desk for seed fund questions, startup registration support, incubator coordination, and other program queries."
      maxWidthClassName="max-w-7xl"
      showFooterNote={false}
      aside={
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0B2A5B] shadow-sm">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Helpline</div>
              <div className="text-sm font-black text-slate-800">1800-115-565</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0B2A5B] shadow-sm">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</div>
              <div className="text-sm font-black text-slate-800">nodal-desk.bhaskar@nic.in</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0B2A5B] shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Office</div>
              <div className="text-sm font-black text-slate-800">New Delhi</div>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#0B2A5B]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Support Type</div>
                  <div className="text-sm font-black text-slate-800">Official helpdesk</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <Clock className="h-5 w-5 text-[#0B2A5B]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hours</div>
                  <div className="text-sm font-black text-slate-800">Mon-Sat, 10 AM - 6 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <MapPin className="h-5 w-5 text-[#0B2A5B]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Coverage</div>
                  <div className="text-sm font-black text-slate-800">PAN India</div>
                </div>
              </div>
            </div>
          </div>

          {!ticketDetails ? (
            <form onSubmit={handleFormSubmit} className="space-y-5" id="query-intake-form">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2A5B]">Query intake form</h3>
                  <p className="mt-1 text-[11px] text-slate-500">Use the same premium profile style as login and registration.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">Entity type</label>
                    <select
                      value={formFields.entityType}
                      onChange={(e) => updateField("entityType", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B]"
                    >
                      <option value="">Individual Inventor</option>
                      <option value="DPIIT Recognized Startup">DPIIT Recognized Startup</option>
                      <option value="Registered Incubator partner">Registered Incubator partner</option>
                      <option value="Institutional Investor Syndicate">Institutional Investor</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">Enterprise name</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formFields.entityName}
                        onChange={(e) => updateField("entityName", e.target.value)}
                        placeholder="e.g. KisanBot Agrotech"
                        className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B] ${
                          formErrors.entityName ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                        }`}
                      />
                    </div>
                    {formErrors.entityName && <p className="text-[10px] font-bold text-red-500">{formErrors.entityName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">Full name *</label>
                    <input
                      type="text"
                      value={formFields.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Bhaskar Sharma"
                      className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B] ${
                        formErrors.name ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                      }`}
                    />
                    {formErrors.name && <p className="text-[10px] font-bold text-red-500">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">Email *</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={formFields.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="e.g. bhaskar@kisanbot.in"
                        className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B] ${
                          formErrors.email ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                        }`}
                      />
                    </div>
                    {formErrors.email && <p className="text-[10px] font-bold text-red-500">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">State *</label>
                    <div className="relative">
                      <Globe className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <select
                        value={formFields.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        className={`w-full appearance-none rounded-xl border bg-white py-3 pl-11 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B] ${
                          formErrors.state ? "border-red-400 bg-red-50" : "border-slate-300"
                        }`}
                      >
                        <option value="">Select State...</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.state && <p className="text-[10px] font-bold text-red-500">{formErrors.state}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">City *</label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <select
                        value={formFields.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        disabled={!formFields.state}
                        className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm font-semibold text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#0B2A5B]"
                      >
                        <option value="">Select City...</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.city && <p className="text-[10px] font-bold text-red-500">{formErrors.city}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">Query type *</label>
                    <select
                      value={formFields.queryType}
                      onChange={(e) => updateField("queryType", e.target.value)}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B] ${
                        formErrors.queryType ? "border-red-400 bg-red-50" : "border-slate-300"
                      }`}
                    >
                      <option value="">Select Query Type...</option>
                      {queryOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    {formErrors.queryType && <p className="text-[10px] font-bold text-red-500">{formErrors.queryType}</p>}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[13px] font-black uppercase tracking-wider text-slate-500">Message *</label>
                    <div className="relative">
                      <MessageSquareText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <textarea
                        value={formFields.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Describe your query in a few lines."
                        rows={5}
                        className={`w-full rounded-2xl border py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B2A5B] ${
                          formErrors.message ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"
                        }`}
                      />
                    </div>
                    {formErrors.message && <p className="text-[10px] font-bold text-red-500">{formErrors.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-slate-500">
                    We create a ticket immediately after submission and notify the nodal desk.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0B2A5B] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#082045]"
                  >
                    Submit Query
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Ticket generated</p>
                  <p className="text-slate-700">
                    Your query has been registered successfully. Keep the ticket ID below for follow-up.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket ID</div>
                      <div className="font-mono text-sm font-black text-[#0B2A5B]">{ticketDetails.id}</div>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-white px-4 py-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submitted</div>
                      <div className="text-sm font-black text-[#0B2A5B]">{ticketDetails.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2A5B]">Helpdesk</h3>
            </div>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#FF6B00]" />
                <div>
                  <div className="font-semibold text-slate-800">1800-115-565</div>
                  <div className="text-[11px] text-slate-500">Mon-Sat, 10:00 AM - 6:00 PM IST</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#FF6B00]" />
                <div>
                  <div className="font-semibold text-slate-800">nodal-desk.bhaskar@nic.in</div>
                  <div className="text-[11px] text-slate-500">Official correspondence channel</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#FF6B00]" />
                <div>
                  <div className="font-semibold text-slate-800">Udyog Bhawan, New Delhi</div>
                  <div className="text-[11px] text-slate-500">DPIIT nodal office</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2A5B]">What to include</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#63C7C6]" />
                Mention your startup or entity name if the query is program related.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#63C7C6]" />
                Include the scheme or issue category to speed up routing.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#63C7C6]" />
                Keep the message short, direct, and specific.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};
