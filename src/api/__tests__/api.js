import cases from 'jest-in-case'
import prettier from 'prettier'
import {format} from '../'

cases(
  'format',
  ({source = 'const id = x => x', options = {}}) => {
    // beforeEach
    format(source, options)

    try {
      expect(prettier.format).toHaveBeenCalledTimes(1)
      expect(prettier.format).toHaveBeenCalledWith(source, expect.any(Object))

      const [call] = prettier.format.mock.calls

      expect(call[1]).toMatchSnapshot()
    } catch (error) {
      throw error
    } finally {
      // afterEach

      prettier.format.mockReset()
      jest.resetModules()
    }
  },
  {
    'calls `prettier.format` with internal Prettier configuration': {},
    'merges provided `options` with internal Prettier configuration': {
      /** @type {import('prettier').Options} */
      options: {printWidth: 100, arrowParens: 'always', parser: 'css'},
    },
  },
)
