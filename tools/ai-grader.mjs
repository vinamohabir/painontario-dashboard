/* Pain Ontario ED applicant auto-grader.
 *
 * Reads the ED Applications Sheet via Google Sheets API (service account auth),
 * finds rows where AI score is empty, calls Anthropic Claude with Arun's
 * 5-criterion rubric, writes AI score / AI summary / AI flag back per row.
 *
 * Runs every 15 min via .github/workflows/ai-grader.yml. Cap MAX_PER_RUN per
 * run to keep API + sheet quota gentle.
 *
 * Required env:
 *   ANTHROPIC_API_KEY              — Anthropic API key (sk-ant-...)
 *   GOOGLE_SERVICE_ACCOUNT_JSON    — full JSON of a GCP service account that
 *                                     has Editor access to the sheet
 *   SHEET_ID                       — spreadsheet ID
 *   SHEET_TAB                      — tab name (default: Applications)
 *   MODEL                          — Anthropic model (default: claude-opus-4-7)
 *   MAX_PER_RUN                    — cap rows graded per run (default: 10)
 */
import { google } from "googleapis";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SA_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const SHEET_ID = process.env.SHEET_ID;
const SHEET_TAB = process.env.SHEET_TAB || "Applications";
const MODEL = process.env.MODEL || "claude-opus-4-7";
const MAX_PER_RUN = parseInt(process.env.MAX_PER_RUN || "10", 10);

if (!ANTHROPIC_KEY) throw new Error("Missing ANTHROPIC_API_KEY");
if (!SA_JSON) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
if (!SHEET_ID) throw new Error("Missing SHEET_ID");

const SYSTEM_PROMPT = `You are scoring a Founding Executive Director applicant for Pain Ontario, a small Ontario-based chronic-pain nonprofit, against a 5-criterion rubric. Each criterion is scored 1-5.

Strategy: vision, strategic thinking, ability to set 18-month direction
Start-up: experience standing up programs or organizations from scratch
Fundraising: track record raising philanthropic and project funding
Health: pain, disability, or Ontario-health-system experience preferred
Equity: lived experience, equity-deserving community track record, structural-determinants-of-health framing

Return ONLY valid JSON with this exact shape (no prose before or after):
{
  "scores": {"strategy": 1-5, "startup": 1-5, "fundraising": 1-5, "health": 1-5, "equity": 1-5},
  "rationale": {"strategy": "one sentence", "startup": "one sentence", "fundraising": "one sentence", "health": "one sentence", "equity": "one sentence"},
  "overall": 0-100 integer (sum of scores * 4),
  "summary": "2-sentence narrative naming top strength and biggest gap, written for board members reviewing applicants",
  "flag": "ONE phrase from: Strong all-round | Strong strategy | Strong fundraising + equity | Strong equity lens | Strong fundraising | Earlier-career | Not ED-shaped | Adjacent sector | Verify multiple gaps | Verify fundraising signal | Verify equity signal | Out of province"
}

Conventions:
- If Ontario-resident is "No" or city is outside Ontario, flag must be "Out of province"
- Audit-style summary should follow the shape "S{score} U{score} F{score} H{score} E{score} - <2-sentence summary>" where U is start-up`;

async function callAnthropic(applicant) {
  const userContent = [
    `Name: ${applicant.firstName} ${applicant.lastName}`,
    `City: ${applicant.city}`,
    `Ontario resident: ${applicant.ontarioResident}`,
    `Why this role: ${applicant.whyThisRole}`,
    `LinkedIn / portfolio: ${applicant.linkedin}`,
    `How heard: ${applicant.howHeard}`,
    `Resume URL: ${applicant.resumeUrl}`,
    `Cover letter URL: ${applicant.coverUrl}`
  ].join("\n");

  const body = {
    model: MODEL,
    max_tokens: 900,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }]
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err.slice(0, 400)}`);
  }
  const data = await res.json();
  const text = (data.content || []).map(c => c.text || "").join("");
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned);
}

function flagSummary(parsed) {
  const s = parsed.scores || {};
  const code = `S${s.strategy} U${s.startup} F${s.fundraising} H${s.health} E${s.equity}`;
  const summary = (parsed.summary || "").trim();
  return `${code} - ${summary}`;
}

async function main() {
  const credentials = JSON.parse(SA_JSON);
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await auth.authorize();
  const sheets = google.sheets({ version: "v4", auth });

  const range = `${SHEET_TAB}!A1:R1000`;
  const read = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  const rows = read.data.values || [];
  if (rows.length < 2) { console.log("No data rows."); return; }

  const header = rows[0];
  const col = name => header.findIndex(h => (h || "").trim() === name);

  const cFirst = col("First name");
  const cLast = col("Last name");
  const cOnt = col("Ontario resident?");
  const cCity = col("City / town");
  const cResume = col("Resume (Drive)");
  const cCover = col("Cover letter (Drive)");
  const cLink = col("LinkedIn / portfolio");
  const cWhy = col("Why this role");
  const cHow = col("How heard");
  const cAi = col("AI score");
  const cSum = col("AI summary");
  const cFlag = col("AI flag");

  if (cAi < 0 || cSum < 0 || cFlag < 0) {
    throw new Error(`Sheet missing AI columns. Need 'AI score', 'AI summary', 'AI flag' headers.`);
  }

  const ungraded = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const first = (r[cFirst] || "").trim();
    const last = (r[cLast] || "").trim();
    if (!first && !last) continue;
    const score = (r[cAi] || "").trim();
    if (score) continue;
    ungraded.push({
      rowIdx: i + 1,
      firstName: first,
      lastName: last,
      ontarioResident: (r[cOnt] || "").trim() || "Yes",
      city: (r[cCity] || "").trim(),
      resumeUrl: (r[cResume] || "").trim(),
      coverUrl: (r[cCover] || "").trim(),
      linkedin: (r[cLink] || "").trim(),
      whyThisRole: (r[cWhy] || "").trim(),
      howHeard: (r[cHow] || "").trim()
    });
    if (ungraded.length >= MAX_PER_RUN) break;
  }

  console.log(`Ungraded rows this run: ${ungraded.length}`);
  if (ungraded.length === 0) return;

  for (const a of ungraded) {
    try {
      console.log(`Grading row ${a.rowIdx}: ${a.firstName} ${a.lastName}`);
      const parsed = await callAnthropic(a);
      const summary = flagSummary(parsed);
      const updates = [
        { range: `${SHEET_TAB}!${colLetter(cAi + 1)}${a.rowIdx}`, values: [[String(parsed.overall || "")]] },
        { range: `${SHEET_TAB}!${colLetter(cSum + 1)}${a.rowIdx}`, values: [[summary]] },
        { range: `${SHEET_TAB}!${colLetter(cFlag + 1)}${a.rowIdx}`, values: [[parsed.flag || ""]] }
      ];
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { valueInputOption: "USER_ENTERED", data: updates }
      });
      console.log(`  -> ${parsed.overall} | ${parsed.flag}`);
    } catch (e) {
      console.error(`  ! Row ${a.rowIdx} failed: ${e.message}`);
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${SHEET_TAB}!${colLetter(cFlag + 1)}${a.rowIdx}`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [[`grader-error: ${e.message.slice(0, 80)}`]] }
        });
      } catch (e2) { /* ignore */ }
    }
  }

  console.log("Done.");
}

function colLetter(n) {
  let s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}

main().catch(e => { console.error(e); process.exit(1); });
