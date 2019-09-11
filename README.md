<div align="center">
<h1>@hover/javascript 🛠📦</h1>

<p>CLI toolbox for common scripts for <del>my</del> <strong>our</strong> projects</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]

## The problem

~~I~~ **We** do a bunch of open source and want to make it easier to maintain so many
projects.

## This solution

This is a CLI that abstracts away all configuration for ~~my~~ **our** open source projects
for linting, testing, building, and more.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Overriding Config](#overriding-config)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
yarn add -D @hover/javascript
```

## Usage

This is a CLI and exposes a bin called `hover-scripts`. You'll find all available scripts in `src/scripts`.

This project actually dogfoods itself. If you look in the `package.json`, you'll
find scripts with `node src {scriptName}`. This serves as an example of some
of the things you can do with `hover-scripts`.

### Overriding Config

Unlike `react-scripts`, `hover-scripts` allows you to specify your own
configuration for things and have that plug directly into the way things work
with `hover-scripts`. There are various ways that it works, but basically if you
want to have your own config for something, just add the configuration and
`hover-scripts` will use that instead of it's own internal config. In addition,
`hover-scripts` exposes its configuration so you can use it and override only
the parts of the config you need to.

This can be a very helpful way to make editor integration work for tools like
ESLint which require project-based ESLint configuration to be present to work.

So, if we were to do this for ESLint, you could create an `.eslintrc` with the
contents of:

```
{"extends": "./node_modules/@hover/javascript/eslint.js"}
```

Or, for `babel`, a `.babelrc` with:

```
{"presets": ["@hover/javascript/babel"]}
```

Or, for `jest`:

```javascript
const {jest: jestConfig} = require('@hover/javascript/jest')
module.exports = Object.assign(jestConfig, {
  // your overrides here

  // for test written in Typescript, add:
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
})
```

> Note: `hover-scripts` intentionally does not merge things for you when you start
> configuring things to make it less magical and more straightforward. Extending
> can take place on your terms. ~~I~~ _Kent_ thinks this is actually a great way to do this.

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://g.codefresh.io/api/badges/pipeline/hoverinc/%40hover%2Fjavascript?type=cf-1
[build]: https://g.codefresh.io/public/accounts/hoverinc/pipelines/5d4cb5d4e41f3722d4dfdb94
[coverage-badge]: https://img.shields.io/codecov/c/github/hoverinc/hover-javascript.svg?style=flat-square
[coverage]: https://codecov.io/github/hoverinc/hover-javascript
[version-badge]: https://img.shields.io/npm/v/@hover/javascript.svg?style=flat-square
[package]: https://www.npmjs.com/package/@hover/javascript
[license-badge]: https://img.shields.io/npm/l/@hover/javascript.svg?style=flat-square
[license]: https://github.com/hoverinc/hover-javascript/blob/master/LICENSE
