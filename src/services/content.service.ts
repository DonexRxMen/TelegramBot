import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContentLink } from "../entities/content-links.entity";

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentLink)
    private contentRepository: Repository<ContentLink>
  ) {}

  async getRecentContent(limit: number = 3): Promise<ContentLink[]> {
    return this.contentRepository.find({
      where: { active: true },
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  async addContent(
    title: string,
    url: string,
    type: string = "video"
  ): Promise<ContentLink> {
    const content = this.contentRepository.create({ title, url, type });
    return this.contentRepository.save(content);
  }
}
