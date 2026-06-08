import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from '../config/env.js';

mongoose.set('strictQuery', true);

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (env.MONGODB_URI.startsWith('mongodb+srv://')) {
    dns.setServers(
      env.MONGODB_DNS_SERVERS.split(',')
        .map((server) => server.trim())
        .filter(Boolean)
    );
  }

  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME
  });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
