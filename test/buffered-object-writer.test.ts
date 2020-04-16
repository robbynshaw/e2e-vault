// import BufferedObjectReader from '../src/buffered-object-reader';
import Crypto from '../src/crypto';
import { Buffer } from 'buffer';

describe('buffered-object-writer', () => {
  it('writes something that can be decrypted', async () => {
    const msg = 'hello, world';
    const crypto = new Crypto();
    const key = await crypto.newKey();
    const res = await crypto.encrypt(Buffer.from(msg), key);
    const encrypted = res.toString();
    const decrypted = await crypto.decrypt(res, key);

    expect(encrypted).not.toEqual(msg);
    expect(decrypted.toString()).toEqual(msg);
  });
});
