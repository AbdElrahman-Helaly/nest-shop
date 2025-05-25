import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsEnum,
    IsPhoneNumber,
} from 'class-validator';
import { Role } from '../users.entity';


export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    userName: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

}
