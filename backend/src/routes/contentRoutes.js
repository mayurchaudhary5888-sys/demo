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
import { optionalAuth, requireAdmin, requireAuth } from "../middleware/auth.js";
import { publicSubmissionRateLimiter, writeRateLimiter } from "../middleware/security.js";
import {
  applicationSchema,
  applicationStatusSchema,
  contactQuerySchema,
  notificationPatchSchema,
  programSchema,
  queryReplySchema,
  startupProfileSchema,
  userStatusSchema,
  validateBody,
} from "../validators/contentValidators.js";
import { uploadLogo } from "../controllers/uploadController.js";

export const contentRoutes = Router();

contentRoutes.post("/uploads/logo", publicSubmissionRateLimiter, uploadLogo);

contentRoutes.get("/programs", listPrograms);
contentRoutes.get("/programs/:id", getProgram);
contentRoutes.post("/admin/programs", requireAuth, requireAdmin, writeRateLimiter, validateBody(programSchema), createProgram);
contentRoutes.patch("/admin/programs/:id/toggle", requireAuth, requireAdmin, writeRateLimiter, toggleProgram);

contentRoutes.get("/startups", optionalAuth, listStartups);
contentRoutes.get("/startups/:id", optionalAuth, getStartup);
contentRoutes.post("/startups", requireAuth, writeRateLimiter, validateBody(startupProfileSchema), createOrUpdateStartup);
contentRoutes.patch("/startups/:id", requireAuth, writeRateLimiter, validateBody(startupProfileSchema.partial()), updateStartup);
contentRoutes.patch("/admin/startups/:id/approval", requireAuth, requireAdmin, writeRateLimiter, toggleStartupApproval);

contentRoutes.get("/investors", listInvestors);

contentRoutes.get("/applications", requireAuth, listApplications);
contentRoutes.get("/applications/:id", requireAuth, getApplication);
contentRoutes.post("/applications", requireAuth, writeRateLimiter, validateBody(applicationSchema), createApplication);
contentRoutes.patch("/admin/applications/:id/status", requireAuth, requireAdmin, writeRateLimiter, validateBody(applicationStatusSchema), updateApplicationStatus);
contentRoutes.get("/admin/users", requireAuth, requireAdmin, listUsers);
contentRoutes.patch("/admin/users/:id/status", requireAuth, requireAdmin, writeRateLimiter, validateBody(userStatusSchema), updateUserStatus);

contentRoutes.get("/notifications", requireAuth, listNotifications);
contentRoutes.patch("/notifications/mark-all-read", requireAuth, writeRateLimiter, markAllNotificationsRead);
contentRoutes.patch("/notifications/:id", requireAuth, writeRateLimiter, validateBody(notificationPatchSchema), upsertNotification);
contentRoutes.delete("/notifications/:id", requireAuth, writeRateLimiter, deleteNotification);

contentRoutes.get("/queries", requireAuth, requireAdmin, listQueries);
contentRoutes.post("/queries", publicSubmissionRateLimiter, validateBody(contactQuerySchema), createQuery);
contentRoutes.patch("/admin/queries/:id/reply", requireAuth, requireAdmin, writeRateLimiter, validateBody(queryReplySchema), replyQuery);

contentRoutes.get("/faqs", listFaqs);
contentRoutes.get("/announcements", listAnnouncements);
contentRoutes.get("/connections", requireAuth, listConnections);

contentRoutes.get("/admin/stats", requireAuth, requireAdmin, getDashboardStats);
