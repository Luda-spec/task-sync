import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async getProfile(id: string) {
    const profile = await this.getById(id);

    if (!profile) {
      return null;
    }

    const totalTasks = profile.tasks?.length || 0;

    const completedTasks = await this.prisma.task.count({
      where: { userId: id, isCompleted: true },
    });

    const todayStart = startOfDay(new Date());
    const weekStart = startOfDay(subDays(new Date(), 7));

    const todayTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: { gte: todayStart.toISOString() },
      },
    });

    const weekTasks = await this.prisma.task.count({
      where: {
        userId: id,
        createdAt: { gte: weekStart.toISOString() },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = profile;

    return {
      user: rest,
      statistics: [
        { label: 'Total', value: totalTasks },
        { label: 'Completed tasks', value: completedTasks },
        { label: 'Today tasks', value: todayTasks },
        { label: 'Week tasks', value: weekTasks },
      ],
    };
  }

  async create(dto: RegisterDto) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanName = dto.name?.trim() || 'Пользователь';

    return this.prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        password: await hash(dto.password),
        notificationsEnabled: true,
      },
    });
  }

  async update(id: string, dto: UserDto) {
    const data: any = { ...dto };

    if (dto.password) {
      data.password = await hash(dto.password);
    }

    if (dto.email) {
      data.email = dto.email.trim().toLowerCase();
    }

    if (dto.name) {
      data.name = dto.name.trim();
    }
  }

  async getByIdForSelectData(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        intervalsCount: true,
        notificationsEnabled: true,
      },
    });
  }
}