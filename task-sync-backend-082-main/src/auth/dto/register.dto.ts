import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: "Введите корректный email адрес" })
    email: string;

    @MinLength(6, {
        message: "Пароль должен содержать не менее 6 символов"
    })
    @IsString()
    password: string;

    @IsString()
    @MinLength(2, { message: "Имя должно содержать минимум 2 символа" })
    name: string;
}