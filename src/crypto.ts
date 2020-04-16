import * as sodium from 'libsodium-wrappers';
import { Buffer } from 'buffer';

export default class Crypto {
  public async newKey(): Promise<Buffer> {
    await sodium.ready;
    let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
    return Buffer.from(key);
  }

  public async encrypt(inputMsg: Buffer, privateKey: Buffer): Promise<Buffer> {
    await sodium.ready;
    const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(privateKey);

    const encrypted: Uint8Array = sodium.crypto_secretstream_xchacha20poly1305_push(
      state,
      inputMsg,
      null,
      sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL,
    );
    const result = Buffer.from(encrypted);

    const stateAddr = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, privateKey);
    let res = sodium.crypto_secretstream_xchacha20poly1305_pull(stateAddr, result);
    return Buffer.concat([header, encrypted]);
  }

  public async decrypt(inputMsg: Buffer, privateKey: Buffer): Promise<Buffer> {
    let tag: number = 0;
    const messages: Uint8Array[] = [];
    await sodium.ready;
    const header = inputMsg.subarray(0, sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    const msg = inputMsg.subarray(sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    const stateAddr = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, privateKey);

    while (tag != sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
      let res = sodium.crypto_secretstream_xchacha20poly1305_pull(stateAddr, msg);
      if (!res) {
        throw new Error('decryption failed');
      }
      messages.push(res.message);
      tag = res.tag;
    }

    return Buffer.concat(messages);
  }
}
