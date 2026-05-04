import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
     @IsEmail({}, { message: "Введите корректный email адрес" })
    email: string;

    @MinLength(6, {
        message: "Пароль должен содержать не менее 6 символов"
    })
    @IsString()
    password: string;
}