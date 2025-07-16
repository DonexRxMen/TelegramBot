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
    userId?: string,
    username?: string
  ): Promise<AmaQuestion> {
    const amaQuestion = this.amaRepository.create({
      question,
      userId,
      username,
    });
    return this.amaRepository.save(amaQuestion);
  }

  async getUnansweredQuestions(): Promise<AmaQuestion[]> {
    return this.amaRepository.find({
      where: { answered: false },
      order: { createdAt: "DESC" },
    });
  }

  async markAsAnswered(id: number): Promise<void> {
    await this.amaRepository.update(id, { answered: true });
  }
}
