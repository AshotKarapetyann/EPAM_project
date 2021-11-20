import express from 'express';
import { CommentController } from '../controllers/index';
const commentRouter = express.Router();

commentRouter
    .post("/", CommentController.createComment)
    .get("/", CommentController.getAllComments)
    .get("/:id", CommentController.getComment)
    .patch("/:id", CommentController.updateComment)
    .delete("/:id", CommentController.deleteComment);
export default commentRouter;