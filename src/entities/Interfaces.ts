import { Group, User, Ticket, Board} from ".";




export interface IBoard{
    board_id:number,
    name:string,
    createdAt:Date,
    groups:Group[],
    user:User
};

export interface IComment {
    comment_id:number,
    content:string,
    createdAt:Date,
    ticket:Ticket,
    user:User
};

export interface IGroup {
    group_id:number,
    group_name:string,
    createdAt:Date,
    tickets:Ticket[],
    board:Board,
    pos:string,
    user:User
};

export interface ITicket {
    ticket_id:number,
    ticket_name:string,
    ticket_description:string,
    createdAt:Date,
    comments:object,
    group:Group,
    pos:string,
    user:User
};

export interface IUser {
    user_id:number,
    first_name:string,
    last_name:string,
    email:string,
    phone_number:number,
    comments:object,
    tickets:object,
    boards:object,
    groups:object
};

export interface IActivity_Log {
    id:number,
    current_list:string,
    prev_list:string,
    createdAt:Date,
    ticket_id:number,
    ticket:Ticket
};
