import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { SubmissionCard } from './SubmissionCard';
import { createTestStore, renderWithStore } from '../../test/test-utils';
import { addSubmission, selectAllSubmissions } from '../../store/submissionsSlice';

describe('SubmissionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays submitted profile data and image', () => {
    const store = createTestStore();
    store.dispatch(
      addSubmission({
        source: 'uncontrolled',
        data: {
          name: 'Alice',
          age: 28,
          email: 'alice@example.com',
          gender: 'female',
          acceptedTerms: true,
          country: 'United States',
          imageBase64: 'data:image/png;base64,abc',
        },
      })
    );

    const [submission] = selectAllSubmissions(store.getState());
    renderWithStore(<SubmissionCard submission={submission} />, { store });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Profile of Alice' })).toHaveAttribute(
      'src',
      'data:image/png;base64,abc'
    );
  });

  it('highlights new submissions and clears the highlight after three seconds', () => {
    const store = createTestStore();
    store.dispatch(
      addSubmission({
        source: 'hook-form',
        data: {
          name: 'Bob',
          age: 31,
          email: 'bob@example.com',
          gender: 'male',
          acceptedTerms: true,
          country: 'Canada',
          imageBase64: 'data:image/png;base64,xyz',
        },
      })
    );

    const [submission] = selectAllSubmissions(store.getState());
    renderWithStore(<SubmissionCard submission={submission} />, { store });

    const card = screen.getByTestId('submission-card');
    expect(card).toHaveClass('is-new');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(selectAllSubmissions(store.getState())[0]?.isNew).toBe(false);
  });
});
