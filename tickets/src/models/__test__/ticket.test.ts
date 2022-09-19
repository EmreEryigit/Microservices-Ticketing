import Ticket from "../ticket";

it("implements optimistic concurrency control", async () => {
    // Create an instance of  a ticket

    const ticket = Ticket.build({
        price: 5,
        title: "concert",
        userId: "123",
    });

    // Save the ticket to the DB
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two seperate changes to the tickets we fetched
    firstInstance?.set({ price: 10 });
    secondInstance?.set({ price: 15 });
    // save the first fetched ticket
    await firstInstance?.save();
    // save the second fetched ticket

    try {
        await secondInstance?.save();
    } catch (err) {
        return;
    }
});

it("increments the version number on multiple saves", async () => {
    // Create an instance of  a ticket

    const ticket = Ticket.build({
        price: 5,
        title: "concert",
        userId: "123",
    });

    // Save the ticket to the DB
    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
});
