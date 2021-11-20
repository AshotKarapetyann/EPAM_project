import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Comment, Group, User, Activity_Log } from './';
import { ITicket } from './Interfaces';

@Entity({ name: "Ticket" })
export default class Ticket implements ITicket {
    @PrimaryGeneratedColumn()
    ticket_id!: number;

    @Column({})
    group_id!:number;

    @Column()
    user_id!:number;

    @Column({
        type:"time",
        default:"00:00:00"
    })
    ticket_complete_time!:string

    @Column({ type: "varchar" })
    ticket_name!: string;

    @Column({ nullable: true })
    ticket_description!: string;

    @Column({
        type: "varchar",
    })
    pos!:string

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Comment, comment => comment.ticket, { cascade:true, eager: true })
    comments!: Comment[];

    @ManyToOne(() => Group, group => group.tickets , {onDelete: "CASCADE"} )
    @JoinColumn({name:'group_id'})
    group!: Group;

    @ManyToOne(() => User, user => user.tickets)
    @JoinColumn({name:'user_id'})
    user!: User;

    @OneToMany(() => Activity_Log, activity_log => activity_log.ticket, { cascade:true, eager: true })
    activity_log!: Activity_Log[];
};
