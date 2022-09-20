import { OrderCancelledEvent } from "@biletx/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import Ticket from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        price: 20,
        title: "concert",
        userId: "asdfasd",
    });
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        ticket: {
            id: ticket.id,
        },
        version: 0,
    };
    // @ts-ignore

    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, msg, data, ticket, orderId };
};

it("updates the ticket, publishes an event and acks the message", async () => {
    const { listener, msg, data, ticket, orderId } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket?.orderId).not.toBeDefined();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("acks the message", async () => {
    const { listener, msg, data, ticket, orderId } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
