import { type FormEvent, useRef } from 'react';
import { addSubmission } from '../store/submissionsSlice';
import { useAppDispatch } from '../store/hooks';
import { parseSubmissionData } from './shared/parseSubmissionData';
import { createFieldIds, GENDER_OPTIONS, TERMS_LABEL } from './shared/formFields';
import './UncontrolledForm.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const fieldIds = createFieldIds('uncontrolled');

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = parseSubmissionData(formData);

    dispatch(addSubmission({ source: 'uncontrolled', data }));
    form.reset();
    onSuccess();
  };

  return (
    <form
      ref={formRef}
      className="profile-form"
      onSubmit={handleSubmit}
      noValidate
      data-testid="uncontrolled-form"
    >
      <div className="field">
        <label className="field-label" htmlFor={fieldIds.name}>
          Name
        </label>
        <input
          id={fieldIds.name}
          className="field-input"
          name="name"
          type="text"
          autoComplete="name"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.age}>
          Age
        </label>
        <input
          id={fieldIds.age}
          className="field-input"
          name="age"
          type="number"
          min="0"
          inputMode="numeric"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.email}>
          Email
        </label>
        <input
          id={fieldIds.email}
          className="field-input"
          name="email"
          type="email"
          autoComplete="email"
        />
      </div>

      <fieldset className="field-group">
        <legend className="field-group-title">Gender</legend>
        <div className="radio-options">
          {GENDER_OPTIONS.map((option) => (
            <div key={option.value} className="radio-option">
              <input
                id={fieldIds.gender(option.value)}
                type="radio"
                name="gender"
                value={option.value}
              />
              <label className="radio-label" htmlFor={fieldIds.gender(option.value)}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="field checkbox-field">
        <input
          id={fieldIds.acceptedTerms}
          type="checkbox"
          name="acceptedTerms"
          className="checkbox-input"
        />
        <label className="checkbox-label" htmlFor={fieldIds.acceptedTerms}>
          {TERMS_LABEL}
        </label>
      </div>

      <div className="form-footer">
        <button type="submit" className="submit-button">
          Submit profile
        </button>
      </div>
    </form>
  );
}
