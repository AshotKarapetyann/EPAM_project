import { Activity_Log, Group, Ticket } from '../entities/index';
import { getRepository, } from 'typeorm';
import JSONform from '../utils/JSONform';

export default ({

	async getLogs() {
		const logs = await getRepository(Activity_Log).find();
		if (logs.length === 0) {
			const msg: object = [];
			return JSONform.empty_data(msg);
		} else if (logs.length === 1) {
			return JSONform.valid_one_data(logs);
		} else {
			return JSONform.valid_much_data(logs);
		}
	},

	async createLog(body:any) {
		const ticket_id = await body.ticket_id;
		const current_list = await body.current_list;
		const prev_list = await body.prev_list;
		if(ticket_id === null){
		        throw JSONform.bad_request();
		};
		if (!ticket_id) {
			throw JSONform.bad_request();
		};
		const ticket = await getRepository(Ticket).findOne(ticket_id);
		if(!ticket){
			throw JSONform.not_found();
		};
		if (!current_list) {
			throw JSONform.bad_request();
		};
		const newGroup = await getRepository(Group).find({where: [{group_name: current_list}]});
		if(newGroup.length === 0){
			throw JSONform.not_found();
		};
		const oldGroup = await getRepository(Group).find({where: [{group_name: prev_list}]});
		if(oldGroup.length === 0){
			throw JSONform.not_found();
		}
		const newActivityLog = getRepository(Activity_Log).create(body);
		return await getRepository(Activity_Log).save(newActivityLog);
	},

})


