import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import { Ticket } from ".";
import { IActivity_Log } from "./Interfaces";


@Entity({ name: "Activity_Log" })
export default class Activity_Log implements IActivity_Log {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ticket_id!:number;

    @Column({ type: "varchar" })
    current_list!: string;

    @Column({ type: "varchar" })
    prev_list!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Ticket, ticket => ticket.activity_log, { onDelete: "CASCADE", eager: false })
    @JoinColumn({name:'ticket_id'})
    ticket!: Ticket;
};
