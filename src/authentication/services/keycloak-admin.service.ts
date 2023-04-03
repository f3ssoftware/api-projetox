import {
  HttpException,
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  KeycloakCredentialsDTO,
  KeycloakUserRepresentationDTO,
} from '../dtos/keycloak-user-representation';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class KeycloakAdminService {
  private url = `${process.env.KEYCLOAK_URL}/admin/realms/master`;
  private authUrl = `${process.env.KEYCLOAK_URL}/auth/admin/realms/master`;

  constructor(private keycloakService: KeycloakService) {}

  async loginAsAdmin(): Promise<string> {
    const response = await this.keycloakService.login({
      username: process.env.KEYCLOAK_ADMIN_USER,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    });

    if (!response?.access_token) {
      throw new NotFoundException('Credencial de administrador não encontrada');
    }

    return response.access_token;
  }

  async listRealmClients(): Promise<any> {
    try {
      const adminToken = await this.loginAsAdmin();

      const response = await axios.get(
        `${this.url}/clients?first=0&max=1000&search=true`,
        this.buildKCHeader(adminToken),
      );

      return response?.data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status,
      );
    }
  }

  async listClientAvailableRoles(id: string): Promise<any> {
    if (!id?.length) {
      throw new BadRequestException('ID do cliente não informado');
    }

    try {
      const token = await this.loginAsAdmin();

      const response = await axios.get(
        `${this.url}/clients/${id}/roles`,
        this.buildKCHeader(token),
      );

      return response?.data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status,
      );
    }
  }

  async userRoleMapping(kcUserId: string, role: any, clientId?: string) {
    try {
      if (!clientId?.length) {
        const clients = await this.listRealmClients();

        const pagstarClient = clients.find((c) => c.clientId === 'pagstar');

        clientId = pagstarClient.id;
      }

      const roles = await this.listClientAvailableRoles(clientId);

      const userRole = roles.find((c) => c.name == role);

      if (!userRole) {
        throw new NotFoundException(
          'Permissão informada não encontrada no serviço de autenticação',
        );
      }

      const token = await this.loginAsAdmin();

      const url = `${this.url}/users/${kcUserId}/role-mappings/clients/${clientId}`;

      const response = await axios.post(
        url,
        [userRole],
        this.buildKCHeader(token),
      );

      return response.data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description ||
          err?.response?.data?.errorMessage ||
          err?.response?.data?.error,
        err?.response?.status,
      );
    }
  }

  async createUserOnKc(
    kcUserRepresentation: KeycloakUserRepresentationDTO,
  ): Promise<string> {
    const dto = plainToInstance(
      KeycloakUserRepresentationDTO,
      kcUserRepresentation,
    );
    const validation = await validate(dto);

    if (validation?.length) {
      throw new BadRequestException(validation.toString());
    }

    const token = await this.loginAsAdmin();

    try {
      const responseKeycloak = await axios.post(
        `${this.url}/users`,
        kcUserRepresentation,
        this.buildKCHeader(token),
      );

      if (responseKeycloak.status == HttpStatus.CONFLICT) {
        throw new HttpException('Usuário já existente', HttpStatus.CONFLICT);
      }

      const splitted = responseKeycloak?.headers?.location?.split('/');
      const kcUserId = splitted ? splitted[splitted.length - 1] : null;

      Logger.debug('Created user with kcUserId', kcUserId);

      return kcUserId;
    } catch (error) {
      throw new HttpException(
        error?.response?.data?.error_description ||
          error?.response?.data?.errorMessage,
        error?.response?.status,
      );
    }
  }

  async updateUser(
    userId: string,
    kcUserRepresentation: KeycloakUserRepresentationDTO,
    token: string,
  ) {
    const response = await axios.put(
      `${this.authUrl}/users/${userId}`,
      kcUserRepresentation,
      this.buildKCHeader(token),
    );

    return response.data;
  }

  async resetPassword(
    userId: string,
    resetPasswordDto: ResetPasswordDto,
    token: string,
  ) {
    const credentials: KeycloakCredentialsDTO = {
      temporary: true,
      type: 'password',
      value: resetPasswordDto.password,
    };

    try {
      const response = await axios.put(
        `${this.authUrl}/users/${userId}/reset-password`,
        credentials,
        this.buildKCHeader(token),
      );
      return response.data;
    } catch (err) {
      Logger.error(err);
    }
  }

  private buildKCHeader(token): object {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }
}
