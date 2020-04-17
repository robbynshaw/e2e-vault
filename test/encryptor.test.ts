import Encryptor from '../src/encryptor';
import Decryptor from '../src/decryptor';
import { Buffer } from 'buffer';

const encyryptMsg = async (msg: Buffer, key: Buffer): Promise<Buffer> => {
  const crypto = new Encryptor(key);
  await crypto.init();
  await crypto.write(Buffer.from(msg));
  return crypto.getResult();
};

const padMsg = async (msg: string, blockSize: number): Promise<Buffer> => {
  const data = Buffer.from(msg);
  return await Encryptor.pad(data, blockSize);
};

describe('encryptor', () => {
  it('writes something that can be decrypted', async () => {
    const msg = 'hello, world';
    const key = await Encryptor.newKey();
    const res = await encyryptMsg(Buffer.from(msg), key);
    const encrypted = res.toString();

    const decrypto = new Decryptor(key);
    const next = await decrypto.init(res);
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

  it('produces a consistent block size with padding', async () => {
    const blockSize = 2000;
    const key = await Encryptor.newKey();
    const a = await encyryptMsg(await padMsg('hello world', blockSize), key);
    const b = await encyryptMsg(await padMsg('silly little gooses', blockSize), key);
    expect(a.length).toEqual(b.length);
  });
});
