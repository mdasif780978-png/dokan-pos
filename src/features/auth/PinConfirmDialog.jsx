import { Modal } from '../../components/Modal';
import { useAuth } from '../../auth/AuthProvider';
import { PinEntry } from './PinEntry';
import { usePinGuard } from './usePinGuard';

/** Ask for the owner PIN before a dangerous action (e.g. clearing all data). */
export function PinConfirmDialog({ title, message, onConfirm, onClose }) {
  const { checkPin } = useAuth();
  const guard = usePinGuard(checkPin, onConfirm);
  return (
    <Modal title={title} size="md" onClose={onClose}>
      <p className="danger-note">{message}</p>
      <PinEntry length={guard.pinLength} onSubmit={guard.submit} disabled={guard.locked} message={guard.message} />
    </Modal>
  );
}
