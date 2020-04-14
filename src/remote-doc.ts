import BufferedObjectReader, { BufferedObjectReaderOpts } from './buffered-object-reader';
import { FreezeObject, from, applyChanges } from 'automerge';

export interface RemoteDocOpts<TModel> extends BufferedObjectReaderOpts {
  onChange: (model: TModel) => void;
}

export default class RemoteDoc<TModel> {
  private objectReader: BufferedObjectReader;

  public Doc: FreezeObject<TModel> | undefined;

  constructor(opts: RemoteDocOpts<TModel>) {
    this.objectReader = new BufferedObjectReader(opts);
  }

  public async load(): Promise<RemoteDoc<TModel>> {
    if (!(await this.objectReader.tryReadNext())) {
      throw new Error('failed to load remote doc');
    }
    const data = this.objectReader.data;
    const model = JSON.parse(data.toString()) as TModel;
    this.Doc = from<TModel>(model); // todo add actorId manually
    return await this.update();
  }

  public async update(): Promise<RemoteDoc<TModel>> {
    if (this.Doc && (await this.objectReader.tryReadNext())) {
      const changes = JSON.parse(this.objectReader.data.toString());
      this.Doc = applyChanges(this.Doc, changes);
    }
    return this;
  }
}
