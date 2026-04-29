import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Role } from "@prisma/client"; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>("JWT_SECRET")
    });
  }

  async validate(payload: { id: string; role: Role }) {

    const user = await this.userService.getById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, 
    };
  }
}