import Encryptor from '../src/encryptor';
import Decryptor from '../src/decryptor';
import { Buffer } from 'buffer';

describe('decryptor', () => {
  it('should throw if not initialized', async () => {
    const msg = 'hello, world';
    const key = await Encryptor.newKey();
    const crypto = new Encryptor(key);
    await crypto.init();
    await crypto.write(Buffer.from(msg));

    const decrypto = new Decryptor(key);
    await expect(decrypto.read(crypto.getResult())).rejects.toThrowError(
      'init must be run before read',
    );
  });
  it('should throw with bad data', async () => {
    const msg = 'hello, world';
    const key = await Encryptor.newKey();
    const crypto = new Encryptor(key);
    await crypto.init();
    await crypto.write(Buffer.from(msg));
    const data = Buffer.concat([Buffer.from('a'), crypto.getResult()]);

    const decrypto = new Decryptor(key);
    await decrypto.init(data);
    await expect(decrypto.read(data)).rejects.toThrowError('decryption failed');
  });
});
