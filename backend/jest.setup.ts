import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "./src/models/user";
import Dashboard from "./src/models/dashboard";
import Form from "./src/models/form";
import Submission from "./src/models/submission";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  process.env.MONGOMS_DOWNLOAD_DIR = ".mongodb-binaries";
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Dashboard.deleteMany({});
  await Form.deleteMany({});
  await Submission.deleteMany({});
});
