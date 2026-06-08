import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import { countriesReducer, selectCountries } from './countriesSlice';
import {
  addSubmission,
  clearSubmissionHighlight,
  selectAllSubmissions,
  submissionsReducer,
} from './submissionsSlice';

describe('submissionsSlice', () => {
  const sampleData = {
    name: 'Alice',
    age: 28,
    email: 'alice@example.com',
    gender: 'female' as const,
    acceptedTerms: true,
  };

  it('adds submissions to the beginning of history', () => {
    const state = submissionsReducer(
      submissionsReducer(undefined, addSubmission({ source: 'uncontrolled', data: sampleData })),
      addSubmission({
        source: 'hook-form',
        data: { ...sampleData, name: 'Bob' },
      })
    );

    expect(state.items).toHaveLength(2);
    expect(state.items[0].source).toBe('hook-form');
    expect(state.items[0].data.name).toBe('Bob');
    expect(state.items[1].source).toBe('uncontrolled');
    expect(state.items[0].isNew).toBe(true);
  });

  it('clears the highlight flag for a submission', () => {
    const withSubmission = submissionsReducer(
      undefined,
      addSubmission({ source: 'uncontrolled', data: sampleData })
    );
    const submissionId = withSubmission.items[0].id;

    const nextState = submissionsReducer(
      withSubmission,
      clearSubmissionHighlight(submissionId)
    );

    expect(nextState.items[0].isNew).toBe(false);
  });

  it('selects all submissions from root state', () => {
    const store = configureStore({
      reducer: {
        submissions: submissionsReducer,
        countries: countriesReducer,
      },
    });

    store.dispatch(addSubmission({ source: 'uncontrolled', data: sampleData }));
    store.dispatch(
      addSubmission({
        source: 'hook-form',
        data: { ...sampleData, name: 'Charlie' },
      })
    );

    const submissions = selectAllSubmissions(store.getState());

    expect(submissions).toHaveLength(2);
    expect(submissions[0].data.name).toBe('Charlie');
  });
});

describe('countriesSlice', () => {
  it('exposes a non-empty countries list', () => {
    const store = configureStore({
      reducer: {
        submissions: submissionsReducer,
        countries: countriesReducer,
      },
    });

    const countries = selectCountries(store.getState());

    expect(countries.length).toBeGreaterThan(0);
    expect(countries).toContain('United States');
  });
});
