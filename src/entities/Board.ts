import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import {Group , User, Ticket } from ".";
import { IBoard } from "./Interfaces";


@Entity({ name: "Board" })
export default class Board implements IBoard{
    @PrimaryGeneratedColumn()
    board_id!: number;

    @Column()
    user_id!:number;

    @Column({ type: "varchar" })
    name!: string;

    @Column({type:"varchar"})
    board_image_url!:string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Group, group => group.board, { cascade:true , eager: true })
    groups!: Group[];

    @ManyToOne(() => User, user => user.boards)
    @JoinColumn({name:'user_id'}) 
    user!: User; 
};
