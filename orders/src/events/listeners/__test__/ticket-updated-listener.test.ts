import { TicketUpdatedEvent } from "@biletx/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
    // create fake data and msg object
    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        price: 35,
        title: "new concert",
        userId: "asdgagdsfg",
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    // return all
    return { msg, data, listener, ticket };
};

it("finds updates and saves a ticket", async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.title).toEqual(data.title);
    expect(updatedTicket?.version).toEqual(data.version);
    expect(updatedTicket?.price).toEqual(data.price);
});

it("acks the message", async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version", async () => {
    const { msg, data, ticket, listener } = await setup();

    data.version = 10;

        await listener.onMessage(data, msg).catch(err => console.log(err));


    expect(msg.ack).not.toHaveBeenCalled();
});
