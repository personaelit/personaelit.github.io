/**
 * Seed script - populate the last 365 days with random mood data
 *
 * Run from the browser console while on the earth-calendar-2 page,
 * or load as a script tag in index.html temporarily:
 *   <script type="module" src="seed-moods.js"></script>
 *
 * About 60% of days get a mood (1-5), 40% are left empty.
 * Moods are weighted to feel natural: mostly 3-4 with occasional 1s and 5s.
 */

const STORAGE_PREFIX = 'earth_calendar_';

function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

function weightedMood() {
    // Weighted distribution: 1=5%, 2=15%, 3=30%, 4=35%, 5=15%
    const roll = Math.random();
    if (roll < 0.05) return 1;
    if (roll < 0.20) return 2;
    if (roll < 0.50) return 3;
    if (roll < 0.85) return 4;
    return 5;
}

function seed() {
    const today = new Date();
    let seeded = 0;
    let skipped = 0;

    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = `${STORAGE_PREFIX}mood_${formatDateKey(date)}`;

        // 60% chance of having a mood entry
        if (Math.random() < 0.6) {
            localStorage.setItem(key, String(weightedMood()));
            seeded++;
        } else {
            // Remove any existing mood so we get clean gaps
            localStorage.removeItem(key);
            skipped++;
        }
    }

    console.log(`Seeded ${seeded} days with mood data, left ${skipped} days empty.`);
    console.log('Reload the page to see the mood trail.');
}

seed();
