import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import type { Gender } from '../types/submission';
import { selectCountries } from '../store/countriesSlice';
import { addSubmission } from '../store/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fileToBase64 } from '../utils/imageUtils';
import { CountryAutocomplete } from './shared/CountryAutocomplete';
import { FieldError } from './shared/FieldError';
import { createFieldIds, GENDER_OPTIONS, TERMS_LABEL } from './shared/formFields';
import { createHookFormSchema, type HookFormValues } from './shared/formSchema';
import { PasswordStrengthIndicator } from './shared/PasswordStrengthIndicator';
import './HookForm.css';

interface HookFormProps {
  onSuccess: () => void;
}

const fieldIds = createFieldIds('hook');

const defaultValues: HookFormValues = {
  name: '',
  age: '',
  email: '',
  gender: '',
  acceptedTerms: false,
  password: '',
  confirmPassword: '',
  country: '',
  image: undefined,
};

export function HookForm({ onSuccess }: HookFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const schema = useMemo(() => createHookFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<HookFormValues>({
    resolver: zodResolver(schema) as Resolver<HookFormValues>,
    defaultValues,
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  const onSubmit = async (values: HookFormValues) => {
    const imageFile = values.image?.[0];

    if (!imageFile) {
      return;
    }

    const imageBase64 = await fileToBase64(imageFile);

    dispatch(
      addSubmission({
        source: 'hook-form',
        data: {
          name: values.name.trim(),
          age: Number(values.age),
          email: values.email.trim(),
          gender: values.gender as Gender,
          acceptedTerms: values.acceptedTerms,
          country: values.country.trim(),
          imageBase64,
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
        <FieldError message={errors.name?.message} />
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
        <FieldError message={errors.age?.message} />
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
        <FieldError message={errors.email?.message} />
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
        <FieldError message={errors.gender?.message} />
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.password}>
          Password
        </label>
        <input
          id={fieldIds.password}
          className="field-input"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        <FieldError message={errors.password?.message} />
        <PasswordStrengthIndicator password={passwordValue} />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.confirmPassword}>
          Confirm password
        </label>
        <input
          id={fieldIds.confirmPassword}
          className="field-input"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <CountryAutocomplete
        id={fieldIds.country}
        datalistId={fieldIds.countryList}
        countries={countries}
        error={errors.country?.message}
        {...register('country')}
      />

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.image}>
          Profile image
        </label>
        <input
          id={fieldIds.image}
          className="field-input"
          type="file"
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          {...register('image')}
        />
        <FieldError message={errors.image?.message} />
      </div>

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
      <FieldError message={errors.acceptedTerms?.message} />

      <div className="form-footer">
        <button type="submit" className="submit-button" disabled={!isValid}>
          Submit profile
        </button>
      </div>
    </form>
  );
}
