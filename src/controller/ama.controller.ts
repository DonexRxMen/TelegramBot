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
import { AmaService } from "../services/ama.service";
import { CreateAmaQuestionDto, UpdateAmaQuestionDto } from "../Dtos/amo.dto";
import { AdminGuard } from "../guards/adminGuard";

@ApiTags("AMA Questions")
@Controller("api/ama")
export class AmaController {
  constructor(private readonly amaService: AmaService) {}

  @Post("questions")
  @ApiOperation({ summary: "Submit a new AMA question" })
  @ApiResponse({ status: 201, description: "Question submitted successfully" })
  async createQuestion(@Body() createAmaQuestionDto: CreateAmaQuestionDto) {
    try {
      const question = await this.amaService.saveQuestion(
        createAmaQuestionDto.question,
        createAmaQuestionDto.userId,
        createAmaQuestionDto.username
      );
      return {
        success: true,
        message: "Question submitted successfully",
        data: question,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to submit question",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("questions")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all AMA questions" })
  @ApiQuery({ name: "answered", required: false, type: "boolean" })
  @ApiQuery({ name: "page", required: false, type: "number" })
  @ApiQuery({ name: "limit", required: false, type: "number" })
  @ApiResponse({ status: 200, description: "Questions retrieved successfully" })
  async getQuestions(
    @Query("answered") answered?: boolean,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ): Promise<any> {
    try {
      if (answered !== undefined) {
        if (answered) {
          return await this.amaService.getAnsweredQuestions(page, limit);
        } else {
          return await this.amaService.getUnansweredQuestions();
        }
      }
      return await this.amaService.getAllQuestions(page, limit);
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve questions",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("questions/unanswered")
  //   @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get unanswered AMA questions" })
  @ApiResponse({
    status: 200,
    description: "Unanswered questions retrieved successfully",
  })
  async getUnansweredQuestions() {
    try {
      return await this.amaService.getUnansweredQuestions();
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve unanswered questions",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put("questions/:id")
  //   @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update AMA question status" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Question updated successfully" })
  async updateQuestion(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAmaQuestionDto: UpdateAmaQuestionDto
  ) {
    try {
      if (updateAmaQuestionDto.answered) {
        await this.amaService.markAsAnswered(id);
      }
      return { success: true, message: "Question updated successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to update question",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete("questions/:id")
  //   @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Delete AMA question" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Question deleted successfully" })
  async deleteQuestion(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.amaService.deleteQuestion(id);
      return { success: true, message: "Question deleted successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to delete question",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
