import { comment } from "../services/index";
import { Request, Response } from 'express';
import helpRemove from "../utils/helpRemove";

class Comment {
    public async getAllComments(req: Request, res: Response) {
        try {
            const sendingData = await comment.getComments();
            return res.send(sendingData);
        } catch (err) {
            return res.send(err);
        }
    };
    public async getComment(req: Request, res: Response) {
        try {
            const paramsId = req.params.id;
            const sendingData = await comment.getCommentById(paramsId);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async createComment(req: Request, res: Response) {
        try {
            const body = await req.body;
            const sendingData = await comment.createComments(body);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async updateComment(req: Request, res: Response) {
        try {
            const body = await req.body;
            const paramsId = req.params.id;
            const sendingData = await comment.updateComment(paramsId, body);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async deleteComment(req: Request, res: Response) {
        try {
            const paramsId = req.params.id;
            const sendingData = await comment.deleteComment(paramsId);
            return res.send(sendingData);
        } catch (e: any) {
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    }
}

export const CommentController = new Comment();