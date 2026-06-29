import "dotenv/config";
import app from "../src/app";

// Vercel's @vercel/node runtime wraps this exported Express app per-request.
// Do NOT call app.listen() here — serverless functions don't keep a persistent
// process alive, so binding a port has no effect and was the wrong mental model
// (server.ts's app.listen() is only for local dev / persistent hosts like Railway).
export default app;