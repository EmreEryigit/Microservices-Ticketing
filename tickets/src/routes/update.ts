import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from "@biletx/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import Ticket from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
    "/api/tickets/:id",
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than zero"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }
        if (ticket.userId !== req.currentUser?.id) {
            throw new NotAuthorizedError();
        }
        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();
        new TicketUpdatedPublisher(natsWrapper.client).publish(ticket);

        res.send(ticket); // sending the updated and saved version
    }
);

export { router as updateTicketRouter };