import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { GetToken } from '../../shared/decorators/get-token.decorator';
import jwtDecode from 'jwt-decode';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRegistrationDTO } from '../models/user-registration.dto';
import { UsersService } from '../services/users.service';
import { CognitoRegister } from '../../authentication/dtos/cognito-register.dto';
import { CognitoUserVerificationDto } from '../../authentication/dtos/cognito-user-verficiation.dto';

@ApiTags('Users')
@Controller({ version: ['1'], path: 'users' })
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

  @Post()
  @Version('2')
  public registerCognito(@Body() cognitoRegister: CognitoRegister) {
    return this.usersService.registerCognito(cognitoRegister);
  }

  @Post('verify-user')
  @Version('2')
  public verifyUser(
    @Body() cognitoUserVerificationDto: CognitoUserVerificationDto,
  ) {
    
    return this.usersService.verifyUserCognito(cognitoUserVerificationDto);
    
  }
}
