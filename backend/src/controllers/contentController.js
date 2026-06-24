import { AppError } from "../utils/errors.js";
import { Program } from "../models/Program.js";
import { StartupProfile } from "../models/StartupProfile.js";
import { InvestorProfile } from "../models/InvestorProfile.js";
import { ApplicationRecord } from "../models/ApplicationRecord.js";
import { ContactQuery } from "../models/ContactQuery.js";
import { Notification } from "../models/Notification.js";
import { Connection } from "../models/Connection.js";
import { Faq } from "../models/Faq.js";
import { Announcement } from "../models/Announcement.js";

const sortNewestFirst = { createdAt: -1, updatedAt: -1 };

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
    const query = req.query.approvedOnly === "true" ? { isApproved: true } : {};
    const data = await StartupProfile.find(query).sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getStartup = async (req, res, next) => {
  try {
    const data = await StartupProfile.findOne({ id: req.params.id }).lean();
    if (!data) throw new AppError("Startup not found.", 404);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateStartup = async (req, res, next) => {
  try {
    const id = req.body.id || `startup-${Date.now()}`;
    const payload = {
      ...req.body,
      id,
      registrationDate: req.body.registrationDate || new Date().toISOString().split("T")[0],
      isApproved: req.body.isApproved ?? false,
    };
    const updated = await StartupProfile.findOneAndUpdate({ id }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.status(201).json({ success: true, data: updated.toObject() });
  } catch (err) {
    next(err);
  }
};

export const updateStartup = async (req, res, next) => upsertById(StartupProfile, req, res, next, (body) => body);

export const toggleStartupApproval = async (req, res, next) => {
  try {
    const startup = await StartupProfile.findOne({ id: req.params.id });
    if (!startup) throw new AppError("Startup not found.", 404);
    startup.isApproved = !startup.isApproved;
    await startup.save();
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

export const listApplications = async (req, res, next) => {
  try {
    const query = req.query.startupId ? { startupId: req.query.startupId } : {};
    const data = await ApplicationRecord.find(query).sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const data = await ApplicationRecord.findOne({ id: req.params.id }).lean();
    if (!data) throw new AppError("Application not found.", 404);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      id: req.body.id || `APP-${Date.now()}`,
      submittedDate: req.body.submittedDate || new Date().toISOString().split("T")[0],
      lastUpdated: req.body.lastUpdated || new Date().toISOString().split("T")[0],
      status: req.body.status || "Submitted",
      timeline: req.body.timeline || [
        {
          status: req.body.status || "Submitted",
          timestamp: new Date().toLocaleString(),
          remarks: "Application filed successfully.",
        },
      ],
    };
    const created = await ApplicationRecord.create(payload);
    res.status(201).json({ success: true, data: created.toObject() });
  } catch (err) {
    next(err);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const app = await ApplicationRecord.findOne({ id: req.params.id });
    if (!app) throw new AppError("Application not found.", 404);
    Object.assign(app, req.body);
    await app.save();
    res.json({ success: true, data: app.toObject() });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const app = await ApplicationRecord.findOne({ id: req.params.id });
    if (!app) throw new AppError("Application not found.", 404);

    app.status = req.body.status;
    app.lastUpdated = new Date().toISOString().split("T")[0];
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
    await app.save();
    res.json({ success: true, data: app.toObject() });
  } catch (err) {
    next(err);
  }
};

export const listNotifications = async (_req, res, next) => {
  try {
    const data = await Notification.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const upsertNotification = async (req, res, next) => upsertById(Notification, req, res, next, (body) => body);

export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const markAllNotificationsRead = async (_req, res, next) => {
  try {
    await Notification.updateMany({}, { $set: { isRead: true } });
    const data = await Notification.find().sort(sortNewestFirst).lean();
    res.json({ success: true, data });
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
      id: req.body.id || `TKT-${Date.now()}`,
      submittedDate: req.body.submittedDate || new Date().toISOString().split("T")[0],
      isResolved: false,
    };
    const created = await ContactQuery.create(payload);
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
    const [startups, applications, queries, programs] = await Promise.all([
      StartupProfile.find(),
      ApplicationRecord.find(),
      ContactQuery.find(),
      Program.find(),
    ]);

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
