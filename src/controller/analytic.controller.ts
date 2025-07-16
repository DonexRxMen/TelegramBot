import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { EngagementService } from "../services/engagement.service";
// import { AdminGuard } from '../guards/admin.guard';

@ApiTags("Analytics")
@Controller("api/analytics")
// @UseGuards(AdminGuard)
export class AnalyticsController {
  constructor(private readonly engagementService: EngagementService) {}

  @Get("engagement")
  @ApiOperation({ summary: "Get engagement statistics" })
  @ApiQuery({ name: "days", required: false, type: "number" })
  @ApiResponse({
    status: 200,
    description: "Engagement stats retrieved successfully",
  })
  async getEngagementStats(@Query("days") days: number = 30) {
    try {
      const stats = await this.engagementService.getEngagementStats(days);
      return { success: true, data: stats };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve engagement stats",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("commands")
  @ApiOperation({ summary: "Get command usage statistics" })
  @ApiQuery({ name: "days", required: false, type: "number" })
  @ApiResponse({
    status: 200,
    description: "Command stats retrieved successfully",
  })
  async getCommandStats(@Query("days") days: number = 30) {
    try {
      const stats = await this.engagementService.getCommandStats(days);
      return { success: true, data: stats };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve command stats",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("users")
  @ApiOperation({ summary: "Get user activity statistics" })
  @ApiQuery({ name: "days", required: false, type: "number" })
  @ApiResponse({
    status: 200,
    description: "User stats retrieved successfully",
  })
  async getUserStats(@Query("days") days: number = 30) {
    try {
      const stats = await this.engagementService.getUserStats(days);
      return { success: true, data: stats };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve user stats",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard overview" })
  @ApiResponse({
    status: 200,
    description: "Dashboard data retrieved successfully",
  })
  async getDashboardData() {
    try {
      const data = await this.engagementService.getDashboardData();
      return { success: true, data };
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve dashboard data",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
