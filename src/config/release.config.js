module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'master',
    'next-major',
    {name: 'next', prerelease: true},
    {name: 'alpha', prerelease: true},
    {name: 'beta', prerelease: true},
  ],
}
