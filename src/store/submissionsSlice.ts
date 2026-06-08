import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSource, FormSubmission, FormSubmissionData } from '../types/submission';

interface SubmissionsState {
  items: FormSubmission[];
}

const initialState: SubmissionsState = {
  items: [],
};

interface AddSubmissionPayload {
  source: FormSource;
  data: FormSubmissionData;
}

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<AddSubmissionPayload>) => {
      state.items.unshift({
        id: crypto.randomUUID(),
        source: action.payload.source,
        submittedAt: new Date().toISOString(),
        data: action.payload.data,
        isNew: true,
      });
    },
    clearSubmissionHighlight: (state, action: PayloadAction<string>) => {
      const submission = state.items.find((item) => item.id === action.payload);

      if (submission) {
        submission.isNew = false;
      }
    },
  },
});

export const { addSubmission, clearSubmissionHighlight } = submissionsSlice.actions;
export const submissionsReducer = submissionsSlice.reducer;

export const selectAllSubmissions = (state: { submissions: SubmissionsState }): FormSubmission[] =>
  state.submissions.items;
