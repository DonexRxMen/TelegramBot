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

  async getAllEvents(page: number = 1, limit: number = 10): Promise<any> {
    const [events, total] = await this.eventRepository.findAndCount({
      where: { active: true },
      order: { eventDate: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUpcomingEvents(limit: number = 10): Promise<any> {
    const events = await this.eventRepository.find({
      where: {
        active: true,
        eventDate: { $gte: new Date() } as any,
      },
      order: { eventDate: "ASC" },
      take: limit,
    });

    return { events };
  }

  async updateEvent(id: number, updateData: any): Promise<void> {
    if (updateData.eventDate) {
      updateData.eventDate = new Date(updateData.eventDate);
    }
    const result = await this.eventRepository.update(id, updateData);
    if (result.affected === 0) {
      throw new Error("Event not found");
    }
  }

  async deleteEvent(id: number): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new Error("Event not found");
    }
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
