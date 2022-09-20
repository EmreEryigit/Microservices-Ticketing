import { PaymentCreatedEvent, Publisher, Subjects } from "@biletx/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    
}