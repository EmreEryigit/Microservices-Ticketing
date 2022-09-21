import { OrderStatus } from "@biletx/common";
import { List, ThemeIcon } from "@mantine/core";
import {
    IconCircleCheck,
    IconCircleDashed,
    IconCreditCardOff,
    IconHourglass,
    IconHourglassLow,
} from "@tabler/icons";
import { AxiosInstance } from "axios";
import { NextPageContext } from "next";

const OrderIndex = ({ orders }: { orders: Order[] }) => {
    const icons = (order: Order) => {
        if (order.status === OrderStatus.Complete) {
            return (
                <ThemeIcon color="green" size={24} radius="xl">
                    <IconCircleCheck size={16} />
                </ThemeIcon>
            );
        }
        if (order.status === OrderStatus.Cancelled) {
            return (
                <ThemeIcon color="red" size={24} radius="xl">
                    <IconCreditCardOff size={16} />
                </ThemeIcon>
            );
        }
        if (order.status === OrderStatus.AwaitingPayment) {
            return (
                <ThemeIcon color="blue" size={24} radius="xl">
                    <IconHourglassLow size={16} />
                </ThemeIcon>
            );
        }
    };
    return (
        <List
            spacing="xs"
            size="sm"
            center
            icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                    <IconHourglass size={16} />
                </ThemeIcon>
            }
        >
            {orders.map((order) => {
                return (
                    <List.Item key={order.id} icon={icons(order)}>
                        {order.ticket.title} - Order Status: {order.status}
                    </List.Item>
                );
            })}
        </List>
    );
};

OrderIndex.getInitialProps = async (
    context: NextPageContext,
    client: AxiosInstance
) => {
    const { data } = await client.get("/api/orders");
    return { orders: data };
};

export default OrderIndex;
