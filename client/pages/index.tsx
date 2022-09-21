import { Code, Table, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { AxiosInstance } from "axios";
import { NextPage } from "next";
import { AppContext, AppInitialProps } from "next/app";
import Link from "next/link";
import buildClient from "../api/build-client";

const HomePage = ({
    currentUser,
    tickets,
}: {
    currentUser: CurrentUser;
    tickets: Ticket[];
}) => {
    const ticketList = tickets.map((ticket) => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href={`/tickets/${ticket.id}`}>View</Link>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <Title size="h1" align="center" weight="300">
                Tickets
            </Title>
            <Table horizontalSpacing="xl" striped highlightOnHover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Navigate</th>
                    </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </Table>
        </div>
    );
};

// @ts-ignore
HomePage.getInitialProps = async (
    context: AppContext,
    client: AxiosInstance,
    currentUser: CurrentUser
) => {
    const { data } = await client.get("/api/tickets");
    return { tickets: data };
};

export default HomePage;
