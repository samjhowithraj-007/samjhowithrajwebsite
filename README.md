# techsamjhoraj.com

Source of https://www.techsamjhoraj.com, a free Hindi / Hinglish classroom for the Samjho with Raj videos.

- `index.html` — the whole site: Classroom, lesson pages, Financial Tracker, Upcoming, Community, About. Course and lesson notes live in the `COURSES` list near the top of the script.
- `media/` — lesson videos (`<lesson-id>.mp4`) and their poster images (`<lesson-id>.jpg`)
- `img/` — logo
- `CNAME` — custom domain for GitHub Pages
- `archive/old-chatgpt-site.html` — the earlier one-page site, kept for reference (not published)

Every push to `main` publishes the site through `.github/workflows/pages.yml`.

## Add a lesson
1. Copy the video to `media/<id>.mp4` and a poster frame to `media/<id>.jpg`.
2. In `index.html`, turn the matching "coming soon" entry into a full lesson (title, video, concept, code, output, practice, takeaway).
3. Commit and push.

## Financial Tracker
The `#tracker` tab is a client-side family money planner for the "Middle-Class Family Ka Money Plan" series. All maths runs in the browser (the `fp*` functions in `index.html`); nothing is sent anywhere, and inputs are kept in `localStorage` only if the visitor ticks "Remember". Default assumptions live in `FP_ASSUME`; the Verma family example is `fpVerma()`. Educational and illustrative only.
