const spawn = require('cross-spawn');

const { TRAVIS_BRANCH, CF_BRANCH } = process.env;

const {
  resolveBin,
  getConcurrentlyArgs,
  hasFile,
  pkg,
  parseEnv,
} = require('../utils');

const releaseBranches = ['master', 'next', 'next-major', 'beta', 'alpha'];
const branch = CF_BRANCH || TRAVIS_BRANCH;
const isCI = parseEnv('TRAVIS', false) || parseEnv('CI', false);

const autorelease =
  pkg.version === '0.0.0-semantically-released' &&
  isCI &&
  releaseBranches.includes(branch) &&
  !parseEnv('TRAVIS_PULL_REQUEST', false);

const reportCoverage = hasFile('coverage') && !parseEnv('SKIP_CODECOV', false);

if (!autorelease && !reportCoverage) {
  console.log(
    'No need to autorelease or report coverage. Skipping ci-after-success script...',
  );
} else {
  const result = spawn.sync(
    resolveBin('concurrently'),
    getConcurrentlyArgs(
      {
        codecov: reportCoverage
          ? `echo installing codecov && npx -p codecov@3 -c 'echo running codecov && codecov'`
          : null,
        release: autorelease
          ? `echo installing semantic-release && npx -p semantic-release@17 -c 'echo running semantic-release && semantic-release'`
          : null,
      },
      { killOthers: false },
    ),
    { stdio: 'inherit' },
  );

  process.exit(result.status);
}
