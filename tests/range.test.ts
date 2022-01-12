import { test } from '.'
import * as assert from 'node:assert'

import { range } from '../src/arrays/range'

test('range(0, 3) creates an array ranging from 0 to 3', () => {
    assert.deepStrictEqual(range(0, 3), [0, 1, 2, 3])
})