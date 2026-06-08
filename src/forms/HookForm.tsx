import { useForm } from 'react-hook-form';
import { addSubmission } from '../store/submissionsSlice';
import { useAppDispatch } from '../store/hooks';
import type { BasicFormValues, Gender } from '../types/submission';
import { createFieldIds, GENDER_OPTIONS, TERMS_LABEL } from './shared/formFields';
import './HookForm.css';

interface HookFormProps {
  onSuccess: () => void;
}

const fieldIds = createFieldIds('hook');

const defaultValues: BasicFormValues = {
  name: '',
  age: '',
  email: '',
  gender: '',
  acceptedTerms: false,
};

export function HookForm({ onSuccess }: HookFormProps) {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<BasicFormValues>({
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (values: BasicFormValues) => {
    dispatch(
      addSubmission({
        source: 'hook-form',
        data: {
          name: values.name.trim(),
          age: Number(values.age),
          email: values.email.trim(),
          gender: values.gender as Gender,
          acceptedTerms: values.acceptedTerms,
        },
      })
    );
    reset(defaultValues);
    onSuccess();
  };

  return (
    <form
      className="profile-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      data-testid="hook-form"
    >
      <div className="field">
        <label className="field-label" htmlFor={fieldIds.name}>
          Name
        </label>
        <input
          id={fieldIds.name}
          className="field-input"
          type="text"
          autoComplete="name"
          {...register('name')}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.age}>
          Age
        </label>
        <input
          id={fieldIds.age}
          className="field-input"
          type="number"
          min="0"
          inputMode="numeric"
          {...register('age')}
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.email}>
          Email
        </label>
        <input
          id={fieldIds.email}
          className="field-input"
          type="email"
          autoComplete="email"
          {...register('email')}
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
                value={option.value}
                {...register('gender')}
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
          className="checkbox-input"
          {...register('acceptedTerms')}
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
