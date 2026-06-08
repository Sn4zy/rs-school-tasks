import { z } from 'zod';
import type { Gender } from '../../types/submission';
import { isValidImageSize, isValidImageType, MAX_IMAGE_SIZE_BYTES } from '../../utils/imageUtils';
import { validateEmail } from '../../utils/validateEmail';

const genderSchema = z
  .string()
  .min(1, 'Please select a gender')
  .refine(
    (value): value is Gender => value === 'male' || value === 'female' || value === 'other',
    'Please select a gender'
  );

const sharedFields = {
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .refine(
      (value) =>
        value.charAt(0) === value.charAt(0).toUpperCase() &&
        value.charAt(0) !== value.charAt(0).toLowerCase(),
      'Name must start with an uppercase letter'
    ),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((value) => !Number.isNaN(Number(value)), 'Age must be a number')
    .refine((value) => Number(value) >= 0, 'Age cannot be negative'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .refine(validateEmail, 'Enter a valid email address'),
  gender: genderSchema,
  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: 'You must accept the Terms and Conditions',
  }),
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  country: z.string().trim(),
};

function validateCountry(country: string, countries: readonly string[]) {
  if (!country) {
    return 'Country is required';
  }

  if (!countries.includes(country)) {
    return 'Select a country from the list';
  }

  return null;
}

function validateImageFile(file: File | null) {
  if (!file || file.size === 0) {
    return 'Image is required';
  }

  if (!isValidImageType(file)) {
    return 'Image must be PNG or JPEG';
  }

  if (!isValidImageSize(file)) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`;
  }

  return null;
}

export function createUncontrolledFormSchema(countries: readonly string[]) {
  return z
    .object({
      ...sharedFields,
      country: z.string().trim(),
      imageFile: z.custom<File | null>(),
    })
    .superRefine((data, context) => {
      const countryError = validateCountry(data.country, countries);

      if (countryError) {
        context.addIssue({
          code: 'custom',
          message: countryError,
          path: ['country'],
        });
      }

      const imageError = validateImageFile(data.imageFile);

      if (imageError) {
        context.addIssue({
          code: 'custom',
          message: imageError,
          path: ['imageFile'],
        });
      }
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });
}

export function createHookFormSchema(countries: readonly string[]) {
  return z
    .object({
      ...sharedFields,
      country: z.string().trim(),
      image: z.custom<FileList | undefined>(),
    })
    .superRefine((data, context) => {
      const countryError = validateCountry(data.country, countries);

      if (countryError) {
        context.addIssue({
          code: 'custom',
          message: countryError,
          path: ['country'],
        });
      }

      const imageFile = data.image?.[0] ?? null;
      const imageError = validateImageFile(imageFile);

      if (imageError) {
        context.addIssue({
          code: 'custom',
          message: imageError,
          path: ['image'],
        });
      }
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });
}

export type UncontrolledFormInput = z.infer<ReturnType<typeof createUncontrolledFormSchema>>;

export interface HookFormValues {
  name: string;
  age: string;
  email: string;
  gender: Gender | '';
  acceptedTerms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: FileList | undefined;
}
