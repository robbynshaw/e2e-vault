import Vault from '../src/e2e-vault';

describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('DummyClass is instantiable', () => {
    expect(new Vault()).toBeInstanceOf(Vault);
  });
});
