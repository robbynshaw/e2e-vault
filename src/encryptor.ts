import * as sodium from 'libsodium-wrappers';
import { Buffer } from 'buffer';

export default class Encryptor {
  private privateKey: Buffer;

  private state: sodium.StateAddress | undefined;

  private data: Uint8Array[];

  public constructor(privateKey: Buffer) {
    this.privateKey = privateKey;
    this.data = [];
  }

  public async init(): Promise<Encryptor> {
    await sodium.ready;
    const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(
      this.privateKey,
    );
    this.state = state;
    this.data.push(header);
    return this;
  }

  public async write(inputMsg: Buffer): Promise<Encryptor> {
    await sodium.ready;
    if (!this.state) {
      throw new Error('init must be run before write');
    }

    const encrypted: Uint8Array = sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      inputMsg,
      null,
      sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL,
    );
    this.data.push(encrypted);
    return this;
  }

  public getResult(): Buffer {
    return Buffer.concat(this.data);
  }

  public static async pad(data: Buffer, blockSize: number): Promise<Buffer> {
    await sodium.ready;
    return Buffer.from(sodium.pad(data, blockSize));
  }

  public static async newKey(): Promise<Buffer> {
    await sodium.ready;
    const key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
    return Buffer.from(key);
  }
}
