# Profiling Workflow Guide

## Setup

1. Install [React DevTools](https://react.dev/learn/react-developer-tools)
2. Run `npm run dev` and open `http://localhost:5173`
3. Open DevTools → **Profiler** tab

## For each interaction

1. Click **Record**
2. Perform the interaction (see below)
3. Click **Stop**
4. Select the commit in the timeline
5. Note **commit duration** and **render duration**
6. Screenshot the flame chart → save to `screenshots/baseline/` (Phase 1) or `screenshots/optimized/` (Phase 3)

## Interactions

| # | Interaction | Steps |
|---|-------------|-------|
| 1 | Sorting | Change sort to "Name", click Ascending/Descending |
| 2 | Search | Type `united` in search box |
| 3 | Year | Change year from 2020 to 2010 |
| 4 | Columns | Open column modal, toggle one checkbox |

## Expected bottlenecks (unoptimized app)

- No `useMemo` / `useCallback` / `React.memo`
- `key={index}` in country list
- All 254 country cards render at once (no virtualization)
- Any state change in `App` re-renders the entire list
