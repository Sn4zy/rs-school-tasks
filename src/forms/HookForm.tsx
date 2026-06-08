import { useForm } from 'react-hook-form';
import { addSubmission } from '../store/submissionsSlice';
import { useAppDispatch } from '../store/hooks';
import type { BasicFormValues, Gender } from '../types/submission';
import './HookForm.css';

interface HookFormProps {
  onSuccess: () => void;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

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
      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="hook-name">
          Name
        </label>
        <input
          id="hook-name"
          className="profile-form__input"
          type="text"
          autoComplete="name"
          {...register('name')}
        />
      </div>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="hook-age">
          Age
        </label>
        <input
          id="hook-age"
          className="profile-form__input"
          type="number"
          min="0"
          inputMode="numeric"
          {...register('age')}
        />
      </div>

      <div className="profile-form__field">
        <label className="profile-form__label" htmlFor="hook-email">
          Email
        </label>
        <input
          id="hook-email"
          className="profile-form__input"
          type="email"
          autoComplete="email"
          {...register('email')}
        />
      </div>

      <fieldset className="profile-form__fieldset">
        <legend className="profile-form__legend">Gender</legend>
        <div className="profile-form__radio-group">
          {GENDER_OPTIONS.map((option) => (
            <label key={option.value} className="profile-form__radio-option">
              <input type="radio" value={option.value} {...register('gender')} />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="profile-form__checkbox-option">
        <input type="checkbox" {...register('acceptedTerms')} />
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
