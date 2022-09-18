import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "../types/subjects";
import { TicketCreatedEvent } from "../types/ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = "payments-service";
    onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        console.log("event data", data);
        msg.ack();
    }
}
