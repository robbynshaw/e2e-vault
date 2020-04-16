import { Buffer } from 'buffer';
import { BitFieldInstance } from 'sparse-bitfield';
import BufferedObjectStream, {
  BufferedObjectStreamOpts,
  ByteHeader,
} from './buffered-object-stream';

export interface BufferedObjectWriterOpts extends BufferedObjectStreamOpts {
  allFileKeys: BitFieldInstance;
  publicKey: Buffer;
}

export default class BufferedObjectWriter<TModel> extends BufferedObjectStream {
  private allFileKeys: BitFieldInstance;
  private publicKey: Buffer;

  constructor(opts: BufferedObjectWriterOpts) {
    super(opts);
    this.allFileKeys = opts.allFileKeys;
    this.publicKey = opts.publicKey;
  }

  public async init(model: TModel): Promise<void> {
    // todo use protobuffers
    const buffer = Buffer.from(JSON.stringify(model));
  }

  private async encrypt(chunk: Buffer): Promise<Buffer> {
    throw new Error('not implemented');
  }

  private writeHeader(header: ByteHeader): Buffer {
    return Buffer.from([header]);
  }

  private writeNextFileId(chunk: Uint8Array): Buffer {
    throw new Error('not implemented');
  }
}
