import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  async validateUser(authorization: string): Promise<any> {
    const { KEYCLOAK_REALM, KEYCLOAK_URL } = process.env;
    const url = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

    const response = await fetch(url, {
      headers: {
        authorization,
      },
    });

    const result = await response.json();
    // console.log('response', response.status, result);

    if (response.status === 200 && !result.error) {
      return result;
    }

    return null;
  }
}
