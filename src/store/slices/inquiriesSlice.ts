import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  website: string;
  source: string;
  brand_state: string[];
  solve: string[];
  project_details: string;
  timeline: string[];
  created_at: string;
}

interface InquiriesState {
  submissions: ContactSubmission[];
  lastFetched: number | null;
}

const initialState: InquiriesState = {
  submissions: [],
  lastFetched: null,
};

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    setSubmissions: (state, action: PayloadAction<ContactSubmission[]>) => {
      state.submissions = action.payload;
      state.lastFetched = Date.now();
    },
    clearSubmissions: (state) => {
      state.submissions = [];
      state.lastFetched = null;
    }
  },
});

export const { setSubmissions, clearSubmissions } = inquiriesSlice.actions;
export default inquiriesSlice.reducer;
