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

  async getContent(
    type?: string,
    limit: number = 10,
    page: number = 1
  ): Promise<any> {
    const query = this.contentRepository
      .createQueryBuilder("content")
      .where("content.active = :active", { active: true })
      .orderBy("content.createdAt", "DESC");

    if (type) {
      query.andWhere("content.type = :type", { type });
    }

    query.skip((page - 1) * limit).take(limit);

    const [content, total] = await query.getManyAndCount();

    return {
      content,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateContent(id: number, updateData: any): Promise<void> {
    await this.contentRepository.update(id, updateData);
  }

  async deleteContent(id: number): Promise<void> {
    await this.contentRepository.delete(id);
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
