import { AppError } from "../utils/errors.js";
import { User } from "../models/User.js";
import { Program } from "../models/Program.js";
import { StartupProfile } from "../models/StartupProfile.js";
import { InvestorProfile } from "../models/InvestorProfile.js";
import { ContactQuery } from "../models/ContactQuery.js";
import { Connection } from "../models/Connection.js";
import { Faq } from "../models/Faq.js";
import { Announcement } from "../models/Announcement.js";
import { generateApplicationId } from "../utils/applicationId.js";
import { sendApplicationStatusEmail } from "../utils/otpEmail.js";
import mongoose from "mongoose";

import { IdeaValidationApplication } from "../models/IdeaValidationApplication.js";
import { MsmeApplication } from "../models/MsmeApplication.js";
import { FoundationApplication } from "../models/FoundationApplication.js";
import { StartupApplication } from "../models/StartupApplication.js";
import { GlobalImpactApplication } from "../models/GlobalImpactApplication.js";
import { sendContactQueryEmail, sendInvestorProfileEmail } from "../services/emailService.js";
import { ensureNoBase64Logos } from "../services/startupProfileService.js";

const sortNewestFirst = { createdAt: -1, updatedAt: -1 };
const isPlaceholderStartupId = (value) => !value || value === "temp-id" || String(value).startsWith("temp-");


const toPlainWithId = (doc) => {
  const item = typeof doc?.toObject === "function" ? doc.toObject() : doc;
  if (!item) return item;
  return { ...item, id: item.id || item._id?.toString() };
};

const getUserAccount = async (req) => {
  if (!req.user?.email) return null;
  return User.findOne({ email: req.user.email }).lean();
};

const canAccessStartup = (req, startup) => {
  if (!startup) return false;
  if (req.user?.role === "admin") return true;
  if (startup.isApproved) return true;
  return Boolean(req.user?.email && (startup.email === req.user.email || startup.id === req.user.startupId));
};

const assertStartupOwnerOrAdmin = async (req, startupId) => {
  if (req.user?.role === "admin") return;
  const account = await getUserAccount(req);
  if (!account || account.startupId !== startupId) {
    throw new AppError("You can update only your own startup profile.", 403);
  }
};

const stripFounderControlledFields = (body) => {
  const {
    isApproved,
    approvedAt,
    approvedBy,
    role,
    status,
    adminRemarks,
    submittedByEmail,
    submittedByName,
    timeline,
    rejectedAt,
    ...safe
  } = body;
  return safe;
};

const applicationLookup = (id) => ({
  $or: [
    { id },
    ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : []),
  ],
});

const assertApplicationOwnerOrAdmin = async (req, app) => {
  if (req.user?.role === "admin") return;
  const account = await getUserAccount(req);
  if (!account) throw new AppError("Account not found.", 404);
  if (app.startupId !== account.startupId && app.submittedByEmail !== account.email) {
    throw new AppError("You can access only your own applications.", 403);
  }
};


const upsertById = async (Model, req, res, next, transform = (item) => item) => {
  try {
    const id = req.params.id;
    const item = await Model.findOne({ id });
    if (!item) throw new AppError("Resource not found.", 404);
    const updated = Object.assign(item, transform(req.body, item));
    await updated.save();
    res.json({ success: true, data: updated.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listPrograms = async (_req, res, next) => {
  try {
    const data = await Program.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getProgram = async (req, res, next) => {
  try {
    const data = await Program.findOne({ id: req.params.id }).lean();
    if (!data) throw new AppError("Program not found.", 404);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createProgram = async (req, res, next) => {
  try {
    const payload = {
      id: req.body.id || `prog-${Date.now()}`,
      name: req.body.name,
      shortDescription: req.body.shortDescription || req.body.description || "",
      longDescription: req.body.longDescription || req.body.description || "",
      benefits: req.body.benefits || [],
      eligibility: req.body.eligibility || [],
      requiredDocuments: req.body.requiredDocuments || req.body.documentsRequired || [],
      processSteps: req.body.processSteps || [],
      isOpen: req.body.isOpen ?? req.body.isActive ?? true,
      startDate: req.body.startDate || new Date().toISOString().split("T")[0],
      endDate: req.body.endDate || "2026-12-31",
      iconName: req.body.iconName || "Award",
      disclaimer: req.body.disclaimer,
      isActive: req.body.isActive ?? req.body.isOpen ?? true,
      description: req.body.description || req.body.shortDescription || "",
    };
    const created = await Program.create(payload);
    res.status(201).json({ success: true, data: created.toObject() });
  } catch (err) {
    next(err);
  }
};

export const toggleProgram = async (req, res, next) => {
  try {
    const program = await Program.findOne({ id: req.params.id });
    if (!program) throw new AppError("Program not found.", 404);
    program.isOpen = !program.isOpen;
    program.isActive = program.isOpen;
    await program.save();
    res.json({ success: true, data: program.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listStartups = async (req, res, next) => {
  try {
    let query = { isApproved: true };
    if (req.user?.role === "admin" && req.query.approvedOnly !== "true") {
      query = {};
    } else if (req.user?.email) {
      query = {
        $or: [
          { isApproved: true },
          { email: req.user.email },
          { id: req.user.startupId },
        ].filter((condition) => Object.values(condition)[0]),
      };
    }
    const data = await StartupProfile.find(query).select("-logoPreview").sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (_req, res, next) => {
  try {
    const data = await User.find().select("-passwordHash -startupProfile.logoPreview").sort(sortNewestFirst).lean();
    res.json({
      success: true,
      data: data.map((user) => ({
        ...user,
        id: user._id.toString(),
        selectedProgram: user.startupProfile?.selectedProgram || user.selectedProgram || null,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = mongoose.Types.ObjectId.isValid(req.params.id)
      ? await User.findById(req.params.id)
      : await User.findOne({ email: req.params.id });
    if (!user) throw new AppError("User not found.", 404);

    user.isActive = req.body.isActive;
    await user.save();

    const plain = user.toObject();
    delete plain.passwordHash;
    res.json({ success: true, data: { ...plain, id: plain._id.toString() } });
  } catch (err) {
    next(err);
  }
};

export const getStartup = async (req, res, next) => {
  try {
    const data = await StartupProfile.findOne({ id: req.params.id }).lean();
    if (!data) throw new AppError("Startup not found.", 404);
    if (!canAccessStartup(req, data)) {
      throw new AppError("Startup profile is not publicly available.", 403);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateStartup = async (req, res, next) => {
  try {
    const account = await getUserAccount(req);
    if (req.user?.role !== "admin" && !account) {
      throw new AppError("Account not found.", 404);
    }
    const id = req.user?.role === "admin" ? req.body.id || `startup-${Date.now()}` : account.startupId;
    const safeBody = req.user?.role === "admin" ? req.body : stripFounderControlledFields(req.body);
    const payload = {
      ...safeBody,
      id,
      registrationDate: req.body.registrationDate || new Date().toISOString().split("T")[0],
      isApproved: req.user?.role === "admin" ? req.body.isApproved ?? false : false,
      email: req.user?.role === "admin" ? req.body.email : account.email,
      founderName: req.user?.role === "admin" ? req.body.founderName : account.name,
    };
    await ensureNoBase64Logos(payload);
    const updated = await StartupProfile.findOneAndUpdate({ id }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
    
    // Sync to User collection
    await User.findOneAndUpdate(
      { startupId: id },
      { $set: { startupProfile: updated.toObject() } }
    );

    res.status(201).json({ success: true, data: updated.toObject() });
  } catch (err) {
    next(err);
  }
};

export const updateStartup = async (req, res, next) => {
  try {
    await assertStartupOwnerOrAdmin(req, req.params.id);
    const startup = await StartupProfile.findOne({ id: req.params.id });
    if (!startup) throw new AppError("Startup not found.", 404);

    const safeBody = req.user?.role === "admin" ? req.body : stripFounderControlledFields(req.body);
    Object.assign(startup, safeBody, { id: startup.id });
    await ensureNoBase64Logos(startup);
    await startup.save();

    // Sync to User collection
    await User.findOneAndUpdate(
      { startupId: startup.id },
      { $set: { startupProfile: startup.toObject() } }
    );

    res.json({ success: true, data: startup.toObject() });
  } catch (err) {
    next(err);
  }
};

export const toggleStartupApproval = async (req, res, next) => {
  try {
    const startup = await StartupProfile.findOne({ id: req.params.id });
    if (!startup) throw new AppError("Startup not found.", 404);
    startup.isApproved = !startup.isApproved;
    await startup.save();

    // Sync to User collection
    await User.findOneAndUpdate(
      { startupId: startup.id },
      { $set: { "startupProfile.isApproved": startup.isApproved } }
    );

    res.json({ success: true, data: startup.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listInvestors = async (_req, res, next) => {
  try {
    const data = await InvestorProfile.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createInvestor = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      id: `INV-${Date.now()}`,
    };
    const created = await InvestorProfile.create(payload);

    // Send investor details via email
    sendInvestorProfileEmail(created.toObject()).catch((err) => {
      console.error("Failed to send investor profile email:", err);
    });

    res.status(201).json({ success: true, data: created.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listApplications = async (req, res, next) => {
  try {
    let query = {};
    if (req.user?.role !== "admin") {
      const account = await getUserAccount(req);
      if (!account) throw new AppError("Account not found.", 404);
      query = { $or: [{ startupId: account.startupId }, { submittedByEmail: account.email }] };
    } else if (req.query.startupId) {
      query = { startupId: req.query.startupId };
    }
    const [ideas, msmes, foundations, startups, globals] = await Promise.all([
      IdeaValidationApplication.find(query).lean(),
      MsmeApplication.find(query).lean(),
      FoundationApplication.find(query).lean(),
      StartupApplication.find(query).lean(),
      GlobalImpactApplication.find(query).lean(),
    ]);
    const merged = [
      ...ideas,
      ...msmes,
      ...foundations,
      ...startups,
      ...globals,
    ];
    const normalized = merged.map((app) => ({
      ...app,
      id: app.id || app._id.toString(),
    }));
    normalized.sort((a, b) => new Date(b.createdAt || b.submittedDate || 0) - new Date(a.createdAt || a.submittedDate || 0));
    res.json({ success: true, data: normalized });
  } catch (err) {
    next(err);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const data = await IdeaValidationApplication.findOne(applicationLookup(req.params.id)).lean()
      || await MsmeApplication.findOne(applicationLookup(req.params.id)).lean()
      || await FoundationApplication.findOne(applicationLookup(req.params.id)).lean()
      || await StartupApplication.findOne(applicationLookup(req.params.id)).lean()
      || await GlobalImpactApplication.findOne(applicationLookup(req.params.id)).lean();
    if (!data) throw new AppError("Application not found.", 404);
    await assertApplicationOwnerOrAdmin(req, data);
    res.json({ success: true, data: { ...data, id: data.id || data._id.toString() } });
  } catch (err) {
    next(err);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    let selectedProgram = req.body.selectedProgram || null;
    let submittedByEmail = req.user?.role === "admin" ? req.body.submittedByEmail || null : null;
    let submittedByName = req.user?.role === "admin" ? req.body.submittedByName || null : null;
    let startupId = req.user?.role === "admin" ? req.body.startupId || null : null;

    if (req.user?.role !== "admin") {
      const user = await User.findOne({ email: req.user?.email }).lean();
      if (!user) {
        throw new AppError("Account not found.", 404);
      }

      if (user.isActive === false) {
        throw new AppError("Your profile is under review. Please try again after some time.", 403);
      }

      selectedProgram = selectedProgram || user.startupProfile?.selectedProgram || user.selectedProgram || null;
      submittedByEmail = user.email || null;
      submittedByName = user.name || null;
      startupId = user.startupId || null;
    }

    if (req.user?.role !== "admin" && isPlaceholderStartupId(startupId)) {
      throw new AppError("Your startup profile is missing. Please complete registration before applying.", 400);
    }

    let incubatorPreferences = [];
    if (req.body.programId === "startup-program") {
      const currentDate = new Date().toISOString().split("T")[0];
      const formattedSubmittedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      if (req.body.incubator1) {
        incubatorPreferences.push({
          incubatorName: req.body.incubator1,
          preferenceOrder: 1,
          status: "Pending Review",
          submittedDate: formattedSubmittedDate,
          completenessStatus: "In Progress",
          comments: "Pending review",
          commentsDate: currentDate
        });
      }
      if (req.body.incubator2) {
        incubatorPreferences.push({
          incubatorName: req.body.incubator2,
          preferenceOrder: 2,
          status: "Submitted",
          submittedDate: formattedSubmittedDate,
          completenessStatus: "In Progress",
          comments: "Pending review",
          commentsDate: currentDate
        });
      }
      if (req.body.incubator3) {
        incubatorPreferences.push({
          incubatorName: req.body.incubator3,
          preferenceOrder: 3,
          status: "Submitted",
          submittedDate: formattedSubmittedDate,
          completenessStatus: "In Progress",
          comments: "Pending review",
          commentsDate: currentDate
        });
      }
    }

    const payload = {
      ...req.body,
      startupId,
      selectedProgram,
      submittedByEmail: submittedByEmail ? String(submittedByEmail).trim().toLowerCase() : null,
      submittedByName,
      id: req.user?.role === "admin" && req.body.id ? req.body.id : generateApplicationId(),
      submittedDate: req.body.submittedDate || new Date().toISOString().split("T")[0],
      lastUpdated: req.body.lastUpdated || new Date().toISOString().split("T")[0],
      status: req.body.status || "Submitted",
      incubatorPreferences,
      timeline: req.body.timeline || [
        {
          status: req.body.status || "Submitted",
          timestamp: new Date().toLocaleString(),
          remarks: "Application filed successfully.",
        },
      ],
    };
    let created;
    if (req.body.programId === "idea-validation-program") {
      created = await IdeaValidationApplication.create(payload);
    } else if (req.body.programId === "msme-program") {
      created = await MsmeApplication.create(payload);
    } else if (req.body.programId === "foundation-program") {
      created = await FoundationApplication.create(payload);
    } else if (req.body.programId === "startup-program") {
      created = await StartupApplication.create(payload);
    } else if (req.body.programId === "global-impact-program") {
      created = await GlobalImpactApplication.create(payload);
    } else {
      throw new AppError("Invalid program ID.", 400);
    }
    res.status(201).json({ success: true, data: created.toObject() });
  } catch (err) {
    next(err);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const app = await IdeaValidationApplication.findOne(applicationLookup(req.params.id))
      || await MsmeApplication.findOne(applicationLookup(req.params.id))
      || await FoundationApplication.findOne(applicationLookup(req.params.id))
      || await StartupApplication.findOne(applicationLookup(req.params.id))
      || await GlobalImpactApplication.findOne(applicationLookup(req.params.id));

    if (!app) throw new AppError("Application not found.", 404);
    await assertApplicationOwnerOrAdmin(req, app);
    Object.assign(app, req.body);
    if (!app.id) {
      app.id = app._id.toString();
    }
    await app.save();
    res.json({ success: true, data: { ...app.toObject(), id: app.id } });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const app = await IdeaValidationApplication.findOne(applicationLookup(req.params.id))
      || await MsmeApplication.findOne(applicationLookup(req.params.id))
      || await FoundationApplication.findOne(applicationLookup(req.params.id))
      || await StartupApplication.findOne(applicationLookup(req.params.id))
      || await GlobalImpactApplication.findOne(applicationLookup(req.params.id));

    if (!app) throw new AppError("Application not found.", 404);

    app.status = req.body.status;
    app.lastUpdated = new Date().toISOString().split("T")[0];
    if (req.body.status === "Rejected") {
      app.rejectedAt = new Date().toISOString();
    }
    if (req.body.remarks) {
      app.adminRemarks = req.body.remarks;
    }
    app.timeline = [
      {
        status: req.body.status,
        timestamp: new Date().toLocaleString(),
        remarks: req.body.remarks,
      },
      ...(app.timeline || []),
    ];
    if (!app.id) {
      app.id = app._id.toString();
    }
    await app.save();

    if (req.body.status === "Document Requested") {
      await sendApplicationStatusEmail({
        to: app.submittedByEmail || app.applicantEmail,
        application: app.toObject(),
        subject: `Documents requested for ${app.programName}`,
        title: "Document request received",
        headline: "Please share the requested documents",
        body: "Reply to this email with the listed documents attached. You can include them in a single response and our team will continue the review once received.",
        actionLabel: "Requested documents",
        actionText: req.body.remarks || "Please reply with the listed documents as soon as possible.",
      });
    }

    res.json({ success: true, data: app.toObject() });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationIncubatorStatus = async (req, res, next) => {
  try {
    const app = await IdeaValidationApplication.findOne(applicationLookup(req.params.id))
      || await MsmeApplication.findOne(applicationLookup(req.params.id))
      || await FoundationApplication.findOne(applicationLookup(req.params.id))
      || await StartupApplication.findOne(applicationLookup(req.params.id))
      || await GlobalImpactApplication.findOne(applicationLookup(req.params.id));

    if (!app) throw new AppError("Application not found.", 404);

    const { preferenceOrder, status, completenessStatus, comments } = req.body;
    if (!preferenceOrder) {
      throw new AppError("Preference order is required.", 400);
    }

    if (!app.incubatorPreferences) {
      app.incubatorPreferences = [];
    }

    const pref = app.incubatorPreferences.find((p) => p.preferenceOrder === Number(preferenceOrder));
    if (!pref) {
      throw new AppError(`Preference order ${preferenceOrder} not found on this application.`, 404);
    }

    if (status) pref.status = status;
    if (completenessStatus) pref.completenessStatus = completenessStatus;
    if (comments) pref.comments = comments;

    const currentDate = new Date().toISOString().split("T")[0];
    const formattedCommentsDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    pref.commentsDate = formattedCommentsDate;

    app.lastUpdated = currentDate;

    // Add to timeline
    app.timeline = [
      {
        status: app.status,
        timestamp: new Date().toLocaleString(),
        remarks: `Incubator preference #${preferenceOrder} (${pref.incubatorName}) status updated to ${status || pref.status}.`,
      },
      ...(app.timeline || []),
    ];

    await app.save();
    res.json({ success: true, data: app.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listQueries = async (_req, res, next) => {
  try {
    const data = await ContactQuery.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createQuery = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      id: `TKT-${Date.now()}`,
      name: req.body.name,
      contactName: req.body.name,
      subject: req.body.subject || req.body.queryType || "General query",
      submittedDate: req.body.submittedDate || new Date().toISOString().split("T")[0],
      isResolved: false,
    };
    const created = await ContactQuery.create(payload);
    
    // Send query details via email
    sendContactQueryEmail(created.toObject()).catch((err) => {
      console.error("Failed to send contact query email:", err);
    });

    res.status(201).json({ success: true, data: created.toObject() });
  } catch (err) {
    next(err);
  }
};

export const replyQuery = async (req, res, next) => {
  try {
    const query = await ContactQuery.findOne({ id: req.params.id });
    if (!query) throw new AppError("Query not found.", 404);
    query.isResolved = true;
    query.adminReply = req.body.reply;
    await query.save();
    res.json({ success: true, data: query.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listFaqs = async (_req, res, next) => {
  try {
    const data = await Faq.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const listAnnouncements = async (_req, res, next) => {
  try {
    const data = await Announcement.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const listConnections = async (_req, res, next) => {
  try {
    const data = await Connection.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [
      startups,
      ideas,
      msmes,
      foundations,
      startupsDocs,
      globals,
      queries,
      programs,
    ] = await Promise.all([
      StartupProfile.find(),
      IdeaValidationApplication.find().lean(),
      MsmeApplication.find().lean(),
      FoundationApplication.find().lean(),
      StartupApplication.find().lean(),
      GlobalImpactApplication.find().lean(),
      ContactQuery.find(),
      Program.find(),
    ]);

    const applications = [
      ...ideas,
      ...msmes,
      ...foundations,
      ...startupsDocs,
      ...globals,
    ];

    res.json({
      success: true,
      data: {
        totalStartups: startups.length,
        pendingApprovals: startups.filter((s) => !s.isApproved).length,
        approvedStartups: startups.filter((s) => s.isApproved).length,
        totalApplications: applications.length,
        pendingApplicationsCount: applications.filter((a) => a.status === "Submitted" || a.status === "Under Review").length,
        totalPrograms: programs.length,
        activePrograms: programs.filter((p) => p.isOpen).length,
        totalQueries: queries.length,
        unresolvedQueries: queries.filter((q) => !q.isResolved).length,
      },
    });
  } catch (err) {
    next(err);
  }
};
