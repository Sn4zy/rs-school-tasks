import { type FormEvent, useMemo, useRef, useState } from 'react';
import { selectCountries } from '../store/countriesSlice';
import { addSubmission } from '../store/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fileToBase64 } from '../utils/imageUtils';
import { CountryAutocomplete } from './shared/CountryAutocomplete';
import { FieldError } from './shared/FieldError';
import { createFieldIds, GENDER_OPTIONS, TERMS_LABEL } from './shared/formFields';
import { createUncontrolledFormSchema } from './shared/formSchema';
import { mapZodErrors } from './shared/mapZodErrors';
import { PasswordStrengthIndicator } from './shared/PasswordStrengthIndicator';
import './UncontrolledForm.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const fieldIds = createFieldIds('uncontrolled');

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValue, setPasswordValue] = useState('');

  const schema = useMemo(() => createUncontrolledFormSchema(countries), [countries]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageInput = form.elements.namedItem('image');
    const imageFile =
      imageInput instanceof HTMLInputElement && imageInput.files && imageInput.files.length > 0
        ? imageInput.files[0]
        : null;

    const validationInput = {
      name: String(formData.get('name') ?? ''),
      age: String(formData.get('age') ?? ''),
      email: String(formData.get('email') ?? ''),
      gender: String(formData.get('gender') ?? ''),
      acceptedTerms: formData.get('acceptedTerms') === 'on',
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      country: String(formData.get('country') ?? ''),
      imageFile,
    };

    const result = schema.safeParse(validationInput);

    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return;
    }

    setErrors({});

    const imageBase64 = await fileToBase64(imageFile as File);

    dispatch(
      addSubmission({
        source: 'uncontrolled',
        data: {
          name: result.data.name,
          age: Number(result.data.age),
          email: result.data.email,
          gender: result.data.gender,
          acceptedTerms: result.data.acceptedTerms,
          country: result.data.country,
          imageBase64,
        },
      })
    );

    form.reset();
    setPasswordValue('');
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
        <FieldError message={errors.name} />
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
        <FieldError message={errors.age} />
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
        <FieldError message={errors.email} />
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
        <FieldError message={errors.gender} />
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.password}>
          Password
        </label>
        <input
          id={fieldIds.password}
          className="field-input"
          name="password"
          type="password"
          autoComplete="new-password"
          onChange={(event) => setPasswordValue(event.target.value)}
        />
        <FieldError message={errors.password} />
        <PasswordStrengthIndicator password={passwordValue} />
      </div>

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.confirmPassword}>
          Confirm password
        </label>
        <input
          id={fieldIds.confirmPassword}
          className="field-input"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
        <FieldError message={errors.confirmPassword} />
      </div>

      <CountryAutocomplete
        id={fieldIds.country}
        name="country"
        datalistId={fieldIds.countryList}
        countries={countries}
        error={errors.country}
      />

      <div className="field">
        <label className="field-label" htmlFor={fieldIds.image}>
          Profile image
        </label>
        <input
          id={fieldIds.image}
          className="field-input"
          name="image"
          type="file"
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        />
        <FieldError message={errors.imageFile} />
      </div>

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
      <FieldError message={errors.acceptedTerms} />

      <div className="form-footer">
        <button type="submit" className="submit-button">
          Submit profile
        </button>
      </div>
    </form>
  );
}
