import { Priority, RepeatType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, IsDateString } from "class-validator";

export class TaskDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description?: string; 

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;

    @IsString()
    @IsOptional()
    createdAt?: string;

    @IsEnum(Priority)
    @IsOptional()
    @Transform(({ value }) => ("" + value).toLowerCase())
    priority?: Priority;


    @IsString()
    @IsOptional()
    timeFrom?: string; 

    @IsString()
    @IsOptional()
    timeTo?: string; 
    @IsEnum(RepeatType)
    @IsOptional()
    @Transform(({ value }) => value ? ("" + value).toUpperCase() : 'NEVER')
    repeat?: RepeatType;

    @IsDateString()
    @IsOptional()
    scheduledAt?: string; 
}