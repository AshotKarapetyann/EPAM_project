import express from 'express';
import { BoardController } from '../controllers/index';
const boardRouter = express.Router();

boardRouter
    .post("/", BoardController.createBoard)
    .get("/", BoardController.getAllBoards)
    .get("/:id", BoardController.getBoardById)
    .patch("/:id", BoardController.updateBoard)
    .delete("/:id", BoardController.deleteBoard)
export default boardRouter;
