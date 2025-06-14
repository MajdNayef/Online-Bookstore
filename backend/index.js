import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import booksRoute from './routes/booksRoute.js';

import { PORT, mongoDBURL } from './config.js';
// config.js should export:
//   export const PORT = process.env.PORT || 5000;
//   export const mongoDBURL = process.env.MONGO_URI;

const app = express();

// — Middlewares —
app.use(express.json());
app.use(cors());

// Simple root health-check
app.get('/', (req, res) => {
  res
    .status(200)
    .send('📚 Welcome to the MERN Stack Bookstore API!');
});

// Mount your book routes
app.use('/books', booksRoute);

// — Startup logic —
async function startServer() {
  if (!mongoDBURL) {
    console.error('❌ Error: Missing MONGO_URI environment variable');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Listen on all interfaces so Docker port-forwarding works
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Server listening on http://0.0.0.0:${PORT}');
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();