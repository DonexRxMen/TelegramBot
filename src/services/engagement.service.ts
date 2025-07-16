import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EngagementLog } from "../entities/engagement-log.entity";

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(EngagementLog)
    private engagementRepository: Repository<EngagementLog>
  ) {}

  async logCommand(
    userId: string,
    command: string,
    username?: string,
    chatId?: string
  ): Promise<void> {
    const log = this.engagementRepository.create({
      userId,
      command,
      username,
      chatId,
    });
    await this.engagementRepository.save(log);
  }

  async getEngagementStats(): Promise<any> {
    const stats = await this.engagementRepository
      .createQueryBuilder("log")
      .select("command, COUNT(*) as count")
      .groupBy("command")
      .orderBy("count", "DESC")
      .getRawMany();

    return stats;
  }
}
