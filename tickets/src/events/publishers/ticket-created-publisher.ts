import { Publisher, Subjects, TicketCreatedEvent } from "@biletx/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    
}