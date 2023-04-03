import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDTO } from '../dtos/login.dto';
import { TokenDTO } from '../dtos/token.dto';

@Injectable()
export class KeycloakService {
  private url = `${process.env.KEYCLOAK_URL}realms/master/protocol/openid-connect/token`;

  async login(loginDTO: LoginDTO): Promise<TokenDTO> {
    console.log(this.url);
    const dto = plainToInstance(LoginDTO, loginDTO);
    const validation = await validate(dto);

    if (validation?.length) {
      throw new BadRequestException(validation.toString());
    }

    const params = new URLSearchParams();

    params.append('username', loginDTO.username);
    params.append('password', loginDTO.password);
    params.append('grant_type', 'password');
    params.append('client_id', 'pjx');

    try {
      const { data } = await axios.post(this.url, params);
      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status,
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenDTO> {
    if (!refreshToken?.length) {
      throw new BadRequestException('Refresh token não informado');
    }

    const params = new URLSearchParams();

    params.append('grant_type', 'refresh_token');
    params.append('client_id', 'pagstar');
    params.append('refresh_token', refreshToken);

    try {
      const { data } = await axios.post(this.url, params);
      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status,
      );
    }
  }
}
