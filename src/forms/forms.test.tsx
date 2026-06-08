import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { HookForm } from './HookForm';
import { UncontrolledForm } from './UncontrolledForm';
import { selectAllSubmissions } from '../store/submissionsSlice';
import { renderWithStore } from '../test/test-utils';
import { createFieldIds, TERMS_LABEL } from './shared/formFields';
import { parseSubmissionData } from './shared/parseSubmissionData';

const uncontrolledFieldIds = createFieldIds('uncontrolled');
const hookFieldIds = createFieldIds('hook');

const expectedData = {
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
  gender: 'female' as const,
  acceptedTerms: true,
};

async function fillBasicFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), expectedData.name);
  await user.type(screen.getByLabelText('Age'), String(expectedData.age));
  await user.type(screen.getByLabelText('Email'), expectedData.email);
  await user.click(screen.getByLabelText('Female'));
  await user.click(screen.getByLabelText(TERMS_LABEL));
}

describe('UncontrolledForm basic fields', () => {
  it('renders all basic fields with labels connected via htmlFor', () => {
    renderWithStore(<UncontrolledForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveAttribute('id', uncontrolledFieldIds.name);
    expect(screen.getByLabelText('Age')).toHaveAttribute('id', uncontrolledFieldIds.age);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', uncontrolledFieldIds.email);
    expect(screen.getByLabelText('Male')).toHaveAttribute(
      'id',
      uncontrolledFieldIds.gender('male')
    );
    expect(screen.getByLabelText('Female')).toHaveAttribute(
      'id',
      uncontrolledFieldIds.gender('female')
    );
    expect(screen.getByLabelText('Other')).toHaveAttribute(
      'id',
      uncontrolledFieldIds.gender('other')
    );
    expect(screen.getByLabelText(TERMS_LABEL)).toHaveAttribute(
      'id',
      uncontrolledFieldIds.acceptedTerms
    );
  });

  it('collects field values and stores them on submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<UncontrolledForm onSuccess={onSuccess} />);

    await fillBasicFields(user);
    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    const submissions = selectAllSubmissions(store.getState());
    expect(submissions).toHaveLength(1);
    expect(submissions[0].source).toBe('uncontrolled');
    expect(submissions[0].data).toEqual(expectedData);
    expect(onSuccess).toHaveBeenCalledOnce();
  });
});

describe('HookForm basic fields', () => {
  it('renders all basic fields with labels connected via htmlFor', () => {
    renderWithStore(<HookForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveAttribute('id', hookFieldIds.name);
    expect(screen.getByLabelText('Age')).toHaveAttribute('id', hookFieldIds.age);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', hookFieldIds.email);
    expect(screen.getByLabelText('Male')).toHaveAttribute('id', hookFieldIds.gender('male'));
    expect(screen.getByLabelText('Female')).toHaveAttribute('id', hookFieldIds.gender('female'));
    expect(screen.getByLabelText('Other')).toHaveAttribute('id', hookFieldIds.gender('other'));
    expect(screen.getByLabelText(TERMS_LABEL)).toHaveAttribute('id', hookFieldIds.acceptedTerms);
  });

  it('collects field values and stores them on submit', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { store } = renderWithStore(<HookForm onSuccess={onSuccess} />);

    await fillBasicFields(user);
    await user.click(screen.getByRole('button', { name: 'Submit profile' }));

    const submissions = selectAllSubmissions(store.getState());
    expect(submissions).toHaveLength(1);
    expect(submissions[0].source).toBe('hook-form');
    expect(submissions[0].data).toEqual(expectedData);
    expect(onSuccess).toHaveBeenCalledOnce();
  });
});

describe('parseSubmissionData', () => {
  it('maps FormData entries to submission data', () => {
    const formData = new FormData();
    formData.set('name', ' Bob ');
    formData.set('age', '31');
    formData.set('email', ' bob@example.com ');
    formData.set('gender', 'male');
    formData.set('acceptedTerms', 'on');

    expect(parseSubmissionData(formData)).toEqual({
      name: 'Bob',
      age: 31,
      email: 'bob@example.com',
      gender: 'male',
      acceptedTerms: true,
    });
  });
});
