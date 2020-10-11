<div align="center">
<br>
<img width="200" src="https://user-images.githubusercontent.com/288160/95674568-ed8d6080-0b65-11eb-88be-d119c88ee285.png" alt="Hover Web">
<br>
<h1>hover-javascript</h1>
<p>🧰 Toolbox of scripts and configurations for <strong>JavaScript</strong> and <strong>TypeScript</strong> projects</p></div>

<div align="center">

[![Build Status][build-badge]][build-link]
[![Code Coverage][coverage-badge]][coverage-link]
[![version][package-badge]][package-link]
[![MIT License][license-badge]][license-link]

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
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

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

#### Prettier

Or, for Prettier, a `.prettierrc.js` with:

```js
module.exports = require('@hover/javascript/prettier')
```

#### Jest

Or, for Jest in `jest.config.js`:

> Note: if **ts-jest** is installed, it will automatically be used as the
> `preset`

```js
const config = require('@hover/javascript/jest')

module.exports = {
  ...config,
  coverageThreshold: null,
}
```

> Note: `hover-scripts` intentionally does not merge things for you when you
> start configuring things to make it less magical and more straightforward.
> Extending can take place on your terms. ~~I~~ _Kent_ think[s] this is actually
> a great way to do this.
>
> For the record, so do I (Jamie)

## LICENSE

MIT

[react-scripts-link]:
  https://github.com/facebook/create-react-app/tree/master/packages/react-scripts
[build-badge]:
  https://g.codefresh.io/api/badges/pipeline/hoverinc/npm%2Fjavascript?type=cf-1
[build-link]:
  https://g.codefresh.io/public/accounts/hoverinc/pipelines/5d4cb5d4e41f3722d4dfdb94
[coverage-badge]:
  https://img.shields.io/codecov/c/github/hoverinc/hover-javascript.svg
[coverage-link]: https://codecov.io/github/hoverinc/hover-javascript
[license-badge]: https://img.shields.io/npm/l/@hover/javascript.svg
[license-link]: https://github.com/hoverinc/hover-javascript/blob/master/LICENSE
[package-badge]: https://img.shields.io/npm/v/@hover/javascript.svg
[package-link]: https://www.npmjs.com/package/@hover/javascript
