import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';
import log from '../logging/logger';
import config from 'config';

let PRIVATE_KEY: string = '';
(async () => {
  try {
    PRIVATE_KEY = readFileSync(
      join(__dirname, '../../../../certs/private_key.pem'),
      'utf-8'
    );
  } catch (err: any) {
    log.error(err.message);
  }
})();

export default class TokenService {
  static async _generateJwtToken(uuid: string): Promise<string> {
    const token = jwt.sign({ uuid }, PRIVATE_KEY, {
      algorithm: 'RS512',
      expiresIn: config.get<string>('tokenExpiration'),
    });

    return token;
  }
}
