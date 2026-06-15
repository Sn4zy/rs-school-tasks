# Performance Report — CO₂ Emissions Data Explorer

## Test Environment

| Setting | Value |
|---------|-------|
| Branch | `performance` (unoptimized baseline) |
| Build mode | Development (`npm run dev`) |
| Browser | Chrome + React DevTools extension |
| React version | 19.2.0 |
| Dataset | 254 countries |

See [profiling-workflow-guide.md](./profiling-workflow-guide.md) for profiling steps.

---

## Phase 1: Baseline Profiling (Unoptimized)

### Summary

| Interaction | Commit Duration | Render Duration | Slowest Component |
|-------------|-----------------|-----------------|-------------------|
| Sorting countries | 165.3 ms | 165.3 ms | `CountryList` (138.1 ms) |
| Searching for a country | 27.4 ms | 27.4 ms | `YearSelector` (18.2 ms) |
| Selecting a different year | 32.4 ms | 32.4 ms | `YearSelector` (19.7 ms) |
| Toggling columns | 40.1 ms | 40.1 ms | `YearSelector` (23.5 ms) |

> Profiled in development mode. All interactions exceed the 16 ms frame budget. The sort interaction is the most expensive due to full list re-render.

---

### 1. Sorting Countries

**Action:** Change sort field to "Name", then toggle Ascending/Descending.

| Metric | Value |
|--------|-------|
| Commit duration | 165.3 ms |
| Render duration | 165.3 ms |
| Slowest component | `CountryList` — 138.1 ms |

**Findings:**
- `CountryList` re-filters and re-sorts all 254 countries on every sort change
- Hundreds of `CountryCard` children re-render (visible as many small bars in flame chart)
- No memoization — entire list subtree updates

**Flame chart:**

![Profiler — sorting](./screenshots/baseline/profiler-sort.png)

---

### 2. Searching for a Country

**Action:** Type `united` in the search box.

| Metric | Value |
|--------|-------|
| Commit duration | 27.4 ms |
| Render duration | 27.4 ms |
| Slowest component | `YearSelector` — 18.2 ms |

**Findings:**
- Each keystroke updates `App` state and triggers a full tree re-render
- `CountryList` and `CountryCard` still re-render on every keystroke
- Filter runs on all countries with no `useMemo`

**Flame chart:**

![Profiler — search](./screenshots/baseline/profiler-search.png)

---

### 3. Selecting a Different Year

**Action:** Change year from 2020 to 2010.

| Metric | Value |
|--------|-------|
| Commit duration | 32.4 ms |
| Render duration | 32.4 ms |
| Slowest component | `YearSelector` — 19.7 ms |

**Findings:**
- `selectedYear` change in `App` re-renders the entire component tree
- `YearSelector` and all `CountryCard` / `DataTable` components update
- Each card recalculates year-specific data with no memoization

**Flame chart:**

![Profiler — year change](./screenshots/baseline/profiler-year.png)

---

### 4. Toggling Columns

**Action:** Open column modal and toggle one checkbox.

| Metric | Value |
|--------|-------|
| Commit duration | 40.1 ms |
| Render duration | 40.1 ms |
| Slowest component | `YearSelector` — 23.5 ms |

**Findings:**
- `selectedColumns` change re-renders `ColumnModal` and all `DataTable` instances
- Parent `App` state update causes unnecessary sibling re-renders
- No `React.memo` on child components

**Flame chart:**

![Profiler — columns](./screenshots/baseline/profiler-columns.png)

---

## Phase 3: Optimized Profiling (Comparison)

> To be completed after Phase 2 optimizations.

| Interaction | Baseline Commit | Optimized Commit | Improvement (%) |
|-------------|-----------------|------------------|-----------------|
| Sorting countries | 165.3 ms | _TBD_ | _TBD_ |
| Searching for a country | 27.4 ms | _TBD_ | _TBD_ |
| Selecting a different year | 32.4 ms | _TBD_ | _TBD_ |
| Toggling columns | 40.1 ms | _TBD_ | _TBD_ |

```
Improvement (%) = ((baseline − optimized) / baseline) × 100
```

---

## Key Takeaways (Baseline)

1. **Sorting is the worst interaction** — 165 ms render with `CountryList` as the main bottleneck
2. **Cascade re-renders** — any `App` state change re-renders the full component tree
3. **No memoization** — no `useMemo`, `useCallback`, or `React.memo` in the starter code
4. **No virtualization** — all 254 country cards are mounted in the DOM at once

These findings guide the optimizations planned for Phase 2.
