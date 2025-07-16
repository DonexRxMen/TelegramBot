import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("engagement_logs")
export class EngagementLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column({ nullable: true })
  username!: string;

  @Column()
  command!: string;

  @Column({ nullable: true })
  chatId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
