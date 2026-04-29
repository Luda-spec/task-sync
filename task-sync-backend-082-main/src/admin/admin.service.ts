import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = subDays(todayStart, 7);

    const [
      totalUsers,
      activeToday,
      activeWeek,
      totalTasks,
      completedTasks,
      totalSessions,
      completedRounds,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { tasks: { some: { createdAt: { gte: todayStart } } } },
      }),
      this.prisma.user.count({
        where: { tasks: { some: { createdAt: { gte: weekStart } } } },
      }),
      this.prisma.task.count(),
      this.prisma.task.count({ where: { isCompleted: true } }),
      this.prisma.pomodoroSession.count(),
      this.prisma.pomodoroRound.count({ where: { isCompleted: true } }),
    ]);

    return {
      users: {
        total: totalUsers,
        activeToday,
        activeWeek,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      pomodoro: {
        totalSessions,
        completedRounds,
      },
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: Prisma.UserWhereInput = search && search.trim().length > 0
    ? {
        OR: [
          { email: { contains: search.trim(), mode: Prisma.QueryMode.insensitive } },
          { name: { contains: search.trim(), mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            tasks: true,
            pomodoroSessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    this.prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };
}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        workInterval: true,
        breakInterval: true,
        intervalsCount: true,
        tasks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, isCompleted: true, priority: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async updateUserRole(userId: string, role: Role, adminId: string) {
    if (userId === adminId) {
      throw new BadRequestException('Нельзя изменить роль самому себе');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.$transaction([
      this.prisma.task.deleteMany({ where: { userId } }),
      this.prisma.pomodoroRound.deleteMany({
        where: { pomodoroSession: { userId } },
      }),
      this.prisma.pomodoroSession.deleteMany({ where: { userId } }),
      this.prisma.timeBlock.deleteMany({ where: { userId } }),
      this.prisma.user.delete({ where: { id: userId } }),
    ]);

    return { success: true, message: 'Пользователь удалён' };
  }
}