import { describe, expect, it } from 'vitest'

import { getReadableQueryError } from '../utils/rtkQueryError.ts'

describe('getReadableQueryError', () => {
  it('returns null when error is undefined', () => {
    expect(getReadableQueryError(undefined, 'Fallback')).toBeNull()
  })

  it('reads message from FetchBaseQueryError data string', () => {
    expect(
      getReadableQueryError({ status: 404, data: 'Pokemon not found' }, 'Could not load data.'),
    ).toBe('Pokemon not found')
  })

  it('reads message from error object data field (mock shape)', () => {
    expect(getReadableQueryError({ data: 'Network failure' }, 'Could not load data.')).toBe(
      'Network failure',
    )
  })

  it('returns HTTP status suffix when only status is available', () => {
    expect(getReadableQueryError({ status: 500, data: undefined }, 'Could not load data.')).toBe(
      'Could not load data. (HTTP 500).',
    )
  })

  it('maps FETCH_ERROR to a network message', () => {
    expect(getReadableQueryError({ status: 'FETCH_ERROR' }, 'Could not load data.')).toBe(
      'Network error. Please try again.',
    )
  })

  it('returns fallback for empty error objects', () => {
    expect(getReadableQueryError({}, 'Could not load details.')).toBe('Could not load details.')
  })
})
