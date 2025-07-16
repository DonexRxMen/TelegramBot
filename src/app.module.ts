import { Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";

// Entities
import { AmaQuestion } from "./entities/ama-question.entity";
import { ContentLink } from "./entities/content-links.entity";
import { EngagementLog } from "./entities/engagement-log.entity";
import { Event } from "./entities/event.entity";

// Services
import { AmaService } from "./services/ama.service";
import { ContentService } from "./services/content.service";

import { EngagementService } from "./services/engagement.service";
import { EventsService } from "./services/evnet.service";
import { TelegramBotService } from "./services/telegram/telegramBot.service";
import { SchedulerService } from "./services/sheduler.service";

// Controllers

import { AmaController } from "./controller/ama.controller";
import { ContentController } from "./controller/content.controller";
import { EventsController } from "./controller/event.controller";
import { AnalyticsController } from "./controller/analytic.controller";
import { BroadcastController } from "./controller/brodcast.controller";

// Guards
// import { AdminGuard } from "./guards/admin.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "3044"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [AmaQuestion, ContentLink, EngagementLog, Event],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([AmaQuestion, ContentLink, EngagementLog, Event]),
  ],
  controllers: [
    AmaController,
    ContentController,
    EventsController,
    AnalyticsController,
    BroadcastController,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AmaService,
    ContentService,
    EventsService,
    EngagementService,
    TelegramBotService,
    SchedulerService,
    // AdminGuard,
  ],
})
export class AppModule {}
