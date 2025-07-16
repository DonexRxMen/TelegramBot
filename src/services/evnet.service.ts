import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {}

  async getNextEvent(): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: {
        active: true,
        eventDate: { $gte: new Date() } as any,
      },
      order: { eventDate: "ASC" },
    });
  }

  async createEvent(
    title: string,
    description: string,
    eventDate: Date,
    link?: string
  ): Promise<Event> {
    const event = this.eventRepository.create({
      title,
      description,
      eventDate,
      link,
    });
    return this.eventRepository.save(event);
  }
}
