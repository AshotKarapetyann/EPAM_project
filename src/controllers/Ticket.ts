import { Request, Response } from 'express';
import { ticket } from '../services/index';
import helpRemove from '../utils/helpRemove';

class Ticket {
    public async getAllTickets(req: Request, res: Response) {
        try {
            const sendingData = await ticket.getAllTickets();
            return res.send(sendingData);
        } catch (err) {
            return res.send(err);
        }
    };
    public async getTicketsById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const sendingData = await ticket.getTicketsById(id);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async createTicket(req: Request, res: Response) {
        try {
            const body = await req.body;
            const sendingData = await ticket.createTicket(body);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async updateTicket(req: Request, res: Response) {
        try {
            const body = await req.body;
            const paramsId = req.params.id;
            const sendingData = await ticket.updateTicket(paramsId, body);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async deleteTicket(req: Request, res: Response) {
        try {
            const paramsId = req.params.id;
            const sendingData = await ticket.deleteTicket(paramsId);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
};

export const TicketController = new Ticket();