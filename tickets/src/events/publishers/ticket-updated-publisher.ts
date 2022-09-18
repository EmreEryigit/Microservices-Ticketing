import { Publisher, Subjects, TicketUpdatedEvent } from "@biletx/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}