import MasterIndex from './master-index';

export default interface StorageProvider {
  getIndex(): Promise<MasterIndex>;
}
