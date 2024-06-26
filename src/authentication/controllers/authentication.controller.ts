import { Body, Controller, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { GetToken } from '../../shared/decorators/get-token.decorator';
import { KeycloakUserRepresentationDTO } from '../dtos/keycloak-user-representation';
import { LoginDTO } from '../dtos/login.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { TokenDTO } from '../dtos/token.dto';
import { KeycloakAdminService } from '../services/keycloak-admin.service';
import { KeycloakService } from '../services/keycloak.service';

@ApiTags('Authentication')
@Controller({ version: ['1'], path: 'authentication' })
export class AuthenticationController {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  @Post('login')
  public async login(@Body() loginDTO: LoginDTO): Promise<TokenDTO> {
    return await this.keycloakService.login(loginDTO);
  }

  @Post('refresh-token')
  @ApiHeader({ name: 'refresh_token' })
  public async refreshToken(
    @Headers('refresh_token') refresh_token: string,
  ): Promise<TokenDTO> {
    return await this.keycloakService.refreshToken(refresh_token);
  }

  // @Post()
  // public async create(
  //   @Body() kcUserRepresentation: KeycloakUserRepresentationDTO,
  // ) {
  //   return await this.keycloakAdminService.createUserOnKc(kcUserRepresentation);
  // }

  // @Put(':id')
  // public async updateUser(
  //   @Param('userId')
  //   userId: string,
  //   kcUserRepresentation: KeycloakUserRepresentationDTO,
  //   @GetToken()
  //   token: string,
  // ): Promise<void> {
  //   return await this.keycloakAdminService.updateUser(
  //     userId,
  //     kcUserRepresentation,
  //     token,
  //   );
  // }

  // @Put('reset-password/:user_id')
  // public async resetPassword(
  //   @Param('user_id')
  //   userId: string,
  //   @Body()
  //   resetPasswordDto: ResetPasswordDto,
  //   @GetToken()
  //   token: string,
  // ) {
  //   return await this.keycloakAdminService.resetPassword(
  //     userId,
  //     resetPasswordDto,
  //     token,
  //   );
  // }
}
