import { describe, expect, it } from 'vitest';
import { fileToBase64, isValidImageSize, isValidImageType } from './imageUtils';
import { mapZodErrors } from '../forms/shared/mapZodErrors';
import { createUncontrolledFormSchema } from '../forms/shared/formSchema';
import { getPasswordStrength } from './passwordStrength';
import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  it('accepts a basic valid email structure', () => {
    expect(validateEmail('alice@example.com')).toBe(true);
  });

  it('rejects emails without exactly one @ symbol', () => {
    expect(validateEmail('alice@@example.com')).toBe(false);
    expect(validateEmail('alice.example.com')).toBe(false);
  });

  it('rejects emails with an empty local part or domain without a dot', () => {
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('alice@example')).toBe(false);
  });
});

describe('getPasswordStrength', () => {
  it('tracks number, uppercase, lowercase, and special character requirements', () => {
    expect(getPasswordStrength('Aa1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });
});

describe('imageUtils', () => {
  it('validates png and jpeg file types', () => {
    const pngFile = new File(['a'], 'photo.png', { type: 'image/png' });
    const jpegFile = new File(['a'], 'photo.jpg', { type: 'image/jpeg' });
    const textFile = new File(['a'], 'notes.txt', { type: 'text/plain' });

    expect(isValidImageType(pngFile)).toBe(true);
    expect(isValidImageType(jpegFile)).toBe(true);
    expect(isValidImageType(textFile)).toBe(false);
  });

  it('validates image size', () => {
    const smallFile = new File(['a'], 'photo.png', { type: 'image/png' });
    const largeFile = new File([new ArrayBuffer(1024 * 1024 + 1)], 'large.png', {
      type: 'image/png',
    });

    expect(isValidImageSize(smallFile)).toBe(true);
    expect(isValidImageSize(largeFile)).toBe(false);
  });

  it('converts an image file to base64', async () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const result = await fileToBase64(file);

    expect(result).toContain('data:image/png;base64,');
  });
});

describe('mapZodErrors', () => {
  it('maps the first zod issue per field', () => {
    const schema = createUncontrolledFormSchema(['United States']);
    const result = schema.safeParse({
      name: '',
      age: '',
      email: 'invalid',
      gender: '',
      acceptedTerms: false,
      password: '',
      confirmPassword: '',
      country: '',
      imageFile: null,
    });

    if (result.success) {
      throw new Error('Expected validation to fail');
    }

    const errors = mapZodErrors(result.error);

    expect(errors.name).toBe('Name is required');
    expect(errors.imageFile).toBe('Image is required');
  });
});
