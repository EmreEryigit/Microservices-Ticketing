import { AxiosInstance } from "axios";
import { NextPageContext } from "next";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }: { ticket: Ticket }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            ticketId: ticket.id,
        },
        onSuccess: (order: Order) => Router.push(`/orders/${order.id}`),
    });

    return (
        <div>
            <h1>{ticket?.title}</h1>
            <h4>Price: {ticket?.price}</h4>
            {errors}
            <button onClick={() => doRequest()} className="btn btn-primary">
                Purchase
            </button>
        </div>
    );
};

TicketShow.getInitialProps = async (
    context: NextPageContext,
    client: AxiosInstance
) => {
    const { ticketId } = context.query;

    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
};

export default TicketShow;
