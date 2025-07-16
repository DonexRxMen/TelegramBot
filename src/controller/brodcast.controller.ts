import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TelegramBotService } from "../services/telegram/telegramBot.service";
import { BroadcastMessageDto } from "../Dtos/brodcast.dto";
import { AdminGuard } from "../guards/adminGuard";

@ApiTags("Broadcast")
@Controller("api/broadcast")
@UseGuards(AdminGuard)
export class BroadcastController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Post("message")
  @ApiOperation({ summary: "Broadcast message to channel/group" })
  @ApiResponse({ status: 200, description: "Message sent successfully" })
  async broadcastMessage(@Body() broadcastDto: BroadcastMessageDto) {
    try {
      await this.telegramBotService.broadcastMessage(
        broadcastDto.message,
        broadcastDto.target
      );
      return {
        success: true,
        message: `Message broadcasted to ${broadcastDto.target || "channel"}`,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to broadcast message",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
