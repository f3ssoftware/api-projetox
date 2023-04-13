import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { GetToken } from '../../shared/decorators/get-token.decorator';
import jwtDecode from 'jwt-decode';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRegistrationDTO } from '../models/user-registration.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('logged-in')
  @ApiBearerAuth()
  public getLoggedUser(@GetToken() token: string) {
    const decoded: any = jwtDecode(token!);
    return decoded;
  }

  @Post()
  public register(@Body() user: UserRegistrationDTO) {
    return this.usersService.register(user);
  }
}
