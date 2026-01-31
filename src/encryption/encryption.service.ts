import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm: string;
  private readonly key: string;

  constructor(private _configService: ConfigService) {
    this.algorithm = this._configService.get<string>('ENCRYPTION_ALGORITHM')!;
    this.key = this._configService.get<string>('ENCRYPTION_KEY')!;
  }

  encrypt(stringToEncrypt: string): string {
    const iv = randomBytes(16); // Generate a random IV for every encryption
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(stringToEncrypt, 'utf8'),
      cipher.final(),
    ]);

    // Return IV + Encrypted Data as a single hex string
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(stringToDecrypt: string): string {
    const [ivHex, dataHex] = stringToDecrypt.split(':'); // Split IV and data
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(dataHex, 'hex');

    const decipher = createDecipheriv(this.algorithm, this.key, iv);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
