import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Session,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './Dtos/register.dto';
import { LoginDto } from './Dtos/Login.dto';
import { AuthGuard } from './guard/auth.guard';
//import { LoggingInterceptor } from '../users/interceptor/Logging.Interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.currentUser;
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async signup(@Body() registerDto: RegisterDto, @Session() session: any) {
    const newUser = await this.authservice.signup(registerDto);

    session.userId = newUser.id;

    return newUser;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginDto: LoginDto, @Session() session: any) {
    const user = await this.authservice.signin(loginDto);
    session.userId = user.id;

    return user;
  }
}
