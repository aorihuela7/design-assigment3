# Onboarding research: how similar tools welcome someone new

Researched 20 Oct 2026 for Pack Again's first visit. Three tools, one per category:

- **PackPoint**: a dedicated packing list app (iOS, Android)
- **Todoist**: a generic checklist app with packing templates (web, iOS, Android)
- **Wanderlog**: a trip planner with packing checklists (web, iOS, Android)

**Method.** Public information only: official sites, help centers, app store listings, published reviews and design teardowns. No accounts were created and nothing was installed. Claims that only reviews or third-party write-ups support are marked *(per reviews)* or *(unconfirmed)*. Several reviews are a few years old, so the dates are given.

## At a glance

| | PackPoint | Todoist | Wanderlog |
|---|---|---|---|
| First screen | Straight into "New trip", with no tour *(per reviews)* | Sign-up page (web) or sign-up choice (app) | Marketing page (web); sign-up wall (app) |
| Account required | No sign of one *(unconfirmed)* | Yes, before anything works | App: yes. Web: not at first, per an older FAQ |
| Asks before anything useful | Gender, trip type, destination, dates, nights, activities, laundry | Account, email check, theme | Account, travel-style quiz, Pro paywall, then trip name |
| Time to a usable list | About 7 inputs, ~30 seconds | Sign-up, then an empty Inbox; a packing template needs an account to see its items | About 6 minutes to plan anything; packing is 4–6 taps after creating a trip |
| First useful thing | Pre-filled list fitted to the weather and trip length | Example prompts in the empty task field | A checklist, possibly preset (official pages disagree) |
| Reusing a list next time | Weak: can't copy a past trip; import/export is Premium only | Save as template, duplicate project, or CSV | Not supported in Feb 2024, per a co-founder |

## PackPoint (dedicated packing list)

**First screen.** No tour and no sign-up wall. You go straight into creating a trip. Reviewers say it "always wants to drop you into the screen for creating a packing list" (2020), and describe being stuck on a "business or leisure" screen with no way out (2024). The official pages don't mention an account or login *(unconfirmed)*.

**What it asks for**, in an order pieced together from reviews *(unconfirmed)*:

1. Gender, asked once.
2. New trip.
3. Business, leisure or both.
4. Destination city.
5. Departure date and number of nights, typed one field at a time with no calendar picker.
6. Activities, from about 13 presets.
7. "Repeat basics?" and "Laundry access?"

**Time to something useful.** About 7 inputs, roughly 30 seconds of setup (WhistleOut, Mar 2026). The result is a pre-filled list grouped by category and activity, adjusted to the forecast and trip length, with suggested quantities and a reminder the day before you leave.

**Coming back.** Weak. Past trips are archived and can't be copied as the start of a similar trip, and dates can't be edited once entered *(per reviews, 2018)*. Import/export of lists arrived in Mar 2026 for Premium users only. Reviews from 2019 and 2024 report custom lists lost after reinstalling, with no backup.

**Borrow:** a few questions, then a full list straight away. Questions like "laundry access?" that change quantities.
**Avoid:** forcing you to create a list before you can look around, so people make a throwaway one. No way to copy a past trip. No backup. Customization behind a paywall (Premium $2.99 plus $0.99 add-ons). Asking gender up front.

## Todoist (generic checklist)

**First screen.** On the web, a marketing page whose "Start for free" button leads to sign-up. In the app, a choice of Apple, Google or email sign-up (help center, updated Sep 2026). Nothing works without an account.

**What it asks for:**

1. An account: Google, Apple, or email plus password.
2. For email sign-ups, a verification link. It expires in 24 hours, and you're locked out after 7 days unverified.
3. A few setup screens: welcome, pick a theme, "You're all set" *(Page Flows 2020 and a Doist talk from 2021; current flow unconfirmed)*.

**Time to something useful.** You land in an empty Inbox. The task field cycles through example prompts like "Fix bike tire this weekend" until you've completed 15 tasks (official). The public template pages ("Travel Checklist", "Business Travel Packing") show only a description and image. You need an account to see the actual items.

**Repeating a list.** The strongest of the three:

- Save a project as a template.
- Duplicate a project.
- Export and import as CSV (up to 300 tasks).
- Use recurring dates.

The free plan is capped at 5 projects, which a template-per-trip habit hits quickly.

**Borrow:** templates named after the situation, split into before / packing / during / after. Copy the whole list, then delete what doesn't apply. Example prompts in an empty field rather than a blank page. From Doist's own redesign talk: "Remove steps that add low value" and "Don't let your users start from a blank page."
**Avoid:** requiring an account before you can see a template's contents. The email-verification lockout. Templates that can't be edited directly.

## Wanderlog (trip planner with packing)

**First screen.** On the web, a marketing page ("One app for all your travel planning needs") with Start planning and Get the app buttons. An older FAQ (about 2021) says you can plan on the web without an account. The mobile app requires one at the very start, per the official FAQ and a ScreensDesign teardown.

**What it asks for in the app:**

1. Create an account.
2. Travel-style quiz screens.
3. A Pro paywall with a 7-day trial.
4. An "Essential tasks" checklist with a progress bar.
5. Create a trip. A name is required; destination and dates can come later, according to reviews, though a 2024 official post says start and end dates are asked too.

**Time to something useful.** About 6 minutes from download to planning anything (WhistleOut, Mar 2026). Packing lists live inside a trip: open the trip, tap +, choose Checklist, then New List or a preset (official blog, Oct 2024). Whether presets exist is unclear: the homepage says "Use our preset packing lists", while the same 2024 post says "there are no pre-created packing lists".

**Reusing a list.** In Feb 2024 a co-founder said copying lists between trips was "not possible at this time". Users work around it with a "template trip". Nothing newer confirms that reuse has shipped.

**Borrow:** one simple checklist used for anything (packing, to-dos, shopping). Several lists per trip, such as carry-on vs checked. Checklists are free.
**Avoid:** a sign-up wall, a quiz and a paywall before any value. Burying packing behind trip creation. Mixed messages about whether templates exist. Reviewers complain about the "lengthy onboarding" and a forced trial.

## What this means for Pack Again

**Worth borrowing**
- **A full list straight away.** PackPoint's pre-filled list and Todoist's "don't start from a blank page" both support starter lists that already exist on the first visit.
- **Copy, then trim.** Starter lists should be easy to cut down: removing an item should take one action with no confirmation.
- **Prompts in empty fields.** Use example text in the Add item field instead of an empty state that says nothing.
- **Starter names that match situations** ("Conference trip", not "List 1"), as Todoist's templates do.

**Worth avoiding**
- **Anything before the list.** That includes accounts, quizzes, paywalls, profile questions like gender, and trip details. All three tools ask for something first; Pack Again can ask for nothing.
- **Losing the list between trips.** All three tools are weak at the exact thing Pack Again is for: the same list, ready again. "Packing for a new trip? Clear ticks" is the feature none of them have.
- **Silent data loss.** PackPoint users lost lists with no warning. We should say plainly that lists live in this browser.
- **Trapping people in a setup screen.** Opening the app should never force someone to finish a form before they can look around.

## Sources

**PackPoint**
- https://www.packpnt.com/
- https://apps.apple.com/us/app/packpoint-travel-packing-list/id896337401
- https://play.google.com/store/apps/details?id=com.YRH.PackPoint
- https://packpoint.en.aptoide.com/app
- https://thoughtcard.com/packpoint-review/
- https://www.pilotplans.com/blog/packpoint-review
- https://www.whistleout.com/CellPhones/Guides/packpoint-makes-travel-packing-easy
- https://justuseapp.com/en/app/896337401/packpoint-travel-packing-list/reviews

**Todoist**
- https://www.todoist.com/help/account-and-billing/account/set-up-your-todoist-account-N6PSTd4CH
- https://www.todoist.com/help/todoist/get-started/get-started-with-todoist-OgNNJR
- https://www.todoist.com/help/articles/use-todoist-templates-uofJ8i40M
- https://www.todoist.com/help/articles/use-todoist-setup-templates-bL0Jkmbwo
- https://www.todoist.com/help/articles/import-or-export-todoist-project-templates-YC8YvN
- https://www.todoist.com/help/todoist/features/introduction-to-projects-TLTjNftLM
- https://www.todoist.com/help/articles/introduction-to-recurring-dates-YUYVJJAV
- https://www.todoist.com/templates/travel-checklist
- https://www.todoist.com/templates/business-travel-packing
- https://www.todoist.com/templates/todoist-onboarding
- https://www.todoist.com/pricing
- https://speakerdeck.com/fmerian/how-todoist-redesigned-its-user-onboarding
- https://pageflows.com/post/desktop-web/onboarding/todoist/
- https://www.saner.ai/blogs/todoist-review
- https://www.threads.com/@6figurefreelancingonupwork/post/DNsZX3uVNkD/

**Wanderlog**
- https://wanderlog.com/
- https://wanderlog.com/plan-a-trip
- https://wanderlog.com/blog/faq/
- https://wanderlog.com/blog/2024/10/24/what-is-the-best-app-that-helps-you-pack-for-a-trip/
- https://community.ricksteves.com/travel-forum/tech-tips/wanderlog-users-on-copying-lists-from-one-trip-to-another
- https://help.wanderlog.com/hc/en-us/articles/5159767938843-Move-or-delete-all-places-in-a-list-or-day
- https://screensdesign.com/showcase/wanderlog-travel-planner
- https://www.whistleout.com/CellPhones/Apps/wanderlog-group-trip-planning-app
- https://apps.apple.com/us/app/wanderlog-travel-planner/id1476732439
- https://www.trustpilot.com/review/wanderlog.com
