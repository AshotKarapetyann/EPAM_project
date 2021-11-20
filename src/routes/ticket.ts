import express from 'express';
import { TicketController } from '../controllers/index';
const ticketRouter = express.Router();

ticketRouter
    .post("/", TicketController.createTicket)
    .get("/", TicketController.getAllTickets)
    .get("/:id", TicketController.getTicketsById)
    .patch("/:id", TicketController.updateTicket)
    .delete("/:id", TicketController.deleteTicket);
export default ticketRouter;