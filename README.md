# techsamjhoraj.com

Source of https://www.techsamjhoraj.com, a free Hindi / Hinglish classroom for the Samjho with Raj YouTube videos.

- `index.html` — the whole site: Classroom, lesson pages, Financial Tracker, Upcoming, Community, About. Course and lesson notes live in the `COURSES` list near the top of the script.
- `media/` — lesson videos (`<lesson-id>.mp4`) and their poster images (`<lesson-id>.jpg`)
- `img/` — logo
- `CNAME` — custom domain for GitHub Pages
- `archive/old-chatgpt-site.html` — the earlier one-page site, kept for reference (not published)

Every push to `main` publishes the site through `.github/workflows/pages.yml`.

## Add a lesson
1. Copy the video to `media/<id>.mp4` and a poster frame to `media/<id>.jpg`.
2. In `index.html`, turn the matching "coming soon" entry into a full lesson (title, video, concept, code, output, practice, takeaway).
3. Run `node tools/build-index.mjs` (updates `site-index.json` for Ask Raj), then commit and push. A local pre-push hook refuses the push if the index is out of date.

## Financial Tracker
Moved to paisasamjhoraj.com (`#planner`). The old `#tracker` link forwards there.

## How Ask Raj works
The ☕ **Ask Raj** button answers questions about this site in three layers:
1. **Hand-written replies** (`askRaj({...})` rules): greetings, the chai shop (menu, order, bill), install, email. They handle short messages and the chips. This is the same dictionary-of-replies idea as AI + Python Parts 2–3.
2. **Site search:** `tools/build-index.mjs` runs the site's own script in a sandbox and writes every lesson, page, Upcoming list and book FAQ into `site-index.json` (about 60 chunks, 40 KB). `SITE_SEARCH` in `index.html` ranks them in the browser with BM25, Hinglish synonyms ("kitab" → book, "shuru" → start) and typo tolerance ("dictonary"). It then shows the best sentence with a link. The best passage must contain 60% of the question's words, so off-topic questions get "not found" instead of a random lesson.
3. **Claude (optional):** if `ASK_WORKER` is set, the question and the ids of the top 4 passages go to the Cloudflare Worker in the `ask-raj-worker` repo. It answers only from those passages, using `claude-haiku-5-5`. If anything fails, layer 2's answer is shown.

Nothing is stored about the visitor. See `ask-raj-worker/README.md` for the Worker's limits and cost.
