import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AmaQuestion } from "./entities/ama-question.entity";
import { ContentLink } from "./entities/content-links.entity";
import { EngagementLog } from "./entities/engagement-log.entity";
import { AmaService } from "./services/ama.service";
import { ContentService } from "./services/content.service";
import { EngagementService } from "./services/engagement.service";
import { EventsService } from "./services/evnet.service";
import { TelegramBotService } from "./services/telegram/telegramBot.service";
import { SchedulerService } from "./services/telegram/sheduler.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "3306"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [AmaQuestion, ContentLink, EngagementLog, Event],
      synchronize: true, //  false in production now in dev no issue
      logging: true,
    }),
    TypeOrmModule.forFeature([AmaQuestion, ContentLink, EngagementLog, Event]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AmaService,
    ContentService,
    EngagementService,
    EventsService,
    TelegramBotService,
    SchedulerService,
  ],
})
export class AppModule {}
