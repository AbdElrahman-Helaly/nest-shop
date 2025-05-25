import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/users/users.entity';
export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    userName: string;


    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

}