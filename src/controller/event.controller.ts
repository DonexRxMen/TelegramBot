import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { EventsService } from "../services/evnet.service";
import { CreateEventDto, UpdateEventDto } from "../Dtos/event.dto";
import { AdminGuard } from "../guards/adminGuard";

@ApiTags("Events Management")
@Controller("api/events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Create new event" })
  @ApiResponse({ status: 201, description: "Event created successfully" })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    try {
      const event = await this.eventsService.createEvent(
        createEventDto.title,
        createEventDto.description,
        new Date(createEventDto.eventDate),
        createEventDto.link
      );
      return {
        success: true,
        message: "Event created successfully",
        data: event,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to create event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all events" })
  @ApiQuery({ name: "upcoming", required: false, type: "boolean" })
  @ApiQuery({ name: "page", required: false, type: "number" })
  @ApiQuery({ name: "limit", required: false, type: "number" })
  @ApiResponse({ status: 200, description: "Events retrieved successfully" })
  async getEvents(
    @Query("upcoming") upcoming?: boolean,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    try {
      if (upcoming) {
        return await this.eventsService.getUpcomingEvents(limit);
      }
      return await this.eventsService.getAllEvents(page, limit);
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve events",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("next")
  @ApiOperation({ summary: "Get next upcoming event" })
  @ApiResponse({
    status: 200,
    description: "Next event retrieved successfully",
  })
  async getNextEvent() {
    try {
      const event = await this.eventsService.getNextEvent();
      return { success: true, data: event };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve next event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update event" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Event updated successfully" })
  async updateEvent(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto
  ) {
    try {
      await this.eventsService.updateEvent(id, updateEventDto);
      return { success: true, message: "Event updated successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to update event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Delete event" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Event deleted successfully" })
  async deleteEvent(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.eventsService.deleteEvent(id);
      return { success: true, message: "Event deleted successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to delete event",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
