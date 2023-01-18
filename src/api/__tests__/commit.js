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

  describe('dirs', () => {
    test('without prefix', () => {
      const result = ls.dirs(`${fixtures}/ls/dirs`)

      const expected = ['.baz', 'bar', 'foo']

      expect(result.sort()).toEqual(expected.sort())
    })

    test('with prefix', () => {
      const result = ls.dirs(`${fixtures}/ls/dirs`, 'prefix')

      const expected = ['prefix/.baz', 'prefix/bar', 'prefix/foo']

      expect(result.sort()).toEqual(expected.sort())
    })
  })
})
