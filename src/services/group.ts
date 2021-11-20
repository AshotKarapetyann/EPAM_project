import { Group, Board, User } from '../entities/index';
import { getConnection, getRepository, } from 'typeorm';
import JSONform from '../utils/JSONform';
import lexoRankService from '../utils/Lexorank';

export default ({

    async getAllGroups() {
        const groups = await getRepository(Group).find();
        const boards = await getRepository(Board).find();
        boards.forEach(element1 => {
            element1.groups.sort((a, b) => (a.pos).localeCompare(b.pos));
        });
        groups.sort((a, b) => (a.pos).localeCompare(b.pos));
        groups.forEach(element1 => {
            element1.tickets.sort((a, b) => (a.pos).localeCompare(b.pos));
        });
        if (groups.length === 0) {
            const msg: object = [];
            return JSONform.empty_data(msg);
        } else if (groups.length === 1) {
            return JSONform.valid_one_data(groups);
        } else {
            return JSONform.valid_much_data(groups);
        };
    },

    async getGroupById(paramsId: string) {
        if (!Number(paramsId)) {
            throw JSONform.bad_request();
        };
        const group = await getRepository(Group).findOne(paramsId);
        if (group) {
            group.tickets.sort((a, b) => (a.pos).localeCompare(b.pos));
            return JSONform.valid_one_data(group);
        } else {
            throw JSONform.not_found();
        };
    },

    async createGroup(body: any) {
        const msg = await body.group_name && body.board_id && body.user_id;
        const board = await getRepository(Board).findOne(body.board_id);
        const user_id = await body.user_id;
        if (body.group_name) {
            const name = body.group_name;
            if (name.trim() === '') {
                throw JSONform.empty_string();
            };
            if (name.length > 512) {
                throw JSONform.wrong_characters_number();
            };
        }
        const user = await getRepository(User).findOne(user_id)
        if (!user) {
            throw JSONform.invalid_user();
        };
        if (!board) {
            throw JSONform.not_found();
        };
        if (!msg) {
            throw JSONform.bad_request();
        };
        const groups = await getRepository(Group).find();
        if (groups.length === 0) {
            const [pos, needToRebalance] = lexoRankService.getNextRank("", "");
            const newGroup = {
                ...body,
                pos: pos
            };
            getRepository(Group).create(newGroup);
            return await getRepository(Group).save(newGroup);
        };
        if (groups.length > 0) {
            groups.sort((a, b) => (a.pos).localeCompare(b.pos));
            const prevPos = groups[groups.length - 1].pos;
            const [pos, needToRebalance] = lexoRankService.getNextRank(prevPos, "");
            const newGroup = {
                ...body,
                pos: pos
            };
            getRepository(Group).create(newGroup);
            return await getRepository(Group).save(newGroup);
        }
    },
    async updateGroup(paramsId: string, body: any) {
        if (!Number(paramsId)) {
            throw JSONform.bad_request();
        };

        if (await body.board_id) {
            const board = await getRepository(Board).findOne(body.board_id);
            if (!board) {
                throw JSONform.not_found();
            };
        };
        if (await body.group_name || await body.group_name === '') {
            const name = body.group_name;
            if (name.trim() === '') {
                throw JSONform.empty_string();
            };
             if (name.length > 512) {
                throw JSONform.wrong_characters_number();
            };
        }
        const prevPos = await body.prevPos;
        const nextPos = await body.nextPos;
        if (prevPos && nextPos) {
            if (prevPos !== "") {
                const prev = await getRepository(Group).find({ where: [{ pos: prevPos }] });
                if (prev.length === 0) {
                    throw JSONform.not_found();
                }
            };
            if (nextPos !== "") {
                const next = await getRepository(Group).find({ where: [{ pos: nextPos }] });
                if (next.length === 0) {
                    throw JSONform.not_found();
                }
            };
            if (prevPos === nextPos) {
                throw JSONform.position_error();
            };
        };
        if (prevPos === '' && nextPos === '') {
            throw JSONform.bad_request();
        };
        if (await body.user_id) {
            const user = await getRepository(User).findOne(body.user_id);
            if (!user) {
                throw JSONform.invalid_user();
            }
        };
        const [pos, needToRebalance] = lexoRankService.getNextRank(prevPos, nextPos);
        if (needToRebalance) {
            await this.rebalance();
        }
        const newGroup = {
            ...body,
            pos: pos
        };
        const group = await getRepository(Group).findOne(paramsId);
        if (group) {
            getRepository(Group).merge(group, newGroup);
            await getRepository(Group).save(group);

            return { pos: group.pos };
        } else {
            throw JSONform.not_found();
        };
    },

    async deleteGroup(paramsId: string) {
        if (isNaN(+paramsId)) {
            throw JSONform.bad_request();
        };
        const group = await getRepository(Group).findOne(paramsId);
        if (typeof group === "undefined") {
            throw JSONform.not_found();
        };
        if (group) {
            await getConnection()
                .createQueryBuilder()
                .update(Group)
                .delete()
                .where({ group_id: paramsId })
                .execute();
            return JSONform.delete_valid_data();
        };
    },
    async rebalance() {
        try {
            const groups = await getRepository(Group).find();
            groups.sort((a, b) => (a.pos).localeCompare(b.pos));
            let position: any = null;
            const newGroups = groups.map(group => {
                position = lexoRankService.rebalancingRank(position);
                group.pos = position;
                return group;
            })
            await Promise.all(newGroups.map(async newGroup => {
                const oldGroup = (await getRepository(Group).find({ where: [{ group_id: newGroup.group_id }] }))[0];
                getRepository(Group).merge(oldGroup, newGroup);
                getRepository(Group).save(oldGroup);
            }))
        } catch (err) {
            throw new Error().message;
        }
    },
});


