import "dotenv/config";

export const PORT = 5000;

// Update to match the `.env` variable name
export const mongoDBURL = process.env.MONGO_URI;
