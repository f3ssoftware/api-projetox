import { Injectable } from '@nestjs/common';
import { UserRegistrationDTO } from '../models/user-registration.dto';
import { KeycloakAdminService } from '../../authentication/services/keycloak-admin.service';
import { KeycloakUserRepresentationDTO } from '../../authentication/dtos/keycloak-user-representation';

@Injectable()
export class UsersService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}
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
}
