import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRegistrationDTO } from '../models/user-registration.dto';
import { KeycloakAdminService } from '../../authentication/services/keycloak-admin.service';
import { KeycloakUserRepresentationDTO } from '../../authentication/dtos/keycloak-user-representation';
import { CognitoService } from '../../authentication/services/cognito.service';
import { CognitoRegister } from '../../authentication/dtos/cognito-register.dto';
import { CognitoUserVerificationDto } from '../../authentication/dtos/cognito-user-verficiation.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly keycloakAdminService: KeycloakAdminService,
    private readonly cognitoService: CognitoService,
  ) {}

  async register(user: UserRegistrationDTO) {
    const kcUserRepresentation: KeycloakUserRepresentationDTO = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.email,
      enabled: true,
      credentials: [
        {
          temporary: false,
          type: 'password',
          value: user.password,
        },
      ],
    };
    const kcUserId = await this.keycloakAdminService.createUserOnKc(
      kcUserRepresentation,
    );

    await this.keycloakAdminService.userRoleMapping(kcUserId, 'free');
    return { userId: kcUserId };
  }

  async registerCognito(cognitoRegister: CognitoRegister) {
    try {
      return await this.cognitoService.registerUser(cognitoRegister);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyUserCognito(cognitoUserVerification: CognitoUserVerificationDto) {
    return this.cognitoService.verifyUser(
      cognitoUserVerification.email,
      cognitoUserVerification.code,
    );
  }
}
