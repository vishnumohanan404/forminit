import request from "supertest";
import { app } from "../app";
import { signupAndGetWorkspaceId } from "./helpers";

const makeFormPayload = (workspaceId: string) => ({
  title: "My Test Form",
  time: Date.now(),
  version: "2.30.6",
  workspaceId,
  blocks: [
    {
      type: "shortAnswerTool",
      data: { title: "What is your name?", placeholder: "", required: false },
    },
  ],
});

describe("POST /api/form", () => {
  it("should create a form when authenticated", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const res = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("My Test Form");
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app).post("/api/form").send({ title: "x" });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/form/view-form/:formId", () => {
  it("should return a public form without auth", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const formId = createRes.body._id as string;

    const res = await request(app).get(`/api/form/view-form/${formId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("My Test Form");
  });

  it("should return 404 for a non-existent form", async () => {
    const res = await request(app).get("/api/form/view-form/000000000000000000000000");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /api/form/:formId", () => {
  it("should return form data when authenticated as owner", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const formId = createRes.body._id as string;

    const res = await request(app).get(`/api/form/${formId}`).set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(formId);
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app).get("/api/form/000000000000000000000000");
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /api/form/:id", () => {
  it("should update form title", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const formId = createRes.body._id as string;

    const res = await request(app)
      .put(`/api/form/${formId}`)
      .set("Cookie", cookie)
      .send({ ...makeFormPayload(workspaceId), title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });
});

describe("POST /api/form/submit-form", () => {
  it("should accept a form submission without auth", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const form = createRes.body;

    const res = await request(app)
      .post("/api/form/submit-form")
      .send({
        _id: form._id,
        title: form.title,
        blocks: form.blocks.map((b: { type: string; data: object }) => ({
          ...b,
          data: { ...b.data, value: "Alice" },
        })),
      });

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /api/form/submissions/:formId", () => {
  it("should return submissions with pagination", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const form = createRes.body;

    // Submit once
    await request(app).post("/api/form/submit-form").send({
      _id: form._id,
      title: form.title,
      blocks: form.blocks,
    });

    const res = await request(app)
      .get(`/api/form/submissions/${form._id}?page=1&limit=10`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("submissions");
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBe(1);
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app).get("/api/form/submissions/000000000000000000000000");
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /api/form/disable/:id", () => {
  it("should toggle form disabled status", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const formId = createRes.body._id as string;

    const res = await request(app).put(`/api/form/disable/${formId}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("DELETE /api/form/:id", () => {
  it("should delete a form and its submissions", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const formId = createRes.body._id as string;

    const res = await request(app).delete(`/api/form/${formId}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);

    // Confirm it's gone
    const viewRes = await request(app).get(`/api/form/view-form/${formId}`);
    expect(viewRes.statusCode).toBe(404);
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app).delete("/api/form/000000000000000000000000");
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/form/analytics/:formId", () => {
  const makeRatingFormPayload = (workspaceId: string) => ({
    title: "Analytics Test Form",
    time: Date.now(),
    version: "2.30.6",
    workspaceId,
    blocks: [
      {
        type: "ratingTool",
        data: { title: "Rate your experience", required: false },
      },
      {
        type: "multipleChoiceTool",
        data: {
          title: "Favourite colour",
          required: false,
          options: [
            { optionMarker: "A", optionValue: "Red" },
            { optionMarker: "B", optionValue: "Blue" },
          ],
        },
      },
      {
        type: "shortAnswerTool",
        data: { title: "Any comments?", placeholder: "", required: false },
      },
    ],
  });

  it("should return 401 without authentication", async () => {
    const res = await request(app).get("/api/form/analytics/000000000000000000000000");
    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for a non-existent form", async () => {
    const { cookie } = await signupAndGetWorkspaceId();
    const res = await request(app)
      .get("/api/form/analytics/000000000000000000000000")
      .set("Cookie", cookie);
    expect(res.statusCode).toBe(404);
  });

  it("should return zero submissions and empty arrays for a new form", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const formId = createRes.body._id as string;

    const res = await request(app).get(`/api/form/analytics/${formId}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalSubmissions).toBe(0);
    expect(res.body.submissionsOverTime).toEqual([]);
    expect(Array.isArray(res.body.blockAnalytics)).toBe(true);
  });

  it("should increment totalSubmissions to 1 after one submission", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeFormPayload(workspaceId));
    const form = createRes.body;

    await request(app)
      .post("/api/form/submit-form")
      .send({
        _id: form._id,
        title: form.title,
        blocks: form.blocks.map((b: { type: string; data: object }) => ({
          ...b,
          data: { ...b.data, value: "Alice" },
        })),
      });

    const res = await request(app).get(`/api/form/analytics/${form._id}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalSubmissions).toBe(1);
  });

  it("should compute rating average and distribution", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeRatingFormPayload(workspaceId));
    const form = createRes.body;

    // Submit two ratings: 4 and 2
    for (const rating of [4, 2]) {
      await request(app)
        .post("/api/form/submit-form")
        .send({
          _id: form._id,
          title: form.title,
          blocks: [
            { type: "ratingTool", data: { value: String(rating) } },
            { type: "multipleChoiceTool", data: { selectedOption: "A" } },
            { type: "shortAnswerTool", data: { value: "" } },
          ],
        });
    }

    const res = await request(app).get(`/api/form/analytics/${form._id}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    const ratingBlock = res.body.blockAnalytics.find(
      (b: { type: string }) => b.type === "ratingTool",
    );
    expect(ratingBlock).toBeDefined();
    expect(ratingBlock.analytics.average).toBe(3);
    expect(typeof ratingBlock.analytics.distribution).toBe("object");
  });

  it("should compute option counts for multiple-choice block", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeRatingFormPayload(workspaceId));
    const form = createRes.body;

    // Submit: A, A, B
    for (const marker of ["A", "A", "B"]) {
      await request(app)
        .post("/api/form/submit-form")
        .send({
          _id: form._id,
          title: form.title,
          blocks: [
            { type: "ratingTool", data: { value: "3" } },
            { type: "multipleChoiceTool", data: { selectedOption: marker } },
            { type: "shortAnswerTool", data: { value: "" } },
          ],
        });
    }

    const res = await request(app).get(`/api/form/analytics/${form._id}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    const choiceBlock = res.body.blockAnalytics.find(
      (b: { type: string }) => b.type === "multipleChoiceTool",
    );
    expect(choiceBlock).toBeDefined();
    const options = choiceBlock.analytics.options as Array<{ label: string; count: number }>;
    const redOpt = options.find(o => o.label === "Red");
    const blueOpt = options.find(o => o.label === "Blue");
    expect(redOpt?.count).toBe(2);
    expect(blueOpt?.count).toBe(1);
  });

  it("should return responseCount for text block", async () => {
    const { cookie, workspaceId } = await signupAndGetWorkspaceId();
    const createRes = await request(app)
      .post("/api/form")
      .set("Cookie", cookie)
      .send(makeRatingFormPayload(workspaceId));
    const form = createRes.body;

    // One submission with a comment, one without
    await request(app)
      .post("/api/form/submit-form")
      .send({
        _id: form._id,
        title: form.title,
        blocks: [
          { type: "ratingTool", data: { value: "5" } },
          { type: "multipleChoiceTool", data: { selectedOption: "A" } },
          { type: "shortAnswerTool", data: { value: "Great!" } },
        ],
      });
    await request(app)
      .post("/api/form/submit-form")
      .send({
        _id: form._id,
        title: form.title,
        blocks: [
          { type: "ratingTool", data: { value: "3" } },
          { type: "multipleChoiceTool", data: { selectedOption: "B" } },
          { type: "shortAnswerTool", data: { value: "" } },
        ],
      });

    const res = await request(app).get(`/api/form/analytics/${form._id}`).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    const textBlock = res.body.blockAnalytics.find(
      (b: { type: string }) => b.type === "shortAnswerTool",
    );
    expect(textBlock).toBeDefined();
    expect(textBlock.analytics.responseCount).toBe(1);
  });
});
