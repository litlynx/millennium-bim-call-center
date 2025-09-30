import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  createSharedComponentsMock,
  registerSharedComponentsMock
} from '../../../__mocks__/sharedComponents';

registerSharedComponentsMock(createSharedComponentsMock);

const [{ default: ConfirmModal }, { default: FraudModal }, { default: SuccessModal }] =
  await Promise.all([
    import('./ConfirmModal'),
    import('./FraudModal'),
    import(new URL('./SuccessModal.tsx', import.meta.url).href)
  ]);

describe('CancelsBlocked modals', () => {
  it('renders ConfirmModal and dispatches confirm/cancel callbacks', () => {
    const handleConfirm = mock(() => {});
    const handleCancel = mock(() => {});

    render(
      <ConfirmModal
        isOpen
        onOpenChange={() => {}}
        title="Ação"
        description="Tem a certeza?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    const modal = screen.getByTestId('modal');
    const modalScope = within(modal);

    expect(modal.getAttribute('data-modal-size')).toBe('md');
    expect(modal.className).toContain('bg-white');
    expect(modalScope.getByTestId('modal-title').textContent).toBe('Ação');
    expect(modalScope.getByTestId('modal-description').textContent).toContain('Tem a certeza?');
    fireEvent.click(screen.getByText('Confirmar'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(handleCancel).toHaveBeenCalledTimes(1);

    const icon = screen.getByTestId('icon-danger');
    expect(icon.getAttribute('data-icon-type')).toBe('danger');
  });

  it('renders FraudModal and notifies choices', () => {
    const handleChoice = mock(() => {});

    render(<FraudModal isOpen onOpenChange={() => {}} onChoice={handleChoice} />);

    const modal = screen.getByTestId('modal');
    const modalScope = within(modal);

    expect(modalScope.getByTestId('modal-title').textContent).toBe('Cancelamento Mobile Banking');
    expect(modal.getAttribute('data-modal-size')).toBe('md');
    fireEvent.click(screen.getByText('Não'));
    fireEvent.click(screen.getByText('Sim'));
    expect(handleChoice).toHaveBeenCalledTimes(2);
    expect(handleChoice).toHaveBeenNthCalledWith(1, false);
    expect(handleChoice).toHaveBeenNthCalledWith(2, true);
  });

  it('renders SuccessModal with message and success icon', () => {
    render(<SuccessModal isOpen onOpenChange={() => {}} message="Tudo certo" />);

    const modal = screen.getByTestId('modal');
    expect(modal.getAttribute('data-modal-size')).toBe('sm');
    expect(modal.className).toContain('bg-white text-center');
    expect(screen.getByText('Tudo certo')).toBeTruthy();
    const icon = screen.getByTestId('icon-check');
    expect(icon.getAttribute('data-icon-type')).toBe('check');
    expect(icon.getAttribute('data-size')).toBe('lg');
  });
});
