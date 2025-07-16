import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("ama_questions")
export class AmaQuestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  question!: string;

  @Column()
  userId!: string;

  @Column()
  username!: string;

  @Column()
  answered!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
