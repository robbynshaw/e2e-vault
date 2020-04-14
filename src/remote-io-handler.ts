export default interface RemoteIOHandler {
  read(path: string, offset: number, length: number): Promise<Uint8Array>;
  write(path: string, data: Uint8Array): Promise<void>;
}
