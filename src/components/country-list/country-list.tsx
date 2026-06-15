import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

const LIST_HEIGHT = 600;
const ITEM_HEIGHT = 320;

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

type RowData = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const CountryRow = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<RowData>) => {
  const country = countries[index];

  return (
    <div style={style} className={styles.listItem}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const query = searchQuery.toLowerCase();

      return countries
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(query);
          const matchesRegion =
            !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          }

          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        });
    }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const rowProps = useMemo<RowData>(
      () => ({
        countries: filteredCountries,
        selectedYear,
        selectedColumns,
      }),
      [filteredCountries, selectedYear, selectedColumns]
    );

    if (filteredCountries.length === 0) {
      return <div className={styles.countryList}>No countries found</div>;
    }

    return (
      <div className={styles.countryList}>
        <List
          rowCount={filteredCountries.length}
          rowHeight={ITEM_HEIGHT}
          rowComponent={CountryRow}
          rowProps={rowProps}
          style={{ height: LIST_HEIGHT, width: '100%' }}
        />
      </div>
    );
  }
);

CountryList.displayName = 'CountryList';
