import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
const OrderShow = ({
    order,
    currentUser,
}: {
    order: Order;
    currentUser: CurrentUser;
}) => {
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id,
        },
        onSuccess: () => Router.push("/orders"),
    });
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = +new Date(order.expiresAt) - +new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timer = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order expired.</div>;
    }
    return (
        <div>
            {timeLeft} seconds until order expires
            <StripeCheckout
                stripeKey="pk_test_51Lk8XfEjz2tjLr70JkEgRwYu0sqUWZzVVU5FCzzQzb3mEb4zQRPb1OkNrUEZPFv0vSGjsB9q69P7IEZyv6UYiS7K00dY6rfhsi"
                token={({ id }) => doRequest({ token: id })}
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};

OrderShow.getInitialProps = async (
    context: NextPageContext,
    client: AxiosInstance
) => {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;
