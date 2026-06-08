import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { HookForm } from './HookForm';
import { UncontrolledForm } from './UncontrolledForm';
import { selectAllSubmissions } from '../store/submissionsSlice';
import { renderWithStore } from '../test/test-utils';
import { createFieldIds } from './shared/formFields';
import { fillValidForm, validSubmission } from '../test/formTestHelpers';

const uncontrolledFieldIds = createFieldIds('uncontrolled');
const hookFieldIds = createFieldIds('hook');

describe('UncontrolledForm', () => {
  it('renders all fields with labels connected via htmlFor', () => {
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveAttribute('id', uncontrolledFieldIds.name);
    expect(screen.getByLabelText('Password')).toHaveAttribute('id', uncontrolledFieldIds.password);
    expect(screen.getByLabelText('Country')).toHaveAttribute('id', uncontrolledFieldIds.country);
    expect(screen.getByLabelText('Profile image')).toHaveAttribute('id', uncontrolledFieldIds.image);
  });

  it('shows validation errors only after submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderWithStore(<UncontrolledForm onSuccess={onSuccess} />);

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Image is required')).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('stores valid submissions with a base64 image', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<UncontrolledForm onSuccess={onSuccess} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    const submissions = selectAllSubmissions(store.getState());
    expect(submissions).toHaveLength(1);
    expect(submissions[0].source).toBe('uncontrolled');
    expect(submissions[0].data).toEqual(validSubmission);
  });

  it('resets fields after a successful submit', async () => {
    const user = userEvent.setup();
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText('Password')).toHaveValue('');
    });
  });
});

describe('HookForm', () => {
  it('renders all fields with labels connected via htmlFor', () => {
    renderWithStore(<HookForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveAttribute('id', hookFieldIds.name);
    expect(screen.getByLabelText('Password')).toHaveAttribute('id', hookFieldIds.password);
    expect(screen.getByLabelText('Country')).toHaveAttribute('id', hookFieldIds.country);
    expect(screen.getByLabelText('Profile image')).toHaveAttribute('id', hookFieldIds.image);
  });

  it('keeps submit disabled until the form is valid', async () => {
    const user = userEvent.setup();
    renderWithStore(<HookForm onSuccess={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Submit profile' })).toBeDisabled();

    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit profile' })).toBeEnabled();
    });
  });

  it('stores valid submissions with a base64 image', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<HookForm onSuccess={onSuccess} />);

    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit profile' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });

    const submissions = selectAllSubmissions(store.getState());
    expect(submissions).toHaveLength(1);
    expect(submissions[0].source).toBe('hook-form');
    expect(submissions[0].data).toEqual(validSubmission);
  });

  it('resets fields after a successful submit', async () => {
    const user = userEvent.setup();
    renderWithStore(<HookForm onSuccess={vi.fn()} />);

    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit profile' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText('Password')).toHaveValue('');
    });
  });
});
