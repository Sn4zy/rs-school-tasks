import type { FormSubmissionData, Gender } from '../../types/submission';

export function parseSubmissionData(formData: FormData): FormSubmissionData {
  return {
    name: String(formData.get('name') ?? '').trim(),
    age: Number(formData.get('age')),
    email: String(formData.get('email') ?? '').trim(),
    gender: String(formData.get('gender') ?? '') as Gender,
    acceptedTerms: formData.get('acceptedTerms') === 'on',
  };
}
