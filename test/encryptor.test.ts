import Encryptor from '../src/encryptor';
import Decryptor from '../src/decryptor';
import { Buffer } from 'buffer';

describe('encryptor', () => {
  it('writes something that can be decrypted', async () => {
    const msg = 'hello, world';
    const key = await Encryptor.newKey();
    const crypto = new Encryptor(key);
    await crypto.init();
    await crypto.write(Buffer.from(msg));
    const encrypted = crypto.getResult().toString();

    const decrypto = new Decryptor(key);
    const next = await decrypto.init(crypto.getResult());
    await decrypto.read(next);

    expect(encrypted).not.toEqual(msg);
    expect(decrypto.getData().toString()).toEqual(msg);
  });

  it('should throw if not initialized', async () => {
    const msg = 'hello, world';
    const key = await Encryptor.newKey();
    const crypto = new Encryptor(key);

    await expect(crypto.write(Buffer.from(msg))).rejects.toThrowError(
      'init must be run before write',
    );
  });
});
