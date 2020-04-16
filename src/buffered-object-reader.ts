import BufferedObjectStream, {
  BufferedObjectStreamOpts,
  ByteHeader,
} from './buffered-object-stream';

export interface BufferedObjectReaderOpts extends BufferedObjectStreamOpts {
  privateKey: Buffer;
}

export default class BufferedObjectReader extends BufferedObjectStream {
  private privateKey: Buffer;

  public data: Uint8Array;

  constructor(opts: BufferedObjectReaderOpts) {
    super(opts);
    this.privateKey = opts.privateKey;
    this.data = new Uint8Array(this.chunkSize / 8);
  }

  public async tryReadNext(): Promise<boolean> {
    let chunkOffset = 0;
    let didRead = false;
    this.data = new Uint8Array(this.chunkSize / 8);

    try {
      while (true) {
        this.data.set(await this.readNext(), chunkOffset);
        chunkOffset += this.chunkSize;
        didRead = true;
      }
    } catch (err) {
      // do nothing
    }
    return didRead;
  }

  private async readNext(): Promise<Uint8Array> {
    const encrypted = await this.remoteIO.read(
      this.currentFilePath,
      this.fileOffset,
      this.chunkSize,
    );
    const chunk = await this.decrypt(encrypted);
    this.fileOffset += this.chunkSize;
    if (this.parseHeader(chunk) === ByteHeader.FakeChunk) {
      throw new Error('Tried to read a fake chunk');
    }

    if (this.fileOffset >= this.fileLength - 1) {
      this.currentFilePath = this.parseNextFileId(chunk);
    }

    return chunk;
  }

  private async decrypt(chunk: Uint8Array): Promise<Uint8Array> {
    throw new Error('not implemented');
  }

  private parseHeader(chunk: Uint8Array): ByteHeader {
    return chunk[0];
  }

  private parseNextFileId(chunk: Uint8Array): string {
    return chunk.subarray(1, 7).toString();
  }
}
