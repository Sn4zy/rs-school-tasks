import { createSlice } from '@reduxjs/toolkit';

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Poland',
  'Ukraine',
  'Japan',
  'Australia',
  'Brazil',
  'India',
  'Mexico',
  'Netherlands',
] as const;

interface CountriesState {
  list: readonly string[];
}

const initialState: CountriesState = {
  list: COUNTRIES,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const countriesReducer = countriesSlice.reducer;

export const selectCountries = (state: { countries: CountriesState }): readonly string[] =>
  state.countries.list;
