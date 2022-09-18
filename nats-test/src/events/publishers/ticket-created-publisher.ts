import { Subjects } from "../types/subjects";
import { TicketCreatedEvent } from "../types/ticket-created-event";
import { Publisher } from "./base-publisher";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
