import { Listener, OrderCreatedEvent, Subjects } from "@biletx/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // if no ticket throw error
        if (!ticket) {
            throw new Error("ticket not found");
        }
        // Mark the ticket
        ticket.set({ orderId: data.id });
        // save the ticket
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
            orderId: ticket.orderId,
            userId: ticket.userId,
        });
        // ack the message

        msg.ack();
    }
}
