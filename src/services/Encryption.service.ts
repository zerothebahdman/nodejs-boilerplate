import bcrypt from 'bcrypt';

export default class EncryptionService {
  static async hashPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 14);
    return encryptedPassword;
  }
}
