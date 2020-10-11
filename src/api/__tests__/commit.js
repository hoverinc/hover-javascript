const {ls} = require('../commit')

const fixtures = './src/api/__tests__/__fixtures__'

describe('ls', () => {
  test('configs', () => {
    const result = ls.configs(`${fixtures}/ls/configs`)

    const expected = [
      'configs/.foorc',
      'configs/foo',
      'configs/foo.setup',
      'configs/foo',
    ]

    expect(result.sort()).toEqual(expected.sort())
  })
})
