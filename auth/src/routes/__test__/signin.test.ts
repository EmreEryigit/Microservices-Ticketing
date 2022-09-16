import request from "supertest";
import { app } from "../../app";

it("fails when email does not exist", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "emre@emre.com",
            password: "12345",
        })
        .expect(400);
});

it("fails when incorrect password supplied", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "emre@emre.com",
            password: "12345",
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "emre@emre.com",
            password: "123456",
        })
        .expect(400);
});
it("responds with a cookie given valid credentials", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "emre@emre.com",
            password: "12345",
        })
        .expect(201);

    const res = await request(app)
        .post("/api/users/signin")
        .send({
            email: "emre@emre.com",
            password: "12345",
        })
        .expect(201);

    expect(res.get("Set-Cookie")).toBeDefined()
});
