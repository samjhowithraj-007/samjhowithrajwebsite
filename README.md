# samjhowithraj.online

Source of https://www.samjhowithraj.online, a free Hindi / Hinglish classroom for the Samjho with Raj videos.

- `index.html` — the whole site: Classroom, lesson pages, Upcoming, Community, About. Course and lesson notes live in the `COURSES` list near the top of the script.
- `media/` — lesson videos (`<lesson-id>.mp4`) and their poster images (`<lesson-id>.jpg`)
- `img/` — logo
- `CNAME` — custom domain for GitHub Pages
- `archive/old-chatgpt-site.html` — the earlier one-page site, kept for reference (not published)

Every push to `main` publishes the site through `.github/workflows/pages.yml`.

## Add a lesson
1. Copy the video to `media/<id>.mp4` and a poster frame to `media/<id>.jpg`.
2. In `index.html`, turn the matching "coming soon" entry into a full lesson (title, video, concept, code, output, practice, takeaway).
3. Commit and push.
