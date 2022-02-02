import eslint from '../eslintrc'
import eslintStrict from '../eslintrc-strict'
import eslintReact from '../eslintrc-react'

import {
  winPathSerializer,
  relativePathSerializer,
} from '../../test/helpers/serializers'

expect.addSnapshotSerializer(winPathSerializer)
expect.addSnapshotSerializer(relativePathSerializer)

test('ESLint configuration', () => {
  expect(eslint).toMatchSnapshot()
})

test('Strict ESLint configuration', () => {
  expect(eslintStrict).toMatchSnapshot()
})

test('ESLint React configuration', () => {
  expect(eslintReact).toMatchSnapshot()
})
