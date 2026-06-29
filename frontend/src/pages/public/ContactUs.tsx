/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Mail, MapPin, Phone } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { INDIAN_STATES } from "../../constants/options";
import { contentApi } from "../../services/contentApi";

const CITIES_BY_STATE: Record<string, string[]> = {
  Delhi: ["New Delhi", "Connaught Place", "Dwarka"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli-Dharwad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
};

export const ContactUs: React.FC = () => {
  const { showToast } = useAppState();

  const [formFields, setFormFields] = useState({
    entityType: "",
    customEntityType: "",
    entityName: "",
    name: "",
    email: "",
    state: "",
    customState: "",
    city: "",
    customCity: "",
    queryType: "",
    customQueryType: "",
    message: "",
  });

  const [cities, setCities] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [ticketDetails, setTicketDetails] = useState<{ id: string; date: string } | null>(null);

  useEffect(() => {
    if (formFields.state && formFields.state !== "Other (Type manually)") {
      const list = CITIES_BY_STATE[formFields.state] || ["Regional Block", "Capital City"];
      setCities(list);
      setFormFields((f) => ({ ...f, city: "" }));
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
    if (!formFields.name.trim()) errs.name = "Name is required.";
    
    if (!formFields.email.trim()) {
      errs.email = "Email ID is required.";
    } else if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!formFields.entityType) {
      errs.entityType = "Please select entity type.";
    } else if (formFields.entityType === "Other (Type manually)" && !formFields.customEntityType.trim()) {
      errs.customEntityType = "Please specify entity type.";
    }

    if (!formFields.entityName.trim()) {
      errs.entityName = "Please enter name of the entity.";
    }

    const actualState = formFields.state === "Other (Type manually)" ? formFields.customState : formFields.state;
    if (!actualState || !actualState.trim()) {
      errs.state = "Please select State";
    }

    const actualCity = (formFields.state === "Other (Type manually)" || formFields.city === "Other (Type manually)") 
      ? formFields.customCity 
      : formFields.city;
    if (!actualCity || !actualCity.trim()) {
      errs.city = "Please select city";
    }

    if (!formFields.queryType) {
      errs.queryType = "Please select query type.";
    } else if (formFields.queryType === "Other (Type manually)" && !formFields.customQueryType.trim()) {
      errs.customQueryType = "Please specify query type.";
    }

    if (!formFields.message.trim()) {
      errs.message = "Please enter a message.";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fill all required fields correctly.", "error");
      return;
    }

    const payload = {
      entityType: formFields.entityType === "Other (Type manually)" ? formFields.customEntityType : formFields.entityType,
      entityName: formFields.entityName,
      name: formFields.name,
      email: formFields.email,
      state: formFields.state === "Other (Type manually)" ? formFields.customState : formFields.state,
      city: formFields.state === "Other (Type manually)" || formFields.city === "Other (Type manually)" ? formFields.customCity : formFields.city,
      queryType: formFields.queryType === "Other (Type manually)" ? formFields.customQueryType : formFields.queryType,
      message: formFields.message,
    };

    try {
      const created = await contentApi.createQuery(payload);
      const formattedDate = new Date(created.submittedDate || Date.now()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setTicketDetails({ id: created.id, date: formattedDate });
      showToast("Query ticket submitted successfully.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit query right now.";
      showToast(message, "error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-slate-50" id="contact-us-container">
      {/* Page Banner */}
      <section className="bg-[#07184A] text-white">
        <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8 lg:px-10">
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Contact Us
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="w-full">
          {/* Form Side */}
          <div>
            {!ticketDetails ? (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(69,84,155,0.04)]">
                <form onSubmit={handleFormSubmit} className="space-y-7" id="contact-query-form">
                  {/* Entity Type Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Entity Type</label>
                    <div className="space-y-2">
                      <select
                        value={formFields.entityType}
                        onChange={(e) => updateField("entityType", e.target.value)}
                        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                          formErrors.entityType ? "border-red-400" : "border-slate-200"
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Startups">Startups</option>
                        <option value="Incubators">Incubators</option>
                        <option value="Other (Type manually)">Other (Type manually)</option>
                      </select>
                      {formFields.entityType === "Other (Type manually)" && (
                        <input
                          type="text"
                          value={formFields.customEntityType}
                          onChange={(e) => updateField("customEntityType", e.target.value)}
                          placeholder="Specify entity type"
                          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                            formErrors.customEntityType ? "border-red-400" : "border-slate-200"
                          }`}
                        />
                      )}
                      {formErrors.entityType && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.entityType}</p>
                      )}
                      {formErrors.customEntityType && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.customEntityType}</p>
                      )}
                    </div>
                  </div>

                  {/* Name of the Entity Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Name of the Entity</label>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formFields.entityName}
                        onChange={(e) => updateField("entityName", e.target.value)}
                        placeholder="Enter"
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                          formErrors.entityName ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                      {formErrors.entityName && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.entityName}</p>
                      )}
                    </div>
                  </div>

                  {/* Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Name</label>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formFields.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Enter"
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                          formErrors.name ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email ID Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Email ID</label>
                    <div className="space-y-1">
                      <input
                        type="email"
                        value={formFields.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="Enter"
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                          formErrors.email ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Location Row (State & City) */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Location</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* State field */}
                      <div className="space-y-1.5">
                        {formFields.state === "Other (Type manually)" ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={formFields.customState}
                              onChange={(e) => updateField("customState", e.target.value)}
                              placeholder="Type State"
                              className={`w-full rounded-xl border bg-white px-4 py-3 pr-16 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                                formErrors.state ? "border-red-400" : "border-slate-200"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                updateField("state", "");
                                updateField("customState", "");
                              }}
                              className="absolute right-3.5 top-3 text-[10px] font-black uppercase tracking-wider text-[#FF6B00] hover:underline"
                            >
                              Reset
                            </button>
                          </div>
                        ) : (
                          <select
                            value={formFields.state}
                            onChange={(e) => updateField("state", e.target.value)}
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                              formErrors.state ? "border-red-400" : "border-slate-200"
                            }`}
                          >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                            <option value="Other (Type manually)">Other (Type manually)</option>
                          </select>
                        )}
                        {formErrors.state && (
                          <p className="text-xs text-red-500 font-semibold">{formErrors.state}</p>
                        )}
                      </div>

                      {/* City field */}
                      <div className="space-y-1.5">
                        {formFields.state === "Other (Type manually)" || formFields.city === "Other (Type manually)" ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={formFields.customCity}
                              onChange={(e) => updateField("customCity", e.target.value)}
                              placeholder="Type City"
                              className={`w-full rounded-xl border bg-white px-4 py-3 pr-16 text-sm font-semibold text-slate-850 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                                formErrors.city ? "border-red-400" : "border-slate-200"
                              }`}
                            />
                            {formFields.state !== "Other (Type manually)" && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateField("city", "");
                                  updateField("customCity", "");
                                }}
                                className="absolute right-3.5 top-3 text-[10px] font-black uppercase tracking-wider text-[#FF6B00] hover:underline"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        ) : (
                          <select
                            value={formFields.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            disabled={!formFields.state}
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition disabled:bg-slate-100 disabled:cursor-not-allowed focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                              formErrors.city ? "border-red-400" : "border-slate-200"
                            }`}
                          >
                            <option value="">Select City</option>
                            {cities.map((ct) => (
                              <option key={ct} value={ct}>
                                {ct}
                              </option>
                            ))}
                            <option value="Other (Type manually)">Other (Type manually)</option>
                          </select>
                        )}
                        {formErrors.city && (
                          <p className="text-xs text-red-500 font-semibold">{formErrors.city}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Query Type Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Query Type</label>
                    <div className="space-y-2">
                      <select
                        value={formFields.queryType}
                        onChange={(e) => updateField("queryType", e.target.value)}
                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                          formErrors.queryType ? "border-red-400" : "border-slate-200"
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="Funding & Seed Fund Related">Funding & Seed Fund Related</option>
                        <option value="Program Support">Program Support</option>
                        <option value="DPIIT Recognition">DPIIT Recognition</option>
                        <option value="Other (Type manually)">Other (Type manually)</option>
                      </select>
                      {formFields.queryType === "Other (Type manually)" && (
                        <input
                          type="text"
                          value={formFields.customQueryType}
                          onChange={(e) => updateField("customQueryType", e.target.value)}
                          placeholder="Specify query type"
                          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                            formErrors.customQueryType ? "border-red-400" : "border-slate-200"
                          }`}
                        />
                      )}
                      {formErrors.queryType && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.queryType}</p>
                      )}
                      {formErrors.customQueryType && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.customQueryType}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 items-start">
                    <label className="text-sm font-bold text-slate-700 md:pt-3">Message</label>
                    <div className="space-y-1">
                      <textarea
                        value={formFields.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Enter"
                        rows={5}
                        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 ${
                          formErrors.message ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                      {formErrors.message && (
                        <p className="text-xs text-red-500 font-semibold">{formErrors.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-8 pt-4">
                    <div className="hidden md:block" />
                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-10 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#e65f00] shadow-md cursor-pointer"
                      >
                        Submit
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              /* Ticket confirmation card details */
              <div className="bg-emerald-50 border border-emerald-200 rounded-[2rem] p-8 shadow-sm flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-xs border border-emerald-100">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-md font-black uppercase tracking-wider text-emerald-850">
                    Ticket generated successfully
                  </h3>
                  <p className="text-sm leading-6 text-slate-600 font-medium">
                    Your nodal inquiry is registered. Keep the details below for tracking the ticket response.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-3">
                    <div className="bg-white border border-emerald-200/60 rounded-2xl px-5 py-3 shadow-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Ticket ID
                      </span>
                      <span className="font-mono text-sm font-black text-[#0B2A5B] block mt-1">
                        {ticketDetails.id}
                      </span>
                    </div>
                    <div className="bg-white border border-emerald-200/60 rounded-2xl px-5 py-3 shadow-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Submitted Date
                      </span>
                      <span className="text-sm font-black text-[#0B2A5B] block mt-1">
                        {ticketDetails.date}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormFields({
                          entityType: "",
                          customEntityType: "",
                          entityName: "",
                          name: "",
                          email: "",
                          state: "",
                          customState: "",
                          city: "",
                          customCity: "",
                          queryType: "",
                          customQueryType: "",
                          message: "",
                        });
                        setTicketDetails(null);
                      }}
                      className="text-xs font-bold text-[#FF6B00] hover:underline"
                    >
                      Submit another query
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
