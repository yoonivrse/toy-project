import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true })
    email:string;

    @Column({ nullable: true })
    password: string;

    @Column()
    username: string;

    @Column({ nullable: true })
    providerId: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createdDt: Date;
      
}