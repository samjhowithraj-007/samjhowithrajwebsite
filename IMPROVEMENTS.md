# techsamjhoraj.com: ideas to look more professional

Benchmarked live on 2026-10-19: freeCodeCamp, Scrimba, roadmap.sh, Kaggle Learn, W3Schools, DeepLearning.AI, CodeWithHarry, Apna College.
We take ideas only, never their designs, text or assets.

**What they all share:** one big headline and **one clear button** above the fold. The course cards show the level, the length and a Start button. There is a "continue where you left off" path, a full footer and share cards (a preview image when a link is pasted in WhatsApp or X). The person teaching is named.
**What we already do better:** no cookie banner (W3Schools, roadmap.sh, Kaggle and Scrimba all show one), no login wall, code runs in the browser, and the site works offline as an app.

Ranked by impact vs. effort. ✅ = done locally on 2026-10-19 (not live until Raj says push).

**Also done 2026-10-19 (Raj: "professional and high tech"):** a dark-first dev-tool look (faint grid + amber/cyan glow, glassy cards, sans display type), an animated hero terminal where the Chai Bot types, a Ctrl K / "/" command palette over lessons, pages and the full notes (with "Ask Raj" at the end), and Ask Raj step 1 (searches every page; see README). Ideas taken from Vercel, Linear, Stripe docs and Hugging Face; nothing copied.

| # | Idea | Seen on | What to change | Impact | Effort |
|---|---|---|---|---|---|
| 1 ✅ | **Hero with one clear button** | freeCodeCamp ("Get started (it's free)"), Scrimba, Apna College | Home page: the headline stays. Add a big "Start learning free" button and a second "Try Python in your browser" link. Add a one-line "Taught by Raj" byline. | High | Low |
| 2 ✅ | **Continue where you left off** | Scrimba ("Started" tab), Kaggle, DeepLearning.AI | Remember the last lesson opened (this browser only). The hero button then becomes "Continue: Lesson name". | High | Low |
| 3 ✅ | **Better course cards** | DeepLearning.AI (level + minutes), Kaggle Learn | Show the whole cover (square video frames were being cropped), a level tag (Beginner / Intermediate), the lesson count and a "Start →" / "Continue →" button. | High | Low |
| 4 ✅ | **Share cards + search data** | All eight (og:image, twitter card) | Add og:title/description/image, a twitter card, a canonical link and JSON-LD (Organization + the courses). Links pasted in WhatsApp, X and Facebook then show a proper preview. | High | Low |
| 5 ✅ | **Full footer** | freeCodeCamp, Kaggle, roadmap.sh | Columns: Courses, Tools (Playground, Book, Install app), Channel (socials), Site (About, Privacy, Contact), plus a one-line "what this site is". | Medium | Low |
| 6 ✅ | **Light/dark switch** | freeCodeCamp, W3Schools | The CSS already supports `data-theme`. Add a small sun/moon button and remember the choice. | Medium | Low |
| 7 ✅ | **Lesson search (Ctrl + K)** | roadmap.sh, Kaggle, W3Schools, CodeWithHarry | A search box over all lesson titles and notes, entirely in the browser. | Medium | Medium |
| 8 | **Learning path strip** | roadmap.sh | "Start here: Python with Chai → AI + Python chatbot → Agentic AI", with ticks from your progress. | Medium | Low |
| 9 | **Lesson page polish** | DeepLearning.AI, Scrimba | "Lesson 3 of 20 · 5 min read", a breadcrumb (Classroom › Course › Lesson) and a "Share this lesson" button (native share on phones). | Medium | Low |
| 10 | **Calmer home page** | Kaggle, DeepLearning.AI | The home page stacks two notes, the book card, the books, a promo and sign-up. Keep one book card and one sign-up box, and move the rest lower or to the Book tab. | Medium | Low |
| 11 | **Real cover art per course** | DeepLearning.AI, Scrimba | Make 16:9 course covers (title + Chotu/Bunty) instead of video frames. The Agentic cover is almost black. | Medium | Medium |
| 12 | **One indexable page per lesson** | W3Schools, freeCodeCamp (every lesson has its own URL) | `#python-3` hash links are invisible to Google. Generate small static pages (`/learn/python-3/`) with the notes and a link into the app, then add them to sitemap.xml. Biggest SEO win. | High | High |
| 13 | **Real numbers only** | Apna College, freeCodeCamp (learner counts) | Once they are real and worth showing, display the YouTube subscriber count, email sign-ups or lessons completed. Never invent numbers. | Medium | Low |
| 14 | **Certificate of completion** | freeCodeCamp, Kaggle | A printable "I finished Python with Chai" page made in the browser (name typed by the learner, nothing stored). | Medium | Medium |
| 15 | **Testimonials** | Apna College, Scrimba | Once real learners send feedback (with permission), show 3 short quotes on the home page. | Medium | Low |

## Weekly ideas

(A scheduled task adds new ideas here every Wednesday. When Raj says "do the website ideas", pick from this list and the table above.)
