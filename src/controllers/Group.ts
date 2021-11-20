import { Request, Response } from 'express';
import { group } from '../services/index';
import helpRemove from '../utils/helpRemove';

class Group {
    public async getAllGroups(req: Request, res: Response) {
        try{
            const sendingData = await group.getAllGroups();
            return res.send(sendingData);
        }catch(e:any){
            return res.send(e)
        }
    };
    public async getGroupById(req: Request, res: Response) {
        try{
            const paramsId = req.params.id;
            const sendingData = await group.getGroupById(paramsId);
            return res.send(sendingData);
        }catch(e:any){
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async createGroup(req: Request, res: Response) {
        try{
            const body = await req.body;
            const sendingData = await group.createGroup(body);
            return res.send(sendingData);
        }catch(e:any){
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async updateGroup(req: Request, res: Response) {
        try{
            const paramsId = req.params.id;
            const body = await req.body;
            const sendingData  = await group.updateGroup(paramsId, body);
            return res.send(sendingData);
        }catch(e:any){
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    };
    public async deleteGroup(req: Request, res: Response) {
        try{
            const paramsId = req.params.id;
            const sendingData = await group.deleteGroup(paramsId);
            return res.send(sendingData);
        }catch(e:any){
            const sendingError = await helpRemove(e);
            return res.status(sendingError.code).send(sendingError.result);
        }
    }
};

export const GroupController = new Group()