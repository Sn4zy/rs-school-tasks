import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TERMS_LABEL } from '../forms/shared/formFields';

export const testImage = new File(['avatar'], 'avatar.png', { type: 'image/png' });

export const validSubmission = {
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
  gender: 'female' as const,
  acceptedTerms: true,
  country: 'United States',
};

export async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), validSubmission.name);
  await user.type(screen.getByLabelText('Age'), String(validSubmission.age));
  await user.type(screen.getByLabelText('Email'), validSubmission.email);
  await user.click(screen.getByLabelText('Female'));
  await user.type(screen.getByLabelText('Password'), 'Aa1!');
  await user.type(screen.getByLabelText('Confirm password'), 'Aa1!');
  await user.type(screen.getByLabelText('Country'), validSubmission.country);
  await user.upload(screen.getByLabelText('Profile image'), testImage);
  await user.click(screen.getByLabelText(TERMS_LABEL));
}
