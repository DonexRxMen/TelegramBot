import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { TelegramBotService } from "./telegram/telegramBot.service";
import { EventsService } from "./evnet.service";

@Injectable()
export class SchedulerService {
  constructor(
    private configService: ConfigService,
    private telegramBotService: TelegramBotService,
    private eventsService: EventsService
  ) {}

  // Weekly webinar reminder (every Monday at 10 AM)
  @Cron("0 10 * * 1")
  async sendWeeklyWebinarReminder() {
    const channelId = this.configService.get("RXMEN_CHANNEL_ID");
    const nextEvent = await this.eventsService.getNextEvent();

    if (nextEvent) {
      const message = `🔔 Weekly Reminder: Rx Circle Webinar

📅 Next Session: ${new Date(nextEvent.eventDate).toLocaleDateString()}
🎯 Topic: ${nextEvent.title}

${nextEvent.description}

${nextEvent.link ? `🔗 Join here: ${nextEvent.link}` : ""}

Don't miss out on expert insights! 💊⚡`;

      await this.telegramBotService.sendScheduledMessage(channelId, message);
    }
  }

  // Weekly engagement poll (every Wednesday at 3 PM)
  @Cron("0 15 * * 3")
  async sendWeeklyPoll() {
    const loungeId = this.configService.get("MENS_HEALTH_LOUNGE_ID");

    const pollMessage = `📊 Weekly Check-in Poll!

How's your health journey going this week?

React with:
💪 - Crushing it!
📈 - Making progress
😴 - Need motivation
🤔 - Have questions

Share your wins and challenges below! 👇`;

    await this.telegramBotService.sendScheduledMessage(loungeId, pollMessage);
  }

  // Content drop reminder (every Friday at 6 PM)
  @Cron("0 18 * * 5")
  async sendContentDropReminder() {
    const channelId = this.configService.get("RXMEN_CHANNEL_ID");

    const message = `🎬 Fresh Content Alert!

New videos and resources are live on RxMen!

Use /videos command to see the latest content.

Weekend learning mode: ON 🧠✨`;

    await this.telegramBotService.sendScheduledMessage(channelId, message);
  }
}
