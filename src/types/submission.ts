export type FormSource = 'uncontrolled' | 'hook-form';

export type Gender = 'male' | 'female' | 'other';

export interface FormSubmissionData {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  country: string;
  imageBase64: string;
}

export interface FormSubmission {
  id: string;
  source: FormSource;
  submittedAt: string;
  data: FormSubmissionData;
  isNew: boolean;
}

