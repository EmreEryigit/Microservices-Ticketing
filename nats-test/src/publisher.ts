import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/publishers/ticket-created-publisher";
console.clear();
const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");
    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: "123",
            title: "concert",
            price: 20,
        });
    } catch (err) {
        console.error(err);
    }

    /*     const data = JSON.stringify({
        title: 'concert',
        id: '123',
        price: 20
    })
    stan.publish('ticket:created', data, () => {
        console.log("event published");
        
    }) */
});
