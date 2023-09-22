import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { CognitoRegister } from '../dtos/cognito-register.dto';
import { CognitoLoginDto } from '../dtos/cognito-login.dto';

@Injectable()
export class CognitoService {
  private readonly userPool: CognitoUserPool;
  private readonly cognitoIdentityServiceProvider: CognitoUserSession;
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });

    this.providerClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  registerUser(cognitoRegistration: CognitoRegister): Promise<ISignUpResult> {
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        cognitoRegistration.email,
        cognitoRegistration.password,
        // {
        //   gender: cognitoRegistration.gender,
        //   given_name: cognitoRegistration.given_name,
        //   family_name: cognitoRegistration.family_name,
        // }[
        [
          new CognitoUserAttribute({
            Name: 'email',
            Value: cognitoRegistration.email,
          }),
          new CognitoUserAttribute({
            Name: 'gender',
            Value: cognitoRegistration.gender,
          }),
          new CognitoUserAttribute({
            Name: 'given_name',
            Value: cognitoRegistration.given_name,
          }),
          new CognitoUserAttribute({
            Name: 'family_name',
            Value: cognitoRegistration.family_name,
          }),
          new CognitoUserAttribute({
            Name: 'birthdate',
            Value: cognitoRegistration.birthdate,
          }),
        ],
        null,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  verifyUser(email, verificationCode) {
    return new Promise((resolve, reject) => {
      return new CognitoUser({
        Username: email,
        Pool: this.userPool,
      }).confirmRegistration(verificationCode, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  authenticateUser(loginRequest: CognitoLoginDto) {
    const { email, password } = loginRequest;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise<CognitoUserSession>((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  confirmPassword(email, verificationCode, newPassword) {
    return new Promise((resolve, reject) => {
      return new CognitoUser({
        Username: email,
        Pool: this.userPool,
      }).confirmPassword(verificationCode, newPassword, {
        onSuccess: function (result) {
          resolve(result);
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }
}
