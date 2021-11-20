import { getConnection, getRepository } from "typeorm";
import { Comment, Ticket, User } from "../entities/index";
import JSONform from "../utils/JSONform";

export default ({

    async getComments() {
        const comments = await getRepository(Comment).find();
        if (comments.length === 0) {
            const msg: object = [];
            return JSONform.empty_data(msg);
        } else if (comments.length === 1) {
            return JSONform.valid_one_data(comments);
        } else {
            return JSONform.valid_much_data(comments);
        }
    },

    async getCommentById(paramsId:string) {
        if (!Number(paramsId)) {
            throw JSONform.bad_request();
        }
        const comment = await getRepository(Comment).findOne(paramsId);
        if (!comment) {
            throw JSONform.not_found();
        }
        return JSONform.valid_one_data(comment);
    },

    async createComments(body:any) {
        if(!body.ticket_id){
            throw JSONform.bad_request();
        }
        if(!body.user_id){
            throw JSONform.invalid_user();
        }
        const ticket = await getRepository(Ticket).findOne(body.ticket_id);
        const user = await getRepository(User).findOne(body.user_id);
        if(!body.content){
            throw JSONform.bad_request();
        }
        if (!user) {
            throw JSONform.invalid_user();
        };
        if (!ticket) {
            throw JSONform.not_found();
        }
        if (body.ticket_id === null || undefined) {
            throw JSONform.bad_request();
        }
        const newComment = getRepository(Comment).create(body);
        return await getRepository(Comment).save(newComment);
    },

    async updateComment(paramsId:string, body:any) {
        if (!Number(paramsId)) {
            throw JSONform.bad_request();
        }
        if (await body.user_id) {
            const user = await getRepository(User).findOne(body.user_id);
            if (!user) {
                throw JSONform.invalid_user();
            }
        }
        const ticket = await getRepository(Ticket).findOne(body.ticket_id);
        if(!ticket){
            throw JSONform.not_found();
        }
        const comment = await getRepository(Comment).findOne(paramsId);
        if (comment) {
            getRepository(Comment).merge(comment, body);
            await getRepository(Comment).save(comment);
            return JSONform.update_data();
        } else {
            throw JSONform.not_found();
        }
    },

    async deleteComment(paramsId:string) {
        if (isNaN(+paramsId)) {
            throw JSONform.bad_request();
        }
        const comment = await getRepository(Comment).findOne(paramsId);
        if (typeof comment === "undefined") {
            throw JSONform.not_found();
        } else if (comment) {
            await getConnection().createQueryBuilder().update(Comment).delete().where({ comment_id: paramsId }).execute();
            return JSONform.delete_valid_data();
        }
    }

});

