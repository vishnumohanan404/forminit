import request from "supertest";
import { app } from "../app";

const DEFAULT_USER = {
  fullName: "Test User",
  email: "test@example.com",
  password: "Password1!",
};

/**
 * Signs up a user via the API and returns the jwt cookie string
 * for use in subsequent authenticated requests.
 */
export const signupAndGetCookie = async (user = DEFAULT_USER): Promise<{ cookie: string }> => {
  const res = await request(app).post("/api/auth/signup").send(user);
  const setCookie = res.headers["set-cookie"] as unknown as string[] | undefined;
  const cookie = setCookie?.[0] ?? "";
  return { cookie };
};

/**
 * Signs up a user and fetches their dashboard to obtain a workspace ID.
 */
export const signupAndGetWorkspaceId = async (
  user = DEFAULT_USER,
): Promise<{ cookie: string; workspaceId: string }> => {
  const { cookie } = await signupAndGetCookie(user);
  const dashRes = await request(app).get("/api/dashboard").set("Cookie", cookie);
  const workspaceId = dashRes.body.workspaces?.[0]?._id as string;
  return { cookie, workspaceId };
};
