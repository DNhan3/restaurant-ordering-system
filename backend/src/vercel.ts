// src/vercel.ts
import { createApp } from './app.js';

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createApp();
    await app.init();
  }

  const expressApp = app.getHttpAdapter().getInstance();

  return expressApp(req, res);
}
