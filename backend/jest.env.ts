// This file runs before any modules are imported (setupFiles).
// It must set all env vars needed by top-level module code.
process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";
