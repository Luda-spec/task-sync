import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './dto/task.dto';
import { RepeatType } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async getAll(userId: string, date?: string) {
    const where: any = { userId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.scheduledAt = {
        gte: startOfDay,
        lt: endOfDay
      };
    }

    return this.prisma.task.findMany({
      where,
      orderBy: [
        { scheduledAt: 'asc' }, 
        { timeFrom: 'asc' }
      ]
    });
  }

  async create(dto: TaskDto, userId: string) {
    const { repeat, scheduledAt, ...rest } = dto;
    
    return this.prisma.task.create({
      data: {
        ...rest,
        repeat: repeat ? (repeat.toUpperCase() as RepeatType) : 'NEVER',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        user: { connect: { id: userId } }
      }
    });
  }

  async update(dto: Partial<TaskDto>, taskId: string, userId: string) {
    const { scheduledAt, ...rest } = dto;
    
    return this.prisma.task.update({
      where: { userId, id: taskId },
      data: {
        ...rest,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined
      }
    });
  }

  async delete(taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId }
    });
  }

  async getById(taskId: string, userId: string) {
    return this.prisma.task.findUnique({
      where: { id: taskId, userId }
    });
  }
}