import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
    var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: any;
process.env.STRIPE_KEY =
    "sk_test_51Lk8XfEjz2tjLr7037mSf6NFP00DtYtbrNlKj4J3kvUIzqswAdhMgmDAO5qKIBxLaVep9lQRAE3LVpz4nE1hV25C00edI2IK3L";
beforeAll(async () => {
    process.env.JWT_KEY = "asdsdf";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload. {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "emre@emre.com",
    };

    // create a JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build a session object. {jwt: MY_JWT}
    const session = { jwt: token };
    // turn session into JSON
    const sessionJSON = JSON.stringify(session);

    // take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // return a string that is a cookie with the encoded data

    return [`session=${base64}`];
};
