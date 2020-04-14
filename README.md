# e2e-vault

> Give your web app users private, secure data storage in the platform of their choice

![Build](https://github.com/robbynshaw/e2e-vault/workflows/build/badge.svg?branch=master)[![Coveralls](https://img.shields.io/coveralls/robbynshaw/e2e-vault.svg)](https://coveralls.io/github/robbynshaw/e2e-vault)[![Dev Dependencies](https://david-dm.org/robbynshaw/e2e-vault/dev-status.svg)](https://david-dm.org/robbynshaw/e2e-vault?type=dev)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Usage

```bash
yarn add e2e-vault
# or #
npm install e2e-vault
```

## Development

- `yarn test`: Run test suite
- `yarn test:watch`: Run test suite and watch for changes
- `yarn test:prod`: Run linting and generate coverage
- `yarn build`: Generate bundles and typings, create docs
- `yarn lint`: Lints code
- `yarn commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Tooling

- **[RollupJS](https://rollupjs.org/)** for multiple optimized bundles following the [standard convention](http://2ality.com/2017/04/setting-up-multi-platform-packages.html) and [Tree-shaking](https://alexjoverm.github.io/2017/03/06/Tree-shaking-with-Webpack-2-TypeScript-and-Babel/)
- Tests, coverage and interactive watch mode using **[Jest](http://facebook.github.io/jest/)**
- **[Prettier](https://github.com/prettier/prettier)** and **[ESLint](https://eslint.org/)** for code formatting and consistency
- **Docs automatic generation and deployment** to `gh-pages`, using **[TypeDoc](http://typedoc.org/)**
- **Github Actions** for CI/CD pipeline
- (**Automatic releases and changelog**, using [Semantic release](https://github.com/semantic-release/semantic-release), [Commitizen](https://github.com/commitizen/cz-cli), [Conventional changelog](https://github.com/conventional-changelog/conventional-changelog) and [Husky](https://github.com/typicode/husky) (for the git hooks)

### Excluding peerDependencies

On library development, one might want to set some peer dependencies, and thus remove those from the final bundle. You can see in [Rollup docs](https://rollupjs.org/#peer-dependencies) how to do that.

Good news: the setup is here for you, you must only include the dependency name in `external` property within `rollup.config.js`. For example, if you want to exclude `lodash`, just write there `external: ['lodash']`.

### Automatic releases

_**Prerequisites**: you need to create/login accounts and add your project to:_

- [npm](https://www.npmjs.com/)
- [Travis CI](https://travis-ci.org)
- [Coveralls](https://coveralls.io)

_**Prerequisite for Windows**: Semantic-release uses
**[node-gyp](https://github.com/nodejs/node-gyp)** so you will need to
install
[Microsoft's windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)
using this command:_

```bash
npm install --global --production windows-build-tools
```

### Git Hooks

There is already set a `precommit` hook for formatting your code with Prettier :nail_care:

By default, there are two disabled git hooks. They're set up when you run the `npm run semantic-release-prepare` script. They make sure:

- You follow a [conventional commit message](https://github.com/conventional-changelog/conventional-changelog)
- Your build is not going to fail in [Travis](https://travis-ci.org) (or your CI server), since it's runned locally before `git push`

This makes more sense in combination with [automatic releases](#automatic-releases)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind are welcome!
