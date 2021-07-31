<div align="center">
<br>
<img width="200" src="https://user-images.githubusercontent.com/288160/95674568-ed8d6080-0b65-11eb-88be-d119c88ee285.png" alt="Hover Web">
<br>
<h1>hover-javascript</h1>
<p>🧰 Toolbox of scripts and configurations for <strong>JavaScript</strong> and <strong>TypeScript</strong> projects</p></div>

<div align="center">

[![Build Status][build-badge]][build-link]
[![Code Coverage][coverage-badge]][coverage-link]
[![Version][package-badge]][package-link]
[![Maintenance][maintenance-badge]][maintenance-link]
[![Node Version][node-badge]][node-link] <br>
[![MIT License][license-badge]][license-link]
[![Code Style][prettier-badge]][prettier-link]
[![Conventional Commits][conventional-commits-badge]][conventional-commits-link]

</div>

<br>

## ✨ Features

- 📦 One package to encapsulate most tooling dependencies
- ⚙️ Common (extensible) configurations to eliminate boilerplate
- 📏 Conventions that help enforce consistency
- 🥽 Best practices to help avoid 🦶🏻🔫

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Overriding Config](#overriding-config)
    - [ESLint](#eslint)
    - [Prettier](#prettier)
    - [Jest](#jest)
    - [Semantic Release](#semantic-release)
    - [Lint Staged](#lint-staged)
  - [Source Control Hooks](#source-control-hooks)
    - [Husky Example](#husky-example)
- [License](#license)
- [Maintenance](#maintenance)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm-link] which is bundled with
[node][node-link] and should be installed as one of your project's
`devDependencies`:

```
yarn add -D @hover/javascript
```

## Usage

This is a CLI and exposes a bin called **`hover-scripts`**. You'll find all
available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some of
the things you can do with `hover-scripts`.

### Overriding Config

Unlike **[react-scripts][react-scripts-link]**, `hover-scripts` allows you to
specify your own configuration for things and have that plug directly into the
way things work with `hover-scripts`. There are various ways that it works, but
basically if you want to have your own config for something, just add the
configuration and `hover-scripts` will use that instead of it's own internal
config. In addition, `hover-scripts` exposes its configuration so you can use it
and override only the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

> Note: `hover-scripts` intentionally does not merge things for you when you
> start configuring things to make it less magical and more straightforward.
> Extending can take place on your terms.

#### ESLint

So, if we were to do this for ESLint, you could create an `.eslintrc.js` with
the contents of:

```js
module.exports = {
  extends: require.resolve('@hover/javascript/eslint'),
  // Include this when using TypeScript
  parserOptions: {
    project: ['./tsconfig.json'],
  },
}
```

##### Strict Preset

> ✨ The strict preset is recommended for new projects!

A strict preset is also available that includes more agressive linting rules
that enforce the order and grouping of imports.

```js
module.exports = {
  extends: [
    require.resolve('@hover/javascript/eslint'),
    require.resolve('@hover/javascript/eslint/strict'),
  ],
  // Include this when using TypeScript
  parserOptions: {
    project: ['./tsconfig.json'],
  },
}
```

##### React Preset

> ℹ️ The standard preset attempts to detect a React dependency and enable this
> preset automatically so this is usually only necessary in edge cases where
> React is not detected (such as a monorepo)

A React preset is available that includes additional React-specific rules as
well as the **eslint-plugin-react-hooks** plugin.

```js
module.exports = {
  extends: require.resolve('@hover/javascript/eslint/react'),
}
```

#### Prettier

Or, for Prettier, a `.prettierrc.js` with:

```js
module.exports = require('@hover/javascript/prettier')
```

#### Jest

Or, for Jest in `jest.config.js`:

> ℹ️ If **ts-jest** is installed, it will automatically be used as the `preset`

```js
const config = require('@hover/javascript/jest')

module.exports = {
  ...config,
  coverageThreshold: null,
}
```

#### Semantic Release

Or, for Semantic Release (used in `ci-after-success` script) in
`release.config.js`:

```js
module.exports = {
  extends: require.resolve('@hover/javascript/release'),
}
```

#### Lint Staged

Or, for lint-staged (used in `pre-commit` script) in `lint-staged.config.js`:

```js
module.exports = {
  ...require.resolve('@hover/javascript/lint-staged'),
  '*.+(js|jsx|ts|tsx)': ['yarn some-custom-command'],
}
```

##### Custom Test Command

If all you want to do is run a custom test command, you can pass `--testCommand`
to `hover-scripts pre-commit`. The built-in lint-staged configuration will be
used with your custom command.

```json
{
  "name": "my-package",
  "husky": {
    "hooks": {
      "pre-commit": "hover-scripts pre-commit --testCommand 'yarn test:custom' --findRelatedTests"
    }
  }
}
```

### Source Control Hooks

This package includes a couple scripts designed to be run as part of your
project's source control workflow. The most common workflow is using
[Husky](https://github.com/typicode/husky) to manage
[Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), but they
should work with other solutions as well.

#### Husky Example

> ℹ️ See [Husky Documentation](https://typicode.github.io/husky/#/?id=usage) for
> more information

1. Install Husky

   ```bash
   yarn add -D husky
   ```

2. Add `prepare` script

   ```bash
   npm set-script prepare "husky install"
   ```

3. Create hooks

   i. 📂 **.husky/pre-commit**

   ```bash
   yarn husky add .husky/pre-commit "yarn hover-scripts pre-commit"
   ```

   ii. 📂 **.husky/commit-msg**

   ```bash
   yarn husky add .husky/commit-msg "yarn hover-scripts commit-msg"
   ```

## License

MIT

## Maintenance

This project is actively maintained by engineers at
[@hoverinc][hover-github-link] 😀.

[hover-github-link]: https://github.com/hoverinc
[node-link]: https://nodejs.org
[npm-link]: https://www.npmjs.com/
[react-scripts-link]:
  https://github.com/facebook/create-react-app/tree/master/packages/react-scripts
[build-badge]:
  https://github.com/hoverinc/hover-javascript/actions/workflows/build.yml/badge.svg
[build-link]:
  https://github.com/hoverinc/hover-javascript/actions/workflows/build.yml
[conventional-commits-badge]:
  https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-link]: https://conventionalcommits.org
[coverage-link]: https://codecov.io/github/hoverinc/hover-javascript
[coverage-badge]:
  https://img.shields.io/codecov/c/github/hoverinc/hover-javascript.svg
[maintenance-badge]:
  https://img.shields.io/badge/maintenance-active-247ddc?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAcCAYAAACUJBTQAAAB1ElEQVRIibWWPUtdQRCGH0VNF/wCCVjYCxr/gZWdhYVgLQYbm/wACTYxxA8SSBDtbKwUbfQWkiJFAgkkmHBBY6U2CXaCGlDDG1buxePOnt17bsgD28zOzjtnZvbuRVKR1SFpVdKepEe1njOGnOWCz0q60B1lSa05/oVE2iTNSfqdCZ7lSyWB0NmkSJekeUmXJqzlayWZUJxckUUTJs23mFAjlhNjSdMHfAQ6g54hZUnDdXyN44ek7iKNH4w0PMaeX7pQ8Ox6HQkWww3Dw1hPWoAJ4BxoB4aNR5oB4APQ5vekUdITSceZDLcreyORrGPcfpEL0CBpVNJRwLmUSWLS7NbGpju8FXEteT2qR+jQ9aS3QK2XgUljjXPpRC6iLpYV4KmxRghNVy28Aqb+t4jjLbBhrAH+RcRxZSwBUiINxlIHKZE/xlIHTTlHBDwHjoDPwHtgF/gEnBnvFJVfzSrXkpYyfxKGvIu14F3ONXP1LOWmzEPjpuWl92j55XyQyDnEjRN5AbwD9gMOPkV7tAPMOJE3ZuuOFmOpjS3gGfCdQDl8fgGnGVtzwt8F7wdGqgKOvOmq4iarB3gMjAFlb78qug5MAwehIO4tKViJe4wDP4FSrgfwF/ntR8JxRSf3AAAAAElFTkSuQmCC
[maintenance-link]: https://github.com/hoverinc/hover-javascript#maintenance
[license-badge]: https://img.shields.io/npm/l/@hover/javascript.svg
[license-link]: https://github.com/hoverinc/hover-javascript/blob/master/LICENSE
[node-link]: https://nodejs.org/en/download/
[node-badge]: https://img.shields.io/badge/node-v14.17.4-green
[prettier-badge]:
  https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier
[prettier-link]: https://prettierjs.org/en/download/
[package-badge]: https://img.shields.io/npm/v/@hover/javascript.svg
[package-link]: https://www.npmjs.com/package/@hover/javascript
