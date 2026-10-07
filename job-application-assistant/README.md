# AI Job Application Assistant (SaaS)

Paste a job post, upload a resume, and get a tailored **cover letter + resume summary** as a PDF in your inbox, in about 15–30 seconds.

Built with n8n, Google Gemini, Gotenberg (HTML → PDF) and Gmail.

> 🇧🇩 Step-by-step setup guide in Bengali: [SETUP-bn.md](SETUP-bn.md)

---

## How it works

```
HTML form (name, email, job post, resume PDF/TXT)
      │  multipart POST
      ▼
   Webhook ──► Validate Input ──(invalid)──► Respond 400
                    │ valid
                    ▼
                 Is PDF? ──yes──► Extract PDF Text ─┐
                    │ no                            ├─► Prepare Data
                    └──────────► Extract TXT Text ──┘        │
                                                             ▼
                                       Gemini (LLM Chain) → JSON
                                       { job_title, company,
                                         resume_summary, cover_letter }
                                                             │
                                                             ▼
                          Build PDF HTML (Code) → HTML to File → Gotenberg → PDF
                                                             │
                                                             ▼
                                Gmail (PDF attached) → Google Sheets log → Respond 200
```

| Requirement from the brief | Where it lives |
|---|---|
| User input form (job post + resume PDF/TXT) | `form/index.html` → `Webhook` |
| Data processing in n8n | `Validate Input`, `Is PDF?`, `Extract … Text`, `Prepare Data` |
| AI generation (OpenAI / Gemini) | `Write Cover Letter & Summary` + `Google Gemini Chat Model` |
| PDF output | `Build PDF HTML` → `HTML to File` → `Generate PDF (Gotenberg)` |
| Email delivery | `Email PDF to User` (Gmail, PDF attached) |
| Optional: usage history | `Log to Google Sheets` |

## Design decisions

- **The AI returns JSON, not prose.** One call produces both documents plus the job title and company, so the PDF and email can be assembled reliably by code.
- **No invented facts.** The prompt only allows facts from the resume. A cover letter with a fake achievement is worse than none.
- **Validation before AI.** Bad emails, empty job posts or missing files are rejected before any API call is spent.
- **Retries.** The LLM node retries 3× with 5 s waits, which absorbs rate limits on the free Gemini tier.
- **Gotenberg for PDFs.** Free, open source, no account, and renders real HTML/CSS in Chromium, so the PDF looks the same as the design.
- **Sheets logging never blocks delivery.** If logging fails the user still gets their PDF.

## Files

```
job-application-assistant/
├── workflow/ai-job-application-assistant.json   # import into n8n
├── form/index.html                              # user-facing form
├── docker-compose.yml                           # n8n + Gotenberg
├── samples/
│   ├── sample-resume.txt                        # test input
│   ├── sample-job-post.txt                      # test input
│   └── sample-output.pdf                        # what the user receives
├── README.md
└── SETUP-bn.md                                  # Bengali setup guide
```

## Quick start

1. `docker compose up -d`, then open http://localhost:5678
2. Import `workflow/ai-job-application-assistant.json`
3. Add credentials: Google Gemini (PaLM) API, Gmail OAuth2, Google Sheets OAuth2
4. Put your Sheet ID in `Log to Google Sheets` (columns: Timestamp, Name, Email, Job Title, Company, Status)
5. Activate the workflow and paste the Production webhook URL into `form/index.html`
6. Test:

```bash
curl -X POST http://localhost:5678/webhook-test/job-application \
  -F "name=Rahim Ahmed" \
  -F "email=you@example.com" \
  -F "job_post=<samples/sample-job-post.txt" \
  -F "resume=@samples/sample-resume.txt"
```

To use OpenAI instead of Gemini, swap the `Google Gemini Chat Model` sub-node for `OpenAI Chat Model`. Nothing else changes.

---

Built by **SD Sagar**
