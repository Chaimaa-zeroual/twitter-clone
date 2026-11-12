

import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL introuvable dans .env");
    }

    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "twitter-clone",
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connecté avec succès");
  } catch (error) {
    console.error("Erreur MongoDB :", error);
    throw error;
  }
};
