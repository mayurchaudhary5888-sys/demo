import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Program } from "../models/Program.js";
import { StartupProfile } from "../models/StartupProfile.js";
import { InvestorProfile } from "../models/InvestorProfile.js";
import { ContactQuery } from "../models/ContactQuery.js";

import { Connection } from "../models/Connection.js";
import { Faq } from "../models/Faq.js";
import { Announcement } from "../models/Announcement.js";
import {
  seedAnnouncements,
  seedApplications,
  seedConnections,
  seedFaqs,
  seedInvestors,
  seedPrograms,
  seedQueries,
} from "../data/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const startupsPath = path.resolve(__dirname, "..", "..", "data", "startups.json");

const readStartupsSeed = async () => {
  try {
    const raw = await fs.readFile(startupsPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const seedCollection = async (Model, seed) => {
  const count = await Model.countDocuments();
  if (count === 0 && seed.length) {
    await Model.insertMany(seed, { ordered: false });
  }
};

export const bootstrapContent = async () => {
  await seedCollection(Program, seedPrograms);
  await seedCollection(InvestorProfile, seedInvestors);
  await seedCollection(ContactQuery, seedQueries);

  await seedCollection(Connection, seedConnections);
  await seedCollection(Faq, seedFaqs);
  await seedCollection(Announcement, seedAnnouncements);

  const startupCount = await StartupProfile.countDocuments();
  if (startupCount === 0) {
    const startups = await readStartupsSeed();
    if (startups.length) {
      await StartupProfile.insertMany(startups, { ordered: false });
    }
  }
};
