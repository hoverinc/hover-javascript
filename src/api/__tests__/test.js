import * as utilsExports from 'ts-jest'
import * as testExports from '../test' // eslint-disable-line import/namespace

const toForwardTsJest = ['pathsToModuleNameMapper', 'createJestPreset']

describe('re-exporting ts-jest utils', () => {
  test.each(
    Object.entries(utilsExports).filter(([key]) =>
      toForwardTsJest.includes(key),
    ),
  )('forwards `%s` export', (exportName, exportValue) => {
    expect(testExports).toHaveProperty(exportName, exportValue)
  })
})
