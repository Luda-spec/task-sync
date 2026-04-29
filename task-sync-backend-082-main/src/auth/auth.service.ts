import { 
  BadRequestException, 
  Injectable, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { verify } from 'argon2';
import { Response } from 'express';
import * as nodemailer from 'nodemailer';
import { Role } from '@prisma/client'; 

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  private mailer = nodemailer.createTransport({
    host: String(process.env.EMAIL_HOST),
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: String(process.env.EMAIL_USER),
      pass: String(process.env.EMAIL_PASSWORD),
    },
  });

  constructor(
    private jwt: JwtService,
    private userService: UserService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    
    const tokens = this.issueTokens(user.id, user.role);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens  
    };
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException("User already registered");
    }

    const user = await this.userService.create(dto);
    
    const tokens = this.issueTokens(user.id, user.role);

    this.sendWelcomeEmail(user.email, user.name).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return { 
      user: userWithoutPassword, 
      ...tokens  
    };
  }

  private issueTokens(userId: string, role: Role) {
    const data = { 
      id: userId,
      role: role, 
    };

    const accessToken = this.jwt.sign(data, {
      expiresIn: "1h"
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: "7d"
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost',
      expires: expiresIn,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
  }

  async getNewToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    
    if (!result) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.userService.getById(result.id);
    
    const tokens = this.issueTokens(user.id, user.role);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost',
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
  }

  private async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailer.sendMail({
        from: `"Task Sync" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Добро пожаловать в Task Sync! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6fb; padding: 40px 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
              <h1 style="color: #333; text-align: center; margin-bottom: 10px;">🎉 Добро пожаловать, ${name}!</h1>
              <p style="font-size: 16px; color: #444; text-align: center; margin-bottom: 25px;">Спасибо за регистрацию в <b>Task Sync</b>.</p>
              <div style="background: #f8f9ff; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0 0 10px; font-weight: bold; color: #333;">Теперь тебе доступны:</p>
                <ul style="padding-left: 20px; margin: 0; color: #555; line-height: 1.6;">
                  <li>✅ Удобное управление задачами</li>
                  <li>⏱️ Pomodoro таймер</li>
                  <li>📊 Аналитика продуктивности</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">Начни пользоваться сервисом уже сейчас 🚀</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} Task Sync 💜</p>
            </div>
          </div>
        `,
      });
    } catch (error) {
    }
  }
}