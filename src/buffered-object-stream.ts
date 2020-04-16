import RemoteIOHandler from './remote-io-handler';

export interface BufferedObjectStreamOpts {
  chunkSize?: number;
  fileLength?: number;
  remoteIOHandler: RemoteIOHandler;
  currentFilePath: string;
  fileOffset: number;
}

export enum ByteHeader {
  FakeChunk = 0,
  LastChunk = 1,
  ReadChunk = 2,
}

export default abstract class BufferedObjectStream {
  protected chunkSize: number;
  protected fileLength: number;
  protected remoteIO: RemoteIOHandler;
  protected fileOffset: number;

  public currentFilePath: string;

  constructor(opts: BufferedObjectStreamOpts) {
    this.chunkSize = opts.chunkSize || 4096;
    this.fileLength = opts.fileLength || 32768;
    this.remoteIO = opts.remoteIOHandler;

    this.currentFilePath = opts.currentFilePath;
    this.fileOffset = opts.fileOffset;
  }
}
