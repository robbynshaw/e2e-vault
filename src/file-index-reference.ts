export default interface FileIndexReference {
  /** unique ids/paths to the file index chunks. (should be randomly generated to ensure security) */
  id: string[];
  /** modification unix timestamp */
  mod: number;
  /** clientId that performed the last modification */
  modBy: string;
}
