import { IsString, IsOptional, IsBoolean, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateContentDto {
  @ApiProperty({ description: "Content title" })
  @IsString()
  title!: string;

  @ApiProperty({ description: "Content URL" })
  @IsString()
  url!: string;

  @ApiProperty({
    description: "Content type",
    enum: ["video", "article", "webinar", "other"],
    default: "video",
  })
  @IsOptional()
  @IsEnum(["video", "article", "webinar", "other"])
  type!: string;
}

export class UpdateContentDto {
  @ApiProperty({ description: "Content title", required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "Content URL", required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: "Content type", required: false })
  @IsOptional()
  @IsEnum(["video", "article", "webinar", "other"])
  type?: string;

  @ApiProperty({ description: "Content active status", required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
