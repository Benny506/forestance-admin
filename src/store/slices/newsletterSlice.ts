import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
}

interface NewsletterState {
  items: NewsletterSubscription[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
}

const initialState: NewsletterState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

// 5 minutes cache expiration
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const fetchNewsletterSubscriptions = createAsyncThunk(
  'newsletter/fetchSubscriptions',
  async (force: boolean = false, { getState }) => {
    const state = getState() as { newsletter: NewsletterState };
    const { lastFetched, status } = state.newsletter;

    if (!force && status === 'succeeded' && lastFetched && (Date.now() - lastFetched < CACHE_EXPIRATION)) {
      return state.newsletter.items;
    }

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as NewsletterSubscription[];
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearNewsletterCache: (state) => {
      state.items = [];
      state.status = 'idle';
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsletterSubscriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewsletterSubscriptions.fulfilled, (state, action: PayloadAction<NewsletterSubscription[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchNewsletterSubscriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch subscriptions';
      });
  }
});

export const { clearNewsletterCache } = newsletterSlice.actions;
export default newsletterSlice.reducer;
