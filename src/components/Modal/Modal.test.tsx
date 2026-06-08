import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

function ModalHarness({ onClose = vi.fn() }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open modal
      </button>
      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); onClose(); }} title="Test modal">
        <p>Modal content</p>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden modal">
        <p>Hidden</p>
      </Modal>
    );

    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
  });

  it('renders through a portal when open', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Visible modal">
        <p>Visible content</p>
      </Modal>
    );

    const dialog = screen.getByTestId('modal-dialog');
    expect(dialog).toBeInTheDocument();
    expect(document.body).toContainElement(dialog);
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading', { name: 'Visible modal' })).toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ModalHarness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
  });

  it('closes when clicking outside the dialog', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ModalHarness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await user.click(screen.getByTestId('modal-overlay'));

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ModalHarness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Open modal' }));
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
  });
});
