# AI Lead Response System

An automated lead-handling pipeline built with n8n. When someone submits a form, the system stores the lead, uses an LLM to write a genuinely personalised reply, sends it, and notifies the team — with error handling at three levels.

Built in ~2 days as a working system, not a demo.

![Workflow overview](screenshots/workflow-overview.png)

---

## What it does

```
Form submission
      │
      ▼
   Webhook  ──► IF (email validation)
                 │
       valid ────┤──── invalid
                 │           │
                 ▼           ▼
            Airtable    Edit Fields
                 │           │
                 ▼           ▼
          LLM Chain ──► Google Sheets
          (Claude)       (error log)
            │    │
      success   error
            │    │
            ▼    ▼
         Gmail  Slack #alerts
            │
            ▼
      Slack #leads
```

A lead comes in through a webhook. The system validates the email, saves the record, asks Claude to write a reply based on what that specific person asked about, sends it via Gmail, and posts a notification to Slack. Bad emails get logged separately without ever reaching the AI or the mail sender.

End to end: about 5 seconds.

---

## Why an LLM instead of a template

A template system produces the same email for every lead, with the name swapped in. Recipients notice this immediately.

Here the model reads the lead's stated interest and writes accordingly. In testing, a lead who selected "Integrations" received an email with a paragraph about the integration ecosystem — content that exists nowhere in the prompt. A lead asking about pricing got something entirely different.

The distinction matters at scale: five lead types can be handled with five templates, but fifty cannot. With an LLM the template count stays at zero.

The AI does not run the whole pipeline, though. Saving records, sending mail, and notifying the team are deterministic operations and should stay that way. **The structure is automation; only the judgement step is AI.**

---

## Error handling

This is the part most tutorials skip, and the part that decides whether a system survives production.

### Layer 1 — Branching (bad data)

Invalid emails are expected, not exceptional. An IF node with a regex check routes them down a separate path that logs to Google Sheets. They never reach the LLM or the mail sender, so no API budget is wasted and no bounce is generated.

### Layer 2 — Node retry (transient failures)

The LLM node is configured with:

| Setting | Value |
|---|---|
| Retry On Fail | enabled |
| Max Tries | 3 |
| Wait Between Tries | 5000 ms |
| On Error | Continue (using error output) |

Rate limits and timeouts usually resolve on their own. Waiting five seconds between attempts avoids hammering an API that is already struggling.

### Layer 3 — Global error workflow

A separate workflow with an Error Trigger catches anything the first two layers miss — expired credentials, a service going down, unexpected responses. It posts the workflow name, the failing node, and the error message to Slack.

Without this, a failure at 3am is silent.

![Error handling test](screenshots/error-test.png)

---

## Stack

| Component | Choice | Reason |
|---|---|---|
| Orchestration | n8n (self-hosted) | Unlimited executions; Zapier's free tier caps at 100 tasks/month and this workflow uses 6–7 steps per lead |
| LLM | Claude (Anthropic API) | Strong instruction-following for short-form writing |
| Database | Airtable | Fast to set up; would move to Postgres at scale |
| Email | Gmail API | Fine for this volume; SendGrid/Resend above ~500/day |
| Notifications | Slack | Separate channels for leads and alerts |
| Form | Custom HTML | Posts directly to the production webhook |

---

## Testing

Three scenarios, all verified end to end:

| Case | Input | Expected | Result |
|---|---|---|---|
| Valid lead | Real email address | Record created, email delivered, Slack notified | Pass |
| Invalid email | `karim@@gmail` | Logged to Sheets; no record, no email, no notification | Pass |
| API failure | Deliberately broken API key | 3 retries over ~15s, then alert to `#alerts` | Pass |

The third case is the one worth checking. It is easy to build something that works and hard to build something that fails well.

---

## Scaling to 10,000 leads/month

The current setup would break in three places:

**Airtable** — 5 requests/second API limit and low record caps on the free tier. Replace with PostgreSQL or Supabase.

**Gmail** — daily send limits between 500 and 2,000. Move to SendGrid or Resend, sending from a verified domain so deliverability holds.

**n8n itself** — the default single-process mode becomes a bottleneck. Enable queue mode with Redis and run multiple workers.

Beyond that: push webhook payloads into a queue rather than processing them inline, so traffic spikes do not drop leads. Batch similar interests into fewer LLM calls, or route common cases to templates and reserve the model for genuinely varied enquiries. And add monitoring — success and failure counts need somewhere visible to live.

---

## Repository contents

```
├── workflow/
│   └── ai-lead-response.json      # n8n workflow (import-ready)
├── form/
│   └── index.html                 # demo lead capture form
├── screenshots/
│   ├── workflow-overview.png
│   ├── retry-settings.png
│   ├── error-test.png
│   └── email-output.png
└── README.md
```

---

## Setup

1. Import `workflow/ai-lead-response.json` into n8n
2. Create credentials for Anthropic, Google (Sheets + Gmail), Airtable, and Slack
3. Replace the placeholder Airtable base ID, table ID, and Google Sheet ID in the relevant nodes
4. Create Slack channels `#leads` and `#alerts`, then invite the bot to both
5. Set the webhook's Allowed Origins if calling from a browser form
6. Update the webhook URL in `form/index.html`
7. Publish the workflow

Note that a self-hosted n8n instance requires setting up your own Google Cloud OAuth client — enable the Sheets, Drive, and Gmail APIs, add yourself as a test user, and use the redirect URI shown in the n8n credential dialog.

---

## Notes from building this

Two things cost the most time and are worth recording.

**Reference sheets by ID, not name.** Looking up a Google Sheet by name failed repeatedly with "resource not found". Switching to the sheet ID from the URL (`gid=0`) resolved it immediately. Names change; IDs do not.

**Field names have to match exactly.** Webhook data arrives nested under `body`, so `body.name` reaches a Sheets column called `Name` as a mismatch. An Edit Fields node in between renames the fields to match the destination — without it, rows arrive empty.

Also worth knowing: `{{ $json.x }}` reads from the immediately preceding node. To reach further back — the original webhook payload, for instance, after the data has passed through a database node — use `{{ $('Webhook').item.json.body.x }}`.

---

## Demo

*(video link)*

---

Built by **SD Sagar** 
