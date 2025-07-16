import { IsString, IsOptional, IsBoolean, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({ description: "Event title" })
  @IsString()
  title!: string;

  @ApiProperty({ description: "Event description" })
  @IsString()
  description!: string;

  @ApiProperty({ description: "Event date" })
  @IsDateString()
  eventDate!: string;

  @ApiProperty({ description: "Event link", required: false })
  @IsString()
  link!: string;
}

export class UpdateEventDto {
  @ApiProperty({ description: "Event title", required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "Event description", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Event date", required: false })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiProperty({ description: "Event link", required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: "Event active status", required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
