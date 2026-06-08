import { type FormEvent, useRef } from 'react';
import { addSubmission } from '../store/submissionsSlice';
import { useAppDispatch } from '../store/hooks';
import type { FormSubmissionData, Gender } from '../types/submission';
import './UncontrolledForm.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

function parseSubmissionData(formData: FormData): FormSubmissionData {
  return {
    name: String(formData.get('name') ?? '').trim(),
    age: Number(formData.get('age')),
    email: String(formData.get('email') ?? '').trim(),
    gender: String(formData.get('gender') ?? '') as Gender,
    acceptedTerms: formData.get('acceptedTerms') === 'on',
  };
}

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
      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="uncontrolled-name">
          Name
        </label>
        <input
          id="uncontrolled-name"
          className="profile-form__input"
          name="name"
          type="text"
          autoComplete="name"
        />
      </div>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="uncontrolled-age">
          Age
        </label>
        <input
          id="uncontrolled-age"
          className="profile-form__input"
          name="age"
          type="number"
          min="0"
          inputMode="numeric"
        />
      </div>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="uncontrolled-email">
          Email
        </label>
        <input
          id="uncontrolled-email"
          className="profile-form__input"
          name="email"
          type="email"
          autoComplete="email"
        />
      </div>

      <fieldset className="profile-form__fieldset">
        <legend className="profile-form__legend">Gender</legend>
        <div className="profile-form__radio-group">
          {GENDER_OPTIONS.map((option) => (
            <label key={option.value} className="profile-form__radio-option">
              <input type="radio" name="gender" value={option.value} />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="profile-form__checkbox-option">
        <input type="checkbox" name="acceptedTerms" />
        <span>I accept the Terms and Conditions</span>
      </label>

      <div className="profile-form__actions">
        <button type="submit" className="profile-form__submit">
          Submit profile
        </button>
      </div>
    </form>
  );
}
