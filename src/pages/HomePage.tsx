import { useState } from 'react';
import { Modal } from '../components/Modal/Modal';
import { HookFormPlaceholder } from '../forms/HookFormPlaceholder';
import { UncontrolledFormPlaceholder } from '../forms/UncontrolledFormPlaceholder';
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
    <div className="home-page">
      <header className="home-page__header">
        <div className="home-page__intro">
          <p className="home-page__eyebrow">RS School · React Forms</p>
          <h1 className="home-page__title">Profile submissions</h1>
          <p className="home-page__subtitle">
            Open either form in an accessible modal without leaving this page. Successful
            submissions will appear below as cards.
          </p>
        </div>

        <div className="home-page__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={openUncontrolledModal}
          >
            Open uncontrolled form
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={openHookFormModal}
          >
            Open React Hook Form
          </button>
        </div>
      </header>

      <section className="submissions" aria-labelledby="submissions-heading">
        <div className="submissions__header">
          <h2 id="submissions-heading">Submission history</h2>
          <p>No submissions yet. Complete a form to see your data here.</p>
        </div>
        <div className="submissions__empty" aria-live="polite">
          Waiting for your first profile submission.
        </div>
      </section>

      <Modal
        isOpen={activeModal === 'uncontrolled'}
        onClose={closeModal}
        title="Uncontrolled profile form"
      >
        <UncontrolledFormPlaceholder />
      </Modal>

      <Modal
        isOpen={activeModal === 'hook-form'}
        onClose={closeModal}
        title="React Hook Form profile"
      >
        <HookFormPlaceholder />
      </Modal>
    </div>
  );
}
