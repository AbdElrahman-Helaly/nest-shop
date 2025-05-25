import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    Session,
    UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './Dtos/Createuser.dto';
import { get } from 'http';
import { UpdateUserDto } from './Dtos/updateuser.dto';
import { CurrentUser } from './Decorator/current-user.decorator';
import { Role, User } from './users.entity';
import { Roles } from './Decorator/roles.decorator';
import { RolesGuard } from './guard/role.guard';



@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getCurrentUser(@CurrentUser() user: User) {
        return user;
    }
    @Post('/create')
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Get()
    findall() {
        return this.usersService.findall();
    }

    @Get(':id')
    find(@Param('id') id: string) {
        return this.usersService.findone(id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Roles(Role.ADMIN)
    @Patch('/id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }


}
