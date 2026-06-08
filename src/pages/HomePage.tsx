import { useState } from 'react';
import { Modal } from '../components/Modal/Modal';
import { SubmissionsSection } from '../components/SubmissionsSection/SubmissionsSection';
import { HookForm } from '../forms/HookForm';
import { UncontrolledForm } from '../forms/UncontrolledForm';
import '../components/Button/Button.css';
import './HomePage.css';

type ActiveModal = 'uncontrolled' | 'hook-form' | null;

export function HomePage() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const openUncontrolledModal = () => {
    setActiveModal('uncontrolled');
  };

  const openHookFormModal = () => {
    setActiveModal('hook-form');
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="tagline">RS School · React Forms</p>
          <h1 className="page-title">Profile submissions</h1>
          <p className="page-description">
            Open either form in an accessible modal without leaving this page. Successful
            submissions will appear below as cards.
          </p>
        </div>

        <div className="open-form-buttons">
          <button type="button" className="primary-button" onClick={openUncontrolledModal}>
            Open uncontrolled form
          </button>
          <button type="button" className="secondary-button" onClick={openHookFormModal}>
            Open React Hook Form
          </button>
        </div>
      </header>

      <SubmissionsSection />

      <Modal
        isOpen={activeModal === 'uncontrolled'}
        onClose={closeModal}
        title="Uncontrolled profile form"
      >
        <UncontrolledForm onSuccess={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === 'hook-form'}
        onClose={closeModal}
        title="React Hook Form profile"
      >
        <HookForm onSuccess={closeModal} />
      </Modal>
    </div>
  );
}
