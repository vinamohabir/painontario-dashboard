# AI grader

Auto-grades Pain Ontario ED applicant rows in the Google Sheet against Arun's 5-criterion rubric (Strategy / Start-up / Fundraising / Health / Equity, each 1-5).

Runs from GitHub Actions every 15 minutes. Each run scans the `Applications` tab, picks up to 10 rows where `AI score` is empty, sends each applicant's profile to Anthropic Claude, writes back `AI score` (0-100), `AI summary` (S5 U4 F3 H5 E4 - <prose>), `AI flag` (one of: Strong all-round, Strong fundraising + equity, Earlier-career, Out of province, etc).

## Setup (one-time, by Vina)

### 1. Create a Google Cloud service account

1. Go to https://console.cloud.google.com → pick or create a project (e.g. `pain-ontario-grader`)
2. APIs & Services → Library → search "Google Sheets API" → **Enable**
3. APIs & Services → Credentials → **Create credentials** → Service account
4. Name: `pain-ontario-grader` → **Done**
5. Click the new service account → Keys tab → **Add key** → JSON → save the downloaded file
6. Copy the service account email (looks like `pain-ontario-grader@<project>.iam.gserviceaccount.com`)

### 2. Share the sheet with that service account

1. Open the ED Applications sheet
2. Click **Share** → paste the service account email → set to **Editor** → uncheck "Notify people"
3. The grader will write back to columns P/Q/R via this access

### 3. Add GitHub repo Secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

- `ANTHROPIC_API_KEY` — your Anthropic API key (`sk-ant-api03-...`)
- `GOOGLE_SERVICE_ACCOUNT_JSON` — entire contents of the JSON file from step 1.5 (paste raw JSON, not base64)

### 4. Watch it work

1. GitHub repo → **Actions** tab → "AI grader (Pain Ontario ED applicants)" → click **Run workflow** to trigger immediately
2. After ~30 seconds, the Sheet should have AI columns filled for any ungraded rows

After that, every 15 minutes the workflow runs automatically and grades any new submissions Make.com adds to the sheet.

## Tweaking

- **Pause grading**: GitHub repo → Actions → AI grader → "..." → Disable workflow
- **Change cadence**: edit `.github/workflows/ai-grader.yml` `cron` value
- **Change rubric**: edit `SYSTEM_PROMPT` in `ai-grader.mjs`
- **Change cap**: edit `MAX_PER_RUN` env in the workflow yml (default 10/run)
- **Change model**: edit `MODEL` env in the workflow yml (default `claude-opus-4-7`)

## Cost estimate

Each row uses ~1 Anthropic API call. With Claude Opus 4.7 at typical applicant-text length (~500 input tokens, ~600 output tokens), that's roughly $0.06 per applicant. 50 applicants ≈ $3. The 15-min cron itself is free on GitHub Actions for public repos; this repo is public.

## Errors

If a row fails to grade, the `AI flag` cell gets `grader-error: <reason>` so you can see what happened in the Sheet without checking GitHub Actions logs.
