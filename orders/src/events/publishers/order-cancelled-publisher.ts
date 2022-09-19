import { OrderCancelledEvent, Publisher, Subjects } from "@biletx/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
