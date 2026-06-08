import { env } from './config/env.js';
import { createApp } from './app.js';
import { connectDatabase } from './database/mongoose.js';

const app = createApp();

connectDatabase()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`API listening on ${env.API_BASE_URL}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB.', error);
    process.exitCode = 1;
  });
