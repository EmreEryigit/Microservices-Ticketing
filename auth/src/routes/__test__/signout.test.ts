import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "emre@emre.com",
            password: "12345",
        })
        .expect(201);

    const res = await request(app)
        .post("/api/users/signout")
        .send({})
        .expect(200);
    expect(res.get("Set-Cookie")).toBeDefined();
});
