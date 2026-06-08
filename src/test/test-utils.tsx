import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactElement, ReactNode } from 'react';
import { countriesReducer } from '../store/countriesSlice';
import { submissionsReducer } from '../store/submissionsSlice';

export function createTestStore() {
  return configureStore({
    reducer: {
      submissions: submissionsReducer,
      countries: countriesReducer,
    },
  });
}

interface RenderWithStoreOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithStore(ui: ReactElement, options?: RenderWithStoreOptions) {
  const store = options?.store ?? createTestStore();
  const { store: _store, ...renderOptions } = options ?? {};

  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
