# Naukri Saathi Worker: setup steps for Raj

The page works without this (simple rule-based demo). These steps turn on the real AI. They need your accounts and money, so only you do them. Never paste the API key in a chat, a file or the repo.

## A. Get the keys (about 15 minutes)
1. **Anthropic API key with a spend cap**
   1. Open https://console.anthropic.com and sign in (or create an account).
   2. Add a small prepaid balance (for example $5 is thousands of job packs; Haiku 5.5 costs about 0.1 cent per pack).
   3. Settings > Limits: set a **monthly spend limit** (for example $5).
   4. Settings > API keys > Create key, name it `naukri-saathi`. Copy it once. Keep it ready for step B6.
2. **Cloudflare account and Turnstile**
   1. Open https://dash.cloudflare.com/sign-up and create a free account.
   2. Left menu > **Turnstile** > Add widget. Name: `Naukri Saathi`. Hostname: `www.techsamjhoraj.com` (also add `techsamjhoraj.com`). Widget mode: Managed. Create.
   3. Copy the **Site key** (public) and the **Secret key** (private).

## B. Create the Worker (about 10 minutes, no coding)
1. Cloudflare dashboard > **Workers & Pages** > Create > **Create Worker**. Name: `naukri-saathi`. Deploy.
2. Click **Edit code**. Delete everything and paste the full content of `worker.js` from this folder. Click **Deploy**.
3. Left menu > **Workers & Pages > KV** > Create namespace, name `naukri-saathi-rate`.
4. Back in the Worker > **Settings > Bindings** > Add > KV namespace. Variable name: `RATE`. Pick `naukri-saathi-rate`. Save.
5. **Settings > Variables and Secrets** > Add: `TURNSTILE_SECRET` (type Secret, paste the Turnstile secret key), `PER_IP_PER_DAY` = `5` (Text), `GLOBAL_PER_DAY` = `300` (Text).
6. Same place > Add: `ANTHROPIC_API_KEY` (type **Secret**, paste the Claude API key). Deploy.
7. Copy the Worker address, like `https://naukri-saathi.<your-name>.workers.dev`.

## C. Tell the website session
Send these two values to the website session (they are public, so safe to share):
- the Worker address from B7
- the Turnstile **Site key** from A2 (not the secret)

The website session puts them in `NS_CONFIG` in `naukri-saathi/index.html` and pushes (with your OK). The Brevo waitlist is separate: create the list "Naukri Saathi waitlist" with text attributes PRICE_CHOICE and JOB_ROLE, make a form, and send the form URL.

## Controls built in
5 packs per IP per day, 300 per day for the whole site (spend guard), 6,000 characters per field, phone numbers and emails removed before sending, nothing stored, CORS only for techsamjhoraj.com, Cloudflare Turnstile bot check, and the page falls back to the rule-based demo if the Worker is down or the limit is reached.

## Worker v2 and the book prompts (24 Nov 2026)
`worker.js` in this public repo has an EMPTY prompt table on purpose: the 50 prompts of the AI Job Search book are paid content.
The full Worker (prompts included) is kept privately at `C:\samjhowithraj\prompt\v2\job-search-book\worker-private\worker.js`. Paste THAT file into the Cloudflare dashboard. Never commit it.
Dodo license keys: set `DODO_ON` = 1 (and `DODO_BASE` for test mode, `KEY_USES` builds per key) to make the tailored resume paid; leave unset for free launch mode.
