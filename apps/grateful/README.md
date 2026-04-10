# Grateful

Grateful is a gratitude journal that supports mood recording with basic visualizations.

 ## Architecture:

 Entirely client side with a focus on simplicity. PWA.

- app.js
- styles.css
- index.html
- manifest.json
- sw.js - caches app shell for full offline use.

localStorage for persistance.

## Features

### Gratitude

- Daily prompts for three things to be grateful for.  Entries are stored in localStorage. 
- Ability to add/remove tags for the entries with a seed of possibilites:
    - #family
    - #friends
    - #nature
    - #health
    - #gratitude
    - #work
    - #growth
    - #learning
    - #kindness
    - #love
    - #peace
    - #joy
    - #creativity
    - #mindfulness
    - #community
    - #opportunity
    - #resilience
    - #achievement
    - #simplethings
    - #reflection

- A seed list of prompts such as:
    - One good thing that happened to me today…
    - Something good that I saw someone do…
    - Today I had fun when…
    - Something I accomplished today…
    - Something funny that happened today…
    - Someone I was thankful for today…
    - Today I smiled when…
    - Something about today I’ll always want to remember…
    - Today was special because… 
    - Today I was proud of myself because…
    - Something small that made today better…
    - A moment I felt at peace today…
    - Something I learned about myself today…
    - A challenge I handled well today…
    - Something I’m looking forward to tomorrow…
- The ability to cycle through prompts to choose a desired prompt.
- The ability for the user to add/edit/remove prompts.


### Mood
- Daily mood recording scale of 1-5 (radio buttons) with appropriate smiley emojis as the labels.

### Universal

- Ability to set reminders via push notifications. 
    - Don't request permission until the user engages with the UI to set notifications.  
    - If notifications are denied, prompt user to allow when they engage with the UI to set notifications.
- History List page - where user can peruse and search entries
- Visualizations showing the things most grateful for (tags) using bar charts and bubble graphs. (using chart.js)
- Visualizations showing mood trend using line graphs and bubble graphs (using chart.js)
- Streak recording
    - A visualization showing the last seven days and some celebratory confetti using confetti.browser.js.
    - Streaks recorded when a user click enters three things to be grateful for and records a mood.
    - Streak is from midnight to midnight localtime.
    - Streak resets if a day is missed.
- Support for dark and light mode respecting system preferences.
- Support for prefers-reduced-motion for confetti and any other animations
- User configuration
    - name, DOB. (localStorage)
- Encouraging messaging using the user's name such as:
    - You showed up today, {name}.
    - {name}, this habit is starting to stick.
    - That’s a win, {name}.
    - {name}, you’re building something that lasts.
    - One step forward today, {name}.
    - {name}, this kind of consistency adds up.
    - You made time for yourself, {name}.
    - {name}, keep the momentum going.
    - Small actions, real impact — nice work, {name}.
    - {name}, you’re doing better than you think.
    - Another entry in the books, {name}.
    - {name}, this is how change happens.
    - You kept the promise to yourself today, {name}.
    - {name}, progress looks good on you.
    - Bit by bit, {name}, you’re getting there.

- Well wishes when opening app on DOB.
- Export json.
- Import json.
- Restore default prompts
- Restore default tags
- i18n support
    - en-US with the ability to add other locales later





## UI

The app gets straight to business on first run and prompts the user for their name, and fades into a prompt for optional DOB.

It then presents the user with the first prompt and guides them through the third prompt.

Subsequently launches begin by prompting the user for the first grateful item of the day or returning to current state (such as a partial entry).

If the user launches the app on a completed day, there is a countdown to next day to be grateful.



After the third gratitude prompt, the user is prompted to record mood on a scale of 1-5. 

When they click done, the streak is incremented and the user sees a success message and streak visualization with a little confetti.

### Prompt control
- A "Prompt Chooser" with options to add/edit/delete prompts.
- A textfield for recording the entry (saved on keydown for persistence when closing / opening the app.)
- A "Tag Chooser" with options to add/edit/delete tags.
- A Next Button for Prompts 1 and 2. A Submit button for Prompt 3. 

### Mood Control

 - A radio button list (1-5) with appropriate smile emojis representing mood.
 - A done button which activates the success screen.

### Navigation

- Icons along a menu bar at the bottom of the viewport allow the user to enter settings, history, and visualizations.

### Success Screen
- a graphic showing the last seven days.
- text showing "Current Streak: {days} Days!"
- A confetti effect.


### Visualization Screen
- graph for mood data with line chart and bubble chart toggle. (default to line chart)
- graph for tag frequency with bar chart and bubble chart toggle. (default to bubble chart)


### History Screen
- a paged list (7 per page) of previous entries sorted by date (newest to oldest) with a search box for keywords, a tag filter, and a date chooser.
- ability to edit/delete entries


### Settings Screen
- A user name field (stored in localStorage on keydown)
- A DOB date chooser.
- A "Set Reminder" control with a time chooser (and prompt/warning to allow notifications)
- Import/Export data controls. On import prompt the user to merge or replace current data.

### Birthday Screen
- if the user opens the app on their birthday, they get a dismissable personalized happy birthday modal with some stats about the last year or all available data if less than a year.
- stats:
    - date started
    - days recorded.
    - top 10 tags
    - average mood.
    - a sampling (3) of entries from great mood days.

## Build Plan

### Phase 1 — Shell (no logic yet) COMPLETE

1. manifest.json — name, icons, theme color, display mode
2. index.html — semantic shell: nav bar, screen containers (main, history, viz, settings), CDN script tags (Chart.js, confetti)
3. styles.css — design tokens (dark/light via prefers-color-scheme), layout primitives, nav bar, screen visibility pattern
4. sw.js — basic app shell caching (cache on install, serve from cache)

At this point the app installs as a PWA and works offline, but is just scaffolding.

### Phase 2 — Data model

5. Define the localStorage schema in app.js before writing any UI logic — entries, streak, settings, custom prompts, custom tags. Getting this right early prevents painful refactors later.

### Phase 3 — Core daily flow (the heart of the app)

6. First-run flow — name prompt → optional DOB → fade into first gratitude prompt
7. ratitude entry flow — prompt chooser, text field (save on keydown), tag chooser, Next/Submit buttons
8. Mood recording — radio buttons + done
9. Success screen — streak logic, 7-day graphic, encouraging message, confetti (respecting prefers-reduced-motion)

### Phase 4 — Supporting screens

10. History screen — paged list, search, tag filter, date filter, edit/delete
11. Settings screen — name, DOB, import/export (with merge/replace prompt), restore defaults
12. Visualization screen — Chart.js mood + tag charts with toggles

### Phase 5 — Polish & extras

13. Push notifications — time chooser in settings, deferred permission request
14. Birthday modal — DOB check on launch, stats
15. Completed-day state — countdown to next day



