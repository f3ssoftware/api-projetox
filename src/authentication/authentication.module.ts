import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { KeycloakAdminService } from './services/keycloak-admin.service';
import { KeycloakService } from './services/keycloak.service';

@Module({
  providers: [KeycloakService, KeycloakAdminService],
  controllers: [AuthenticationController],
  exports: [KeycloakService, KeycloakAdminService],
})
export class AuthenticationModule {}
