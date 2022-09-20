import { OrderStatus } from "@biletx/common";
import mongoose from "mongoose";

interface OrderAttrs {
    userId: string;
    id: string;
    version: number;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    version: number;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: String,
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        optimisticConcurrency: true,
        versionKey: "version",
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        status: attrs.status,
        userId: attrs.userId,
        price: attrs.price,
        version: attrs.version,
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
