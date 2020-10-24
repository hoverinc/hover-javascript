module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'master',
    'next',
    'next-major',
    {name: 'alpha', prerelease: true},
    {name: 'beta', prerelease: true},
  ],
}
