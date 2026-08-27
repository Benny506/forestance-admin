import { configureStore } from '@reduxjs/toolkit';
import inquiriesReducer from './slices/inquiriesSlice';
import newsletterReducer from './slices/newsletterSlice';

export const store = configureStore({
  reducer: {
    inquiries: inquiriesReducer,
    newsletter: newsletterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
