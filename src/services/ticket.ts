import {Ticket, Group, User, Activity_Log} from '../entities/index';
import { getConnection, getRepository } from 'typeorm';
import JsonForm from '../utils/JSONform';
import timeValidator from '../utils/timeValidator';
import lexorankService from '../utils/Lexorank';
export default ({

    async getAllTickets() {
        const tickets = await getRepository(Ticket).find();
        tickets.sort((a, b) => (a.pos).localeCompare(b.pos));
        if (tickets.length === 0) {
            const msg: object = [];
            return JsonForm.empty_data(msg);
        } else if (tickets.length === 1) {
            return JsonForm.valid_one_data(tickets);
        } else if (tickets.length > 1) {
            return JsonForm.valid_much_data(tickets);
        };
    },

    async getTicketsById(id: string | number) {
        if (!Number(id)) {
            throw JsonForm.bad_request();
        }
        const ticket = await getRepository(Ticket).findOne(id);
        if (ticket) {
            return JsonForm.valid_one_data(ticket);
        } else {
            throw JsonForm.not_found();
        }
    },

    async createTicket(body: any) {
        const msg = await body.user_id && await body.group_id && await body.ticket_name;
        if (!msg) {
            throw JsonForm.bad_request();
        };
        const group = await getRepository(Group).findOne(body.group_id);
        const user = await getRepository(User).findOne(body.user_id);
        if (!user) {
            throw JsonForm.invalid_user();
        };
        if (!group) {
            throw JsonForm.not_found();
        };
        if (await body.ticket_name) {
            const name = body.ticket_name;
            if (name.trim() === '') {
                throw JsonForm.empty_string();
            }
        }
        const tickets = await getRepository(Ticket).find();
        if (tickets.length === 0) {
            var [pos, needToRebalance] = lexorankService.getNextRank("", "");
        };
        if (tickets.length > 0) {
            tickets.sort((a, b) => (a.pos).localeCompare(b.pos));
            const prevPos = tickets[tickets.length - 1].pos;
            var [pos, needToRebalance] = lexorankService.getNextRank(prevPos, "");
        };
        const newTicket = {
            ...body,
            pos: pos
        };
        getRepository(Ticket).create(newTicket);
        await getRepository(Ticket).save(newTicket);
        const newticket = await getRepository(Ticket).find();
        newticket.sort((a, b) => (a.pos).localeCompare(b.pos));
        return newticket[newticket.length - 1]
    },

    async updateTicket(paramsId: string, body: any) {
        if (!Number(paramsId)) {
            throw JsonForm.bad_request();
        };
        if (body.group_id) {
            const group_id = await body.group_id;
            const changeGroup = await getRepository(Group).findOne(group_id);
            if (!changeGroup) {
                throw JsonForm.not_found();
            };
            const ticket = await getRepository(Ticket).findOne(paramsId)
            if(ticket?.group_id !== body.group_id) {
              const oldGroup = await getRepository(Group).findOne(ticket?.group_id);
              const newGroup =  await getRepository(Group).findOne(body.group_id);

              const newActivityLog = {
                  ticket_id: +paramsId,
                  current_list: newGroup?.group_name,
                  prev_list: oldGroup?.group_name
              }
                await getRepository(Activity_Log).create(newActivityLog);
                await getRepository(Activity_Log).save(newActivityLog);
            }
        };


        const prevPos = await body.prevPos;
        const nextPos = await body.nextPos;
        if (prevPos || nextPos) {
            if (prevPos !== "") {
                const prev = await getRepository(Ticket).find({ where: [{ pos: prevPos }] });
                if (prev.length === 0) {
                    throw JsonForm.not_found();
                }
            };
            if (nextPos !== "") {
                const next = await getRepository(Ticket).find({ where: [{ pos: nextPos }] });
                if (next.length === 0) {
                    throw JsonForm.not_found();
                }
            };
            if(prevPos === nextPos){
                throw JsonForm.position_error();
            }

            const [pos, needToRebalance] = lexorankService.getNextRank(prevPos, nextPos);
            if (needToRebalance) {
                await this.rebalance();
            }
            const newTicket = {
                ...body,
                pos: pos
            };
            const ticket = await getRepository(Ticket).findOne(paramsId);
            if (ticket) {
                const newticket = getRepository(Ticket).merge(ticket, newTicket);
                return  await getRepository(Ticket).save(newticket);
            } else {
                throw JsonForm.not_found();
            }
        };
        if(prevPos === '' && nextPos === ''){
            throw JsonForm.bad_request();
        };
        if (await body.user_id) {
            const user = await getRepository(User).findOne(body.user_id);
            if (!user) {
                throw JsonForm.invalid_user();
            }
        }
        if(await body.ticket_name || await body.ticket_name === ''){
            const name = body.ticket_name;
            if(name.trim() === ''){
                throw JsonForm.empty_string();
            }
        }
        if(await body.ticket_name === null){
            throw JsonForm.bad_request();
        }
        if(await body.ticket_complete_time){
            const time = await body.ticket_complete_time;
            if (!(await timeValidator(time))) {
                throw JsonForm.bad_request();
            };
        };
        if(await body.ticket_description || await body.ticket_description === ''){
            const description = body.ticket_description;
            if (description.trim() === '') {
                throw JsonForm.bad_request();
            };
        };
        const newTicket = {
            ...body
        };
        const ticket = await getRepository(Ticket).findOne(paramsId);
        if (ticket) {
            const newticket = getRepository(Ticket).merge(ticket, newTicket);
           return  await getRepository(Ticket).save(newticket);
        } else {
            throw JsonForm.not_found();
        }
    },

    async deleteTicket(paramsId: string) {
        if (isNaN(+paramsId)) {
            throw JsonForm.bad_request();
        }
        const ticket = await getRepository(Ticket).findOne(paramsId);
        if (typeof ticket === "undefined") {
            throw JsonForm.not_found();
        };
        if (ticket) {
            await getConnection().
                createQueryBuilder().
                update(Ticket).delete().
                where({ ticket_id: paramsId }).
                execute();
            return JsonForm.delete_valid_data();
        };
    },

    async rebalance() {
        try {
            const groups = await getRepository(Group).find();
            groups.sort((a, b) => (a.pos).localeCompare(b.pos));
            let position: any = null;
            const newGroups = groups.map(group => {
                position = lexorankService.rebalancingRank(position);
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



