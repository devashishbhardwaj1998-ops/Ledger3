# Ledger – Production & Review Auditor

Reconciles the **Data Pull (time entry) sheet** against the **Daily Planning sheet**
and flags discrepancies per analyst. Runs entirely in the browser.

## Categories audited (edit in `src/config/mapping.ts`)

| Axis       | Daily Planning Sheet | Data Pull "Type"         |
|------------|----------------------|--------------------------|
| Production | Full                 | full                     |
| Production | Limited              | limited                  |
| Production | Semi                 | semiCurated              |
| Production | Minimal *(ignored)*  | —                        |
| Review     | Full first           | firstReview              |
| Review     | Full final           | finalReviewFull          |
| Review     | Limited final        | finalReviewLimited       |
| Review     | Semi Final           | finalReviewSemiCurated   |

Matching key: analyst + asset name (normalised) + category. Findings: category mismatch,
status not "Done", missing in either sheet, unrecognized label (strict mode).

**Strict label matching** (default, toggle in the UI): spelling/case differences such as
`semicurated` or `Semi final` are flagged with the expected value instead of silently matched.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run lint    # type check
npm run build
```
Inputs: Data Pull as .xlsx/.csv; Daily Planning as a Google Sheet link
(shared "Anyone with the link can view") or .xlsx/.csv.
