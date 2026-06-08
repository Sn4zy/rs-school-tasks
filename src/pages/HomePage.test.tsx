import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor, act } from '@testing-library/react';
import { HomePage } from './HomePage';
import { renderWithStore } from '../test/test-utils';
import { fillValidForm, validSubmission } from '../test/formTestHelpers';
import { selectAllSubmissions } from '../store/submissionsSlice';

describe('HomePage submission flow', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('closes the modal, displays submitted data, and highlights the newest card', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Open uncontrolled form' }));
    expect(screen.getByTestId('modal-dialog')).toBeInTheDocument();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => {
      expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
    });

    const card = screen.getByTestId('submission-card');
    expect(card).toHaveClass('is-new');
    expect(screen.getByText(validSubmission.name)).toBeInTheDocument();
    expect(screen.getByText(validSubmission.country)).toBeInTheDocument();
    expect(selectAllSubmissions(store.getState())).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(card).not.toHaveClass('is-new');
  });

  it('reopens an empty form after a successful submission', async () => {
    const user = userEvent.setup();
    renderWithStore(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));
    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit profile' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => {
      expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Country')).toHaveValue('');
  });
});
