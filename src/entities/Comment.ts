import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Ticket, User} from "./";
import { IComment } from "./Interfaces";

@Entity({ name: "Comment" })
export default class Comment implements IComment {
    @PrimaryGeneratedColumn()
    comment_id!: number;

    @Column()
    ticket_id!:number;

    @Column()
    user_id!:number;

    @Column({ default: "" })
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Ticket, ticket => ticket.comments, { onDelete: "CASCADE", eager: false })
    @JoinColumn({name:'ticket_id'})
    ticket!: Ticket;
    
    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({name:'user_id'})
    user!: User;
};

