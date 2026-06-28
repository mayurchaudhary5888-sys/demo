import { Router } from "express";
import {
  createApplication,
  getApplication,
  createProgram,
  createQuery,
  createOrUpdateStartup,
  listAnnouncements,
  listConnections,
  listFaqs,
  deleteNotification,
  getDashboardStats,
  getProgram,
  getStartup,
  listApplications,
  listInvestors,
  listUsers,
  listNotifications,
  listPrograms,
  listQueries,
  listStartups,
  markAllNotificationsRead,
  replyQuery,
  toggleProgram,
  toggleStartupApproval,
  updateUserStatus,
  updateApplicationStatus,
  updateStartup,
  upsertNotification,
} from "../controllers/contentController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const contentRoutes = Router();

contentRoutes.get("/programs", listPrograms);
contentRoutes.get("/programs/:id", getProgram);
contentRoutes.post("/admin/programs", requireAuth, requireAdmin, createProgram);
contentRoutes.patch("/admin/programs/:id/toggle", requireAuth, requireAdmin, toggleProgram);

contentRoutes.get("/startups", listStartups);
contentRoutes.get("/startups/:id", getStartup);
contentRoutes.post("/startups", requireAuth, createOrUpdateStartup);
contentRoutes.patch("/startups/:id", requireAuth, updateStartup);
contentRoutes.patch("/admin/startups/:id/approval", requireAuth, requireAdmin, toggleStartupApproval);

contentRoutes.get("/investors", listInvestors);

contentRoutes.get("/applications", listApplications);
contentRoutes.get("/applications/:id", getApplication);
contentRoutes.post("/applications", requireAuth, createApplication);
contentRoutes.patch("/admin/applications/:id/status", requireAuth, requireAdmin, updateApplicationStatus);
contentRoutes.get("/admin/users", requireAuth, requireAdmin, listUsers);
contentRoutes.patch("/admin/users/:id/status", requireAuth, requireAdmin, updateUserStatus);

contentRoutes.get("/notifications", requireAuth, listNotifications);
contentRoutes.patch("/notifications/mark-all-read", requireAuth, markAllNotificationsRead);
contentRoutes.patch("/notifications/:id", requireAuth, upsertNotification);
contentRoutes.delete("/notifications/:id", requireAuth, deleteNotification);

contentRoutes.get("/queries", listQueries);
contentRoutes.post("/queries", createQuery);
contentRoutes.patch("/admin/queries/:id/reply", requireAuth, requireAdmin, replyQuery);

contentRoutes.get("/faqs", listFaqs);
contentRoutes.get("/announcements", listAnnouncements);
contentRoutes.get("/connections", requireAuth, listConnections);

contentRoutes.get("/admin/stats", requireAuth, requireAdmin, getDashboardStats);
