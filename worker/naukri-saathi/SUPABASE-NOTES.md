# Supabase project for techsamjhoraj.com login (24 Nov 2026)

Public values only (safe to keep here; never put the database password, service_role key or SMTP key in any file):
- Project: techsamjhoraj, ref `vnktvgiordacnyxbwaae`, region South Asia (Mumbai), Free plan, RLS on for new tables
- Project URL: https://vnktvgiordacnyxbwaae.supabase.co
- Publishable key (public): sb_publishable_e4fMGkoBfVsvvWudF9JTsQ_iWj-l8iT
- Site URL set to https://www.techsamjhoraj.com; redirect URLs: https://www.techsamjhoraj.com/** and https://techsamjhoraj.com/**

Still open before login can go live (rdauth.js AUTH is still empty on purpose):
1. Custom SMTP (Brevo): Supabase default email is about 3 mails/hour, and its templates cannot be edited without custom SMTP.
2. Edit the "Confirm sign up" and "Magic link" templates to show `{{ .Token }}` (the 6-digit code rdauth.js asks for).
3. Then set AUTH.supabaseUrl and AUTH.anonKey in rdauth.js, test locally, push after Raj's yes.
