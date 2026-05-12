# Tests

## Running Tests

```bash
npm test
```

## Test Files

### `__tests__/auditEngine.test.ts`
Tests for the core audit engine logic.

| Test | What it covers |
|------|---------------|
| returns optimal for correctly priced plan | Verifies that a user paying the correct price gets 0 savings and "Optimal" status |
| detects overpaying vs expected price | Verifies that overpaying triggers a savings recommendation |
| recommends downgrade for small team on business plan | Verifies that 2 users on Business plan get a downgrade recommendation |
| calculates annual savings correctly | Verifies that annual savings = monthly savings x 12 |
| suggests cursor for coding use case over chatgpt | Verifies that coding use case triggers Cursor recommendation over ChatGPT |

## Results
All 5 tests pass. Run `npm test` to verify.