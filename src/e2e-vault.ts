// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export default class Vault {
  private msg = 'hello world';

  speak(): string {
    return this.msg;
  }
}
