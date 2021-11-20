import { Request, Response } from 'express';
import { board } from '../services/index';
import helpRemove from '../utils/helpRemove';

class Board {
    public async getAllBoards(req: Request, res: Response) {
        try {
            const sendingData = await board.getAllBoards();
            return res.send(sendingData);
        } catch (err) {
            return res.send(err);
        }
    };
    public async getBoardById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const sendingData = await board.getBoardById(id);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async createBoard(req: Request, res: Response) {
        try {
            const body = await req.body;
            const sendingData = await board.createBoard(body);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async updateBoard(req: Request, res: Response) {
        try {
            const paramsId = req.params.id;
            const body = await req.body;
            const sendingData = await board.updateBoard(paramsId, body);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async deleteBoard(req: Request, res: Response) {
        try{
            const paramsId = req.params.id;
            const sendingData = await board.deleteBoard(paramsId);
            return res.send(sendingData);
        }catch(e:any){
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);            
        }
    }
};

export const BoardController = new Board()