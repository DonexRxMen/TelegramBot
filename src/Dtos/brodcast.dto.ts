import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BroadcastMessageDto {
  @ApiProperty({ description: "Message to broadcast" })
  @IsString()
  message!: string;

  @ApiProperty({
    description: "Target channel",
    enum: ["channel", "lounge", "admin"],
    default: "channel",
  })
  @IsOptional()
  @IsEnum(["channel", "lounge", "admin"])
  target?: string;
}
