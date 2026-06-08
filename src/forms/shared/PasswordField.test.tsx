import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(
      <PasswordField
        id="test-password"
        label="Password"
        inputProps={{ name: 'password' }}
      />
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('resets visibility when remounted with a new key', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <PasswordField
        key="password-0"
        id="test-password"
        label="Password"
        inputProps={{ name: 'password' }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');

    rerender(
      <PasswordField
        key="password-1"
        id="test-password"
        label="Password"
        inputProps={{ name: 'password' }}
      />
    );

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });
});
