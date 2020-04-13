import FileIndexReference from './file-index-reference';

export default interface MasterIndex {
  /** format/version of the current index */
  format: string;
  /** a map of paths to file index references */
  files: Record<string, FileIndexReference>;
}
