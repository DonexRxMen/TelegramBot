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
import { ContentService } from "../services/content.service";
import { CreateContentDto, UpdateContentDto } from "../Dtos/content.dto";
import { AdminGuard } from "../guards/adminGuard";

@ApiTags("Content Management")
@Controller("api/content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Add new content" })
  @ApiResponse({ status: 201, description: "Content created successfully" })
  async createContent(@Body() createContentDto: CreateContentDto) {
    try {
      const content = await this.contentService.addContent(
        createContentDto.title,
        createContentDto.url,
        createContentDto.type
      );
      return {
        success: true,
        message: "Content created successfully",
        data: content,
      };
    } catch (error) {
      throw new HttpException(
        "Failed to create content",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: "Get content list" })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["video", "article", "webinar", "other"],
  })
  @ApiQuery({ name: "limit", required: false, type: "number" })
  @ApiQuery({ name: "page", required: false, type: "number" })
  @ApiResponse({ status: 200, description: "Content retrieved successfully" })
  async getContent(
    @Query("type") type?: string,
    @Query("limit") limit: number = 10,
    @Query("page") page: number = 1
  ) {
    try {
      return await this.contentService.getContent(type, limit, page);
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve content",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("recent")
  @ApiOperation({ summary: "Get recent content" })
  @ApiQuery({ name: "limit", required: false, type: "number" })
  @ApiResponse({
    status: 200,
    description: "Recent content retrieved successfully",
  })
  async getRecentContent(@Query("limit") limit: number = 3) {
    try {
      return await this.contentService.getRecentContent(limit);
    } catch (error) {
      throw new HttpException(
        "Failed to retrieve recent content",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":id")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update content" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Content updated successfully" })
  async updateContent(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto
  ) {
    try {
      await this.contentService.updateContent(id, updateContentDto);
      return { success: true, message: "Content updated successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to update content",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Delete content" })
  @ApiParam({ name: "id", type: "number" })
  @ApiResponse({ status: 200, description: "Content deleted successfully" })
  async deleteContent(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.contentService.deleteContent(id);
      return { success: true, message: "Content deleted successfully" };
    } catch (error) {
      throw new HttpException(
        "Failed to delete content",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
