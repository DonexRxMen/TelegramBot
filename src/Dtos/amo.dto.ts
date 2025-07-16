import { IsString, IsOptional, IsBoolean, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAmaQuestionDto {
  @ApiProperty({ description: "The question text" })
  @IsString()
  question!: string;

  @ApiProperty({ description: "User ID", required: false })
  @IsString()
  userId!: string;

  @ApiProperty({ description: "Username", required: false })
  @IsString()
  username!: string;
}

export class UpdateAmaQuestionDto {
  @ApiProperty({ description: "Mark question as answered" })
  @IsBoolean()
  answered!: boolean;
}

export class AmaQuestionResponseDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsOptional()
  question?: string;

  @ApiProperty()
  @IsOptional()
  userId?: string;

  @ApiProperty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsOptional()
  answered?: boolean;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date;
}
