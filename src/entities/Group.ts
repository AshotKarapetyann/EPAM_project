import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Board, User, Ticket} from "./";
import { IGroup } from "./Interfaces";

@Entity({ name: "Group" })
export default class Group implements IGroup{
    @PrimaryGeneratedColumn()
    group_id!: number;

    @Column()
    board_id!:number;

    @Column()
    user_id!:number;

    @Column({ type: "varchar" })
    group_name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({
        type: "varchar",
    })
    pos!:string

    @OneToMany(() => Ticket, ticket => ticket.group, { cascade:true, eager: true })
    tickets!: Ticket[];

    @ManyToOne(() => Board, board => board.groups,{ onDelete: "CASCADE", eager: false })
    @JoinColumn({name:'board_id'})
    board!: Board;

    @ManyToOne(() => User, user => user.groups)
    @JoinColumn({name:'user_id'})
    user!: User;
};