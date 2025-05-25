import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
    IsEnum,
    IsPhoneNumber,
} from 'class-validator';
import { Role } from '../users.entity';


export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    userName: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

}
