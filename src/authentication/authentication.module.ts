import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { KeycloakAdminService } from './services/keycloak-admin.service';
import { KeycloakService } from './services/keycloak.service';
import { CognitoService } from './services/cognito.service';

@Module({
  providers: [KeycloakService, KeycloakAdminService, CognitoService],
  controllers: [AuthenticationController],
  exports: [KeycloakService, KeycloakAdminService, CognitoService],
})
export class AuthenticationModule {}
