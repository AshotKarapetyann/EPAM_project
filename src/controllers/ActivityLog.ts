import { Request, Response } from 'express';
import { log } from '../services/index';
import helpRemove from '../utils/helpRemove';

class Log {
	public async getLogs(req: Request, res: Response) {
		try{
			const sendingData = await log.getLogs();
			return res.send(sendingData);
		}catch(err){
			return res.send(err);
		}

	};
	public async createLog(req: Request, res: Response) {
		try{
			const body = await req.body;
			const sendingData = await log.createLog(body);
			return res.send(sendingData);
		}catch(e:any){
			const sendingError = await helpRemove(e);
			return res.status(sendingError.code).send(sendingError.result);
		}
	};
};

export const LogController = new Log();