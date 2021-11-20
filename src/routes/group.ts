import express from 'express';
import { GroupController } from '../controllers/index';


const groupRouter = express.Router();
groupRouter
    .post("/", GroupController.createGroup)
    .get("/", GroupController.getAllGroups)
    .get("/:id", GroupController.getGroupById)
	.patch("/:id", GroupController.updateGroup)
    .delete("/:id", GroupController.deleteGroup)
export default groupRouter;