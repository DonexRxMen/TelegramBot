import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Telegraf, Context, Scenes } from "telegraf";
import { AmaService } from "../ama.service";
import { ContentService } from "../content.service";
import { EventsService } from "../evnet.service";
import { EngagementService } from "../engagement.service";

type MyContext = Context;

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private readonly bot: Telegraf<MyContext>;
  private readonly adminGroupId: string;
  private readonly adminUserIds: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly amaService: AmaService,
    private readonly contentService: ContentService,
    private readonly eventsService: EventsService,
    private readonly engagementService: EngagementService
  ) {
    const botToken = this.configService.get<string>("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment");
    }
    this.bot = new Telegraf<MyContext>(botToken);

    const groupId = this.configService.get<string>("ADMIN_GROUP_ID");
    if (!groupId) {
      throw new Error("ADMIN_GROUP_ID is not defined in environment");
    }
    this.adminGroupId = groupId;

    const adminIds = this.configService.get<string>("ADMIN_USER_IDS") || "";
    this.adminUserIds = adminIds.split(",").map((id) => id.trim());

    this.setupCommands();
  }

  async onModuleInit(): Promise<void> {
    await this.bot.launch();
    console.log("Telegram bot started successfully");
  }

  private setupCommands(): void {
    this.bot.command("ask", async (ctx) => {
      await this.logEngagement(ctx, "ask");

      const question = ctx.message?.text?.replace("/ask", "").trim();
      if (!question) {
        return ctx.reply(
          "Please provide a question after /ask command.\nExample: /ask What are the best supplements for muscle growth?"
        );
      }

      try {
        const savedQuestion = await this.amaService.saveQuestion(
          question,
          ctx.from.id.toString(),
          ctx.from.username ?? ""
        );

        await ctx.reply(
          "Thank you! Your question has been submitted anonymously and will be reviewed for upcoming AMA sessions."
        );

        await this.notifyAdminGroup(
          `🔔 New AMA Question:\n\n"${question}"\n\n#AMAQuestion #ID${savedQuestion.id}`
        );
      } catch (error) {
        console.error(error);
        await ctx.reply(
          "Sorry, there was an error submitting your question. Please try again later."
        );
      }
    });

    this.bot.command("videos", async (ctx) => {
      await this.logEngagement(ctx, "videos");

      try {
        const recentContent = await this.contentService.getRecentContent(3);
        if (recentContent.length === 0) {
          return ctx.reply("No recent videos available. Check back soon!");
        }

        const message =
          "🎥 Recent Videos:\n\n" +
          recentContent
            .map(
              (content, index) =>
                `${index + 1}. ${content.title}\n${content.url}\n`
            )
            .join("\n");

        await ctx.reply(message);
      } catch (error) {
        console.error(error);
        await ctx.reply(
          "Sorry, unable to fetch recent videos. Please try again later."
        );
      }
    });

    this.bot.command("events", async (ctx) => {
      await this.logEngagement(ctx, "events");

      try {
        const nextEvent = await this.eventsService.getNextEvent();
        if (!nextEvent) {
          return ctx.reply("No upcoming events scheduled. Stay tuned!");
        }

        const eventDate = new Date(nextEvent.eventDate).toLocaleDateString();
        const message =
          `🗓 Next Event: ${nextEvent.title}\n\n` +
          `📅 Date: ${eventDate}\n` +
          `📝 Description: ${nextEvent.description}\n` +
          (nextEvent.link ? `🔗 Link: ${nextEvent.link}` : "");

        await ctx.reply(message);
      } catch (error) {
        console.error(error);
        await ctx.reply(
          "Sorry, unable to fetch event information. Please try again later."
        );
      }
    });

    this.bot.command("rules", async (ctx) => {
      await this.logEngagement(ctx, "rules");

      const rules = `📋 RxMen Community Rules:

1. 🤝 Be respectful and supportive
2. 💬 Keep discussions health and wellness focused
3. 🚫 No spam or self-promotion without permission
4. 🔒 Maintain privacy - no sharing personal medical info
5. 📚 Share credible sources when providing advice
6. 🎯 Use appropriate channels for different topics
7. 👥 Help create a positive environment for all members

Questions? Contact admins or use /help for more options.`;

      await ctx.reply(rules);
    });

    this.bot.command("consult", async (ctx) => {
      await this.logEngagement(ctx, "consult");

      const message = `💊 Need Professional Consultation?

Book a personalized consultation with RxMen experts:

🔗 https://rxmen.com/consultation

Our certified professionals can help with:
- Personalized nutrition plans
- Supplement recommendations
- Fitness guidance
- Health optimization strategies

💡 For general questions, use /ask command for our AMA sessions.`;

      await ctx.reply(message);
    });

    this.bot.command("help", async (ctx) => {
      await this.logEngagement(ctx, "help");

      const helpMessage = `🤖 RxMen Bot Commands:

/ask - Submit anonymous questions for AMA sessions
/videos - Get 3 most recent video links
/events - See upcoming Rx Circle events
/rules - View community guidelines
/consult - Get consultation booking link
/help - Show this help message

🔔 The bot also sends automatic reminders for webinars and content drops.

Questions? Contact our admin team!`;

      await ctx.reply(helpMessage);
    });

    this.bot.command("admin_stats", async (ctx) => {
      if (!this.isAdmin(ctx.from.id.toString())) {
        return ctx.reply("⚠️ Admin access required.");
      }

      const stats = await this.engagementService.getEngagementStats();
      const unansweredQuestions =
        await this.amaService.getUnansweredQuestions();

      let message =
        `📊 Bot Statistics:\n\n` +
        `❓ Unanswered Questions: ${unansweredQuestions.length}\n\n` +
        `📈 Command Usage:\n`;

      stats.forEach((stat: any) => {
        message += `• /${stat.command}: ${stat.count} times\n`;
      });

      await ctx.reply(message);
    });

    this.bot.start(async (ctx) => {
      await this.logEngagement(ctx, "start");

      const welcomeMessage = `🎉 Welcome to RxMen Bot!

I'm here to help you with:
- 💬 Submitting AMA questions
- 🎥 Finding recent videos
- 📅 Event information
- 💊 Consultation booking

Type /help to see all available commands.

Join our community discussions and let's optimize your health together! 💪`;

      await ctx.reply(welcomeMessage);
    });
  }

  private async logEngagement(ctx: MyContext, command: string): Promise<void> {
    if (ctx.from && ctx.chat)
      await this.engagementService.logCommand(
        ctx.from.id.toString(),
        command,
        ctx.from.username ?? "",
        ctx.chat.id.toString()
      );
  }

  private isAdmin(userId: string): boolean {
    return this.adminUserIds.includes(userId);
  }

  private async notifyAdminGroup(message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(this.adminGroupId, message);
    } catch (error) {
      console.error("Failed to notify admin group:", error);
    }
  }

  async sendScheduledMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error("Failed to send scheduled message:", error);
    }
  }

  getBot(): Telegraf<MyContext> {
    return this.bot;
  }
}
