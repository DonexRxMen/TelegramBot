import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AmaQuestion } from "../entities/ama-question.entity";

@Injectable()
export class AmaService {
  constructor(
    @InjectRepository(AmaQuestion)
    private amaRepository: Repository<AmaQuestion>
  ) {}

  async saveQuestion(
    question: string,
    userId: string,
    username: string
  ): Promise<AmaQuestion> {
    const amaQuestion = this.amaRepository.create({
      question,
      userId,
      username,
    });
    return this.amaRepository.save(amaQuestion);
  }

  async getAllQuestions(page: number = 1, limit: number = 10): Promise<any> {
    const [questions, total] = await this.amaRepository.findAndCount({
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnansweredQuestions(): Promise<AmaQuestion[]> {
    return this.amaRepository.find({
      where: { answered: false },
      order: { createdAt: "DESC" },
    });
  }

  async getAnsweredQuestions(
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    const [questions, total] = await this.amaRepository.findAndCount({
      where: { answered: true },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.amaRepository.delete(id);
  }

  async markAsAnswered(id: number): Promise<void> {
    await this.amaRepository.update(id, { answered: true });
  }
}
