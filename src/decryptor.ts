import * as sodium from 'libsodium-wrappers';
import { Buffer } from 'buffer';

export default class Decryptor {
  private privateKey: Buffer;

  private state: sodium.StateAddress | undefined;

  private data: Uint8Array[];

  public constructor(privateKey: Buffer) {
    this.privateKey = privateKey;
    this.data = [];
  }

  /** init takes an encrypted message and intializes the decryption, returning the message without the header */
  public async init(encryptedMsg: Buffer): Promise<Buffer> {
    await sodium.ready;
    const header = encryptedMsg.subarray(
      0,
      sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES,
    );
    const msg = encryptedMsg.subarray(sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    this.state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, this.privateKey);
    return msg;
  }

  /** read attempts to decrypt the buffer and returns true if there is more to read */
  public async read(nextChunk: Buffer): Promise<boolean> {
    await sodium.ready;
    if (!this.state) {
      throw new Error('init must be run before read');
    }

    const res = sodium.crypto_secretstream_xchacha20poly1305_pull(this.state, nextChunk);
    if (!res) {
      throw new Error('decryption failed');
    }
    this.data.push(res.message);
    return res.tag !== sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL;
  }

  public getData(): Buffer {
    return Buffer.concat(this.data);
  }

  public static async unpad(data: Buffer, blockSize: number): Promise<Buffer> {
    await sodium.ready;
    return Buffer.from(sodium.unpad(data, blockSize));
  }
}
