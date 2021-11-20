import express from 'express';
import { LogController} from '../controllers/index';
const activityLogRouter = express.Router();

activityLogRouter
	.post("/", LogController.createLog)
	.get("/", LogController.getLogs)

export default activityLogRouter;