import { Board, User } from '../entities/index';
import { getConnection, getRepository } from 'typeorm';
import { Request, Response } from 'express';
import JSONform from '../utils/JSONform';
import imagesList from '../public/images';

export default ({

    async getAllBoards() {
        const boards = await getRepository(Board).find();
        boards.forEach(element1 => {
            element1.groups.sort((a, b) => (a.pos).localeCompare(b.pos));
        });
        boards.forEach(element1 => {
            element1.groups.forEach(element2 => {
                element2.tickets.sort((a, b) => a.pos.localeCompare(b.pos));
            })
        });
        boards.sort( ( a, b )=> b.board_id - a.board_id);
        boards.forEach(element1 => {
            element1.groups.forEach(element2 =>{
                element2.tickets.forEach(element3 =>{
                    element3.comments.sort((a,b)=> b.comment_id - a.comment_id)
                })
            })
        });
        boards.forEach((el1) => {
            el1.groups.forEach((el2) => {
                el2.tickets.forEach((el3) => {
                    el3.activity_log.sort((a, b) => a.id - b.id)
                })
            })
        })
        if (boards.length === 0) {
            const msg: object = [];
            return JSONform.empty_data(msg);
        } else if (boards.length === 1) {
            return JSONform.valid_one_data(boards);
        } else {
            return JSONform.valid_much_data(boards);
        };
    },

    async getBoardById(id: number | string) {
        if (!Number(id)) {
            throw JSONform.bad_request();
        }
        const board = await getRepository(Board).findOne(id);
        if (board) {
            board.groups.sort((a, b) => a.pos.localeCompare(b.pos));
            board.groups.forEach(element1 => {
                element1.tickets.sort((a, b) => (a.pos).localeCompare(b.pos));
            });
            board.groups.forEach(element1 =>{
                element1.tickets.forEach(element2 =>{
                    element2.comments.sort(( a , b ) => b.comment_id - a.comment_id);
                })
            });
            board.groups.forEach((el1) => {
                    el1.tickets.forEach((el2) => {
                        el2.activity_log.sort((a, b) => a.id - b.id)
                    })
            });
            return JSONform.valid_one_data(board);
        } else {
            throw JSONform.not_found();
        }
    },

    async createBoard(body: any) {
        if(Object.entries(body).length === 0){
            throw JSONform.bad_request();
        };
        const user_id = await body.user_id;
        const msg = await body.name && body.board_image_url && user_id;
        const checkUser = await getRepository(User).find();
        const img = await body.board_image_url;
        const name = await body.name;
        if(name.trim() === ""){
            throw JSONform.empty_string();
        };
        if(name.length > 50){
            throw JSONform.wrong_characters_number();
        };
        if (!checkUser.length) {
            const newUser = getRepository(User).create();
            await getRepository(User).save(newUser);
        }
        const checkedImg = imagesList.filter(el => el === img);
        if (!checkedImg[0]) {
            throw JSONform.image_not_found();
        }
        const user = await getRepository(User).findOne(user_id);
        if (!msg) {
            throw JSONform.bad_request();
        };
        if (!user) {
            throw JSONform.invalid_user();
        };
        const newBoard = getRepository(Board).create(body);
        return await getRepository(Board).save(newBoard);
    },

    async updateBoard(paramsId: string, body: any) {
        if (isNaN(+paramsId)) {
            throw JSONform.bad_request();
        }
        const name = body.name;
        if(name.trim() === ""){
            throw JSONform.empty_string();
        };
        if(name.length > 50){
            throw JSONform.wrong_characters_number();
        };
        const img = await body.board_image_url;
        if (img) {
            const checkedImg = imagesList.filter(el => el === img);
            if (!checkedImg[0]) {
                throw JSONform.bad_request();
            }
        }
        if (await body.user_id) {
            const user = await getRepository(User).findOne(body.user_id);
            if (!user) {
                throw JSONform.invalid_user();
            };
        }
        const board = await getRepository(Board).findOne(paramsId);
        if (board) {
            getRepository(Board).merge(board, body);
            await getRepository(Board).save(board);
            return JSONform.update_data();
        } else {
            throw JSONform.not_found();
        }
    },

    async deleteBoard(paramsId: string) {
        if (isNaN(+paramsId)) {
            throw JSONform.bad_request();
        }
        const board = await getRepository(Board).findOne(paramsId);
        if (typeof board === "undefined") {
            throw JSONform.not_found();
        };
        if (board) {
            await getConnection()
                .createQueryBuilder()
                .update(Board)
                .delete()
                .where({ board_id: paramsId })
                .execute();
            return JSONform.delete_valid_data();
        };
    },

})


