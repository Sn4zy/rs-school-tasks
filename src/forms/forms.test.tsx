import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { HookForm } from './HookForm';
import { UncontrolledForm } from './UncontrolledForm';
import { selectAllSubmissions } from '../store/submissionsSlice';
import { renderWithStore } from '../test/test-utils';
import { createFieldIds, TERMS_LABEL } from './shared/formFields';

const uncontrolledFieldIds = createFieldIds('uncontrolled');
const hookFieldIds = createFieldIds('hook');

const testImage = new File(['avatar'], 'avatar.png', { type: 'image/png' });

const expectedData = {
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
  gender: 'female' as const,
  acceptedTerms: true,
  country: 'United States',
  imageBase64: expect.stringContaining('data:image/png;base64,'),
};

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), expectedData.name);
  await user.type(screen.getByLabelText('Age'), String(expectedData.age));
  await user.type(screen.getByLabelText('Email'), expectedData.email);
  await user.click(screen.getByLabelText('Female'));
  await user.type(screen.getByLabelText('Password'), 'Aa1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Aa1!');
  await user.type(screen.getByLabelText('Country'), expectedData.country);
  await user.upload(screen.getByLabelText('Profile image'), testImage);
  await user.click(screen.getByLabelText(TERMS_LABEL));
}

describe('UncontrolledForm', () => {
  it('renders all fields with labels connected via htmlFor', () => {
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveAttribute('id', uncontrolledFieldIds.name);
    expect(screen.getByLabelText('Age')).toHaveAttribute('id', uncontrolledFieldIds.age);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', uncontrolledFieldIds.email);
    expect(screen.getByLabelText('Password')).toHaveAttribute('id', uncontrolledFieldIds.password);
    expect(screen.getByLabelText('Confirm password')).toHaveAttribute(
      'id',
      uncontrolledFieldIds.confirmPassword
    );
    expect(screen.getByLabelText('Country')).toHaveAttribute('id', uncontrolledFieldIds.country);
    expect(screen.getByLabelText('Profile image')).toHaveAttribute('id', uncontrolledFieldIds.image);
    expect(screen.getByLabelText(TERMS_LABEL)).toHaveAttribute(
      'id',
      uncontrolledFieldIds.acceptedTerms
    );
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
    expect(submissions[0].data).toEqual(expectedData);
  });

  it('shows password strength requirements', async () => {
    const user = userEvent.setup();
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), 'Aa1!');

    expect(screen.getByText('1 number')).toHaveClass('password-strength-met');
    expect(screen.getByText('1 uppercase letter')).toHaveClass('password-strength-met');
    expect(screen.getByText('1 lowercase letter')).toHaveClass('password-strength-met');
    expect(screen.getByText('1 special character')).toHaveClass('password-strength-met');
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
    expect(submissions[0].data).toEqual(expectedData);
  });
});
