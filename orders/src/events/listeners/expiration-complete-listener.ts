import {
    ExpirationCompleteEvent,
    Listener,
    NotFoundError,
    OrderStatus,
    Subjects,
} from "@biletx/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error();
        }

        if(order.status === OrderStatus.Complete){
            return msg.ack()
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: data.orderId,
            ticket: {
                id: order.ticket.id,
            },
            version: order.version,
        });

        msg.ack();
    }
}
