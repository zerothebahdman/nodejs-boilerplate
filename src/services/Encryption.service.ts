import bcrypt from 'bcrypt';
import log from '../logging/logger';

export default class EncryptionService {
  static async hashPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 14);
    return encryptedPassword;
  }

  static async comparePassword(
    password: string,
    storedPassword: string
  ): Promise<boolean> {
    const _checkPassword = await bcrypt.compare(storedPassword, password);
    return _checkPassword;
  }
}
