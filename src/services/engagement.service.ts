import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, MoreThanOrEqual } from "typeorm";
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

  async getEngagementStats(days: number = 30): Promise<any> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const totalLogs = await this.engagementRepository.count({
      where: {
        createdAt: MoreThanOrEqual(since),
      },
    });

    const uniqueUsers = await this.engagementRepository
      .createQueryBuilder("log")
      .select("COUNT(DISTINCT log.userId)", "count")
      .where("log.createdAt >= :since", { since })
      .getRawOne();

    return {
      totalLogs,
      uniqueUsers: parseInt(uniqueUsers.count, 10) || 0,
      since,
    };
  }

  async getCommandStats(days: number = 30): Promise<any> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await this.engagementRepository
      .createQueryBuilder("log")
      .select("log.command", "command")
      .addSelect("COUNT(*)", "count")
      .where("log.createdAt >= :since", { since })
      .groupBy("log.command")
      .orderBy("count", "DESC")
      .getRawMany();

    return stats;
  }

  async getUserStats(days: number = 30): Promise<any> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await this.engagementRepository
      .createQueryBuilder("log")
      .select("log.userId", "userId")
      .addSelect("COUNT(*)", "count")
      .where("log.createdAt >= :since", { since })
      .groupBy("log.userId")
      .orderBy("count", "DESC")
      .getRawMany();

    return stats;
  }

  async getDashboardData(): Promise<any> {
    const [totalCommands, uniqueUsers, recentCommands] = await Promise.all([
      this.engagementRepository.count(),
      this.engagementRepository
        .createQueryBuilder("log")
        .select("COUNT(DISTINCT log.userId)", "count")
        .getRawOne(),
      this.engagementRepository
        .createQueryBuilder("log")
        .select("log.command", "command")
        .addSelect("COUNT(*)", "count")
        .groupBy("log.command")
        .orderBy("count", "DESC")
        .limit(5)
        .getRawMany(),
    ]);

    return {
      totalCommands,
      uniqueUsers: parseInt(uniqueUsers.count, 10) || 0,
      topCommands: recentCommands,
    };
  }
}
