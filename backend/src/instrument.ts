import "dotenv/config";
import * as Sentry from "@sentry/node";

const isProduction = ["staging", "production"].includes(process.env.NODE_ENV || "");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: isProduction,
  tracesSampleRate: 0.2,
  sendDefaultPii: true,
});
