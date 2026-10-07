# AI Job Application Assistant — বাংলা Setup Guide 🇧🇩

ভাই, এই guide একদম শূন্য থেকে লেখা। ধাপে ধাপে follow করো, কোনো ধাপ skip করবে না।

---

## 🧠 আগে বুঝে নাও: system-টা কী করে?

সহজ ভাষায়, একজন user ৩টা জিনিস দেবে:
1. নাম আর email
2. Job post-এর text (copy-paste)
3. নিজের resume (PDF বা TXT)

তারপর ১৫-৩০ সেকেন্ডের মধ্যে তার email-এ একটা **PDF** যাবে। PDF-এ থাকবে ওই job-এর জন্য বানানো **cover letter** আর **resume summary**।

### পেছনে কী হয়? (15টা node)

| # | Node | কাজ | Real-life উদাহরণ |
|---|---|---|---|
| 1 | **Webhook** | Form-এর data গ্রহণ করে | দোকানের দরজা, customer এখান দিয়ে ঢোকে |
| 2 | **Validate Input** | Email ঠিক আছে কিনা, job post আছে কিনা, file আছে কিনা দেখে | দারোয়ান, ভুল লোক ঢুকতে দেয় না |
| 3 | **Respond Invalid Input** | কিছু ভুল থাকলে user-কে error দেখায় | "Sorry, form ঠিক করে পূরণ করুন" |
| 4 | **Is PDF?** | Resume PDF নাকি TXT, সেটা চেক করে | রাস্তার মোড়, দুই দিকে ভাগ |
| 5-6 | **Extract PDF/TXT Text** | File থেকে লেখা বের করে | PDF পড়ে text কপি করা |
| 7 | **Prepare Data** | সব data এক জায়গায় গুছিয়ে রাখে | ব্যাগ গোছানো |
| 8-9 | **Write Cover Letter & Summary** + **Gemini** | AI লেখে | তোমার ব্যক্তিগত writer |
| 10 | **Build PDF HTML** | AI-এর লেখা দিয়ে সুন্দর design বানায় | Canva-তে design করা |
| 11 | **HTML to File** | Design-কে file বানায় | Save বাটন চাপা |
| 12 | **Generate PDF (Gotenberg)** | HTML থেকে PDF বানায় | Print → Save as PDF |
| 13 | **Email PDF to User** | Gmail দিয়ে PDF পাঠায় | Courier |
| 14 | **Log to Google Sheets** | কে কবে ব্যবহার করলো, record রাখে | খাতায় হিসাব লেখা |
| 15 | **Respond Success** | Form-এ "Done ✅" দেখায় | "ধন্যবাদ, আবার আসবেন" |

---

## 🛠️ ধাপ ০: যা যা লাগবে

- [ ] **Docker Desktop**: https://www.docker.com/products/docker-desktop (free)
- [ ] **Google Gemini API key**, free: https://aistudio.google.com/apikey
- [ ] **Gmail account**
- [ ] **Google Cloud OAuth**, Gmail আর Sheets connect করতে লাগবে। তোমার আগের lead project-এ এটা করেছিলে, একই নিয়মে হবে।

---

## 🚀 ধাপ ১: n8n + Gotenberg চালু করো

**Gotenberg কী?** এটা একটা free tool। HTML দিলে PDF বানিয়ে দেয়। n8n-এ নিজস্ব কোনো "PDF Generator" node নেই, তাই এটা ব্যবহার করছি। কোনো account লাগে না, টাকাও লাগে না।

1. Docker Desktop চালু করো
2. Terminal বা Command Prompt-এ `job-application-assistant` folder-এ যাও
3. এই command চালাও:
   ```bash
   docker compose up -d
   ```
4. Browser-এ খোলো: **http://localhost:5678**
5. n8n-এ account বানাও (local, শুধু তোমার জন্য)

> ⚠️ আগে থেকে n8n অন্যভাবে চালাচ্ছো? তাহলে শুধু Gotenberg চালাও: `docker run -d -p 3000:3000 gotenberg/gotenberg:8`। তারপর ধাপ ৩-এ URL হবে `http://host.docker.internal:3000/forms/chromium/convert/html` (n8n Docker-এ থাকলে), নইলে `http://localhost:3000/...`।

---

## 📥 ধাপ ২: Workflow import করো

1. n8n-এ **Create Workflow** দাও
2. উপরে ডানদিকে **⋯** মেনু থেকে **Import from File**
3. `workflow/ai-job-application-assistant.json` select করো
4. সব node একসাথে দেখা যাবে 🎉

---

## 🔑 ধাপ ৩: Credentials বসাও

যে node-গুলোতে ⚠️ লাল চিহ্ন, সেগুলোতে credential লাগবে।

### Gemini (AI)
1. **Google Gemini Chat Model** node-এ double-click করো
2. Credential → **Create New**
3. API Key-তে Gemini key paste করো → **Save**
4. Model dropdown থেকে **gemini-2.5-flash** বা list-এ থাকা নতুন কোনো "flash" model বেছে নাও

### Gmail
1. **Email PDF to User** node খোলো
2. Gmail OAuth2 credential বানাও, অথবা আগেরটা select করো

### Google Sheets (history log)
1. Google Sheets-এ নতুন sheet বানাও
2. প্রথম row-তে এই ৬টা column লেখো:
   `Timestamp | Name | Email | Job Title | Company | Status`
3. Sheet-এর URL থেকে ID copy করো:
   `https://docs.google.com/spreadsheets/d/`**`এই_অংশটা_ID`**`/edit`
4. **Log to Google Sheets** node-এ `PASTE_YOUR_SHEET_ID`-এর জায়গায় ID বসাও
5. Credential select করো

> 💡 Sheets setup না করলেও system চলবে, কারণ এই node fail করলেও workflow থামে না। তবে assignment-এ optional feature হিসেবে নম্বর পেতে এটা করে নাও।

---

## 🧪 ধাপ ৪: Test করো

1. Workflow-এ **Execute Workflow** (বা Test workflow) বাটন চাপো। Webhook এখন listen করছে।
2. নতুন terminal খুলে `job-application-assistant` folder থেকে এটা চালাও (email-এর জায়গায় তোমার email দাও):
   ```bash
   curl -X POST http://localhost:5678/webhook-test/job-application \
     -F "name=Rahim Ahmed" \
     -F "email=তোমার_email@gmail.com" \
     -F "job_post=<samples/sample-job-post.txt" \
     -F "resume=@samples/sample-resume.txt"
   ```
3. n8n-এ প্রতিটা node সবুজ ✅ হওয়ার কথা
4. Inbox চেক করো, PDF আসবে। দেখতে `samples/sample-output.pdf`-এর মতো হবে।

---

## 🌐 ধাপ ৫: Form connect করো

1. Workflow-এ উপরে ডানদিকে **Active** toggle ON করো
2. **Webhook** node খুলে **Production URL** copy করো
3. `form/index.html` খোলো (Notepad বা VS Code-এ), এই line খুঁজে বের করো:
   ```js
   const WEBHOOK_URL = 'https://YOUR-N8N-DOMAIN/webhook/job-application';
   ```
4. তোমার URL বসাও, যেমন `http://localhost:5678/webhook/job-application`
5. `index.html` browser-এ double-click করে খোলো → form পূরণ করো → **Generate** চাপো 🚀

---

## 🆘 সমস্যা হলে

| সমস্যা | সমাধান |
|---|---|
| Gotenberg node-এ `ECONNREFUSED` | Gotenberg চলছে না, বা URL ভুল। `docker ps` দিয়ে দেখো। ধাপ ১-এর ⚠️ note পড়ো। |
| AI node-এ `429` error | Gemini free limit শেষ। ১ মিনিট পর আবার চেষ্টা করো (node নিজেই ৩ বার retry করে)। |
| `AI did not return JSON` | Model-কে আবার run করাও, বা অন্য flash model বেছে নাও। |
| PDF-এ resume-এর লেখা আসেনি | Resume-টা scanned ছবি। Text-based PDF লাগবে (Word থেকে "Save as PDF")। |
| Form-এ "Could not reach the server" | Workflow Active কিনা দেখো, URL-এ `/webhook/` আছে কিনা (`/webhook-test/` না)। |
| Email যায়নি | Gmail credential আবার connect করো। Google Cloud-এ Gmail API enable আছে কিনা দেখো। |

---

## 🎓 Assignment জমা দেওয়ার checklist

- [ ] Workflow-এর screenshot (সব node সবুজ)
- [ ] Form-এর screenshot
- [ ] Inbox-এ আসা email + PDF-এর screenshot
- [ ] Google Sheets log-এর screenshot
- [ ] ৩০-৬০ সেকেন্ডের screen recording: form submit থেকে email আসা পর্যন্ত (Loom free)
- [ ] Workflow JSON file

### Instructor প্রশ্ন করলে যা বলবে 💬

- **"AI কেন JSON-এ উত্তর দেয়?"** → এক call-এ cover letter, summary, job title, company সব পাই। Code দিয়ে নিশ্চিতভাবে আলাদা করা যায়, তাই PDF কখনো ভাঙে না।
- **"AI মিথ্যা লিখলে?"** → Prompt-এ rule দেওয়া আছে: resume-এ যা নেই, তা লেখা যাবে না।
- **"Validation কেন AI-এর আগে?"** → ভুল data-য় API-এর টাকা বা free limit নষ্ট হয় না।
- **"OpenAI দিয়ে করা যাবে?"** → হ্যাঁ। শুধু Gemini sub-node বদলে OpenAI Chat Model বসালেই হবে। বাকি সব একই থাকে।

Best of luck ভাই! 💪
