import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "asdfs",
            price: 20,
        })
        .expect(404);
});
it("returns a 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "asdfs",
            price: 20,
        })
        .expect(401);
});
it("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", global.signin())
        .send({
            title: "asdfs",
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", global.signin())
        .send({
            title: "asdgaszxz",
            price: 10,
        })
        .expect(401);
});
it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", cookie)
        .send({
            title: "asdfas",
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 20,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "asdgas",
            price: -20,
        })
        .expect(400);
});
it("updates the ticket if provided valid inputs", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", cookie)
        .send({
            title: "asdfas",
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "EMREMER",
            price: 25,
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    expect(ticketResponse.body.title).toEqual("EMREMER");
    expect(ticketResponse.body.price).toEqual(25);
});

it("publishes an event", async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post("/api/tickets/")
        .set("Cookie", cookie)
        .send({
            title: "asdfas",
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "EMREMER",
            price: 25,
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});