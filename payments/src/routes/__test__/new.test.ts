import { OrderStatus } from "@biletx/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

/* jest.mock("../../stripe"); */

it("returns a 404 purchasing a order that does not exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "sadasg",
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it("returns a 401 purchasing a order that does not belong to the current user", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 20,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "sadasg",
            orderId: order.id,
        })
        .expect(401);
});

it("returns a 400 purchasing a order that is cancelled", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        price: 20,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            token: "sadasg",
            orderId: order.id,
        })
        .expect(400);
});

/* it("returns a 201 with valid inputs", async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 20,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            token: "tok_visa",
            orderId: order.id,
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual("tok_visa");
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual("usd");
}); */

it("returns a 204 with valid inputs", async () => {
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price,
    });
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            token: "tok_visa",
            orderId: order.id,
        })
        .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge?.id,
    });
    expect(payment).not.toBeNull();
});
