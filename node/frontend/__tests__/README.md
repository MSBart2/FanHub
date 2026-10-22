# Frontend Tests

Jest tests live beside the source under `src/**/*.test.js`, not in this directory:

- `src/pages/Episodes.test.js` — existing episode cache, season-filter, and request-lifecycle regressions.
- `src/pages/CharacterDetail.test.js` — profile data, image/field fallbacks, recorded and empty appearances, loading, 404/failures, and route-change handling.
- `src/pages/Characters.test.js` — ID-based card links, filters, search, empty results, and failures.
- `src/App.test.js` — direct character-detail routing and list/detail/back navigation.

Run the full suite from `node/frontend` in PowerShell:

```powershell
$env:CI='true'
npx react-scripts test --watchAll=false
Remove-Item Env:CI -ErrorAction SilentlyContinue
```

These tests use API mocks, including for data, error, and empty-record scenarios; they do not verify a live backend. Manual browser checks against a live API have not been completed. This suite is not comprehensive coverage of all frontend features.
