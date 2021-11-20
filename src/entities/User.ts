import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Comment, Ticket, Group, Board } from './';
import { IUser } from "./Interfaces";

@Entity({ name: "User" })
export default class User implements IUser{
    @PrimaryColumn({default: 1})
    user_id!: number;

    @Column({ type: "varchar", default: "John" })
    first_name!: string;

    @Column({ type: "varchar", default: "Doe" })
    last_name!: string;

    @Column({ unique: true, default: "john.doe1977@gmail.com" })
    email!: string;

    @Column({ default: "374777777" })
    phone_number!: number;

    @OneToMany(() => Comment, comment => comment.user)
    comments!: Comment[];

    @OneToMany(() => Ticket, tickets => tickets.user)
    tickets!: Ticket[];

    @OneToMany(() => Board, board => board.user)
    boards!: Board[];

    @OneToMany(() => Group, group => group.user)
    groups!: Group[];
};