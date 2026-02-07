# Visual & Atmospheric
Mood-Colored Orbit Trail - Instead of a plain white orbit line, render the path behind Earth as a gradient colored by mood data. Green streaks for happy days, blue for sad ones. At a glance you'd see the emotional shape of your year.

Season Bands & Solstice/Equinox Markers - Divide the orbit into four colored arcs (spring green, summer gold, autumn amber, winter blue). Animate special effects on solstice/equinox days - a sun flare, a color shift, a brief particle burst.

Moon Phase Companion - Draw a small moon orbiting Earth that shows the real lunar phase for the selected day. Calculated mathematically (no API needed). Full moons could trigger a subtle glow on the canvas.

Zodiac Constellation Ring - Render the 12 zodiac constellations as connect-the-dot star patterns around the outer edge of the orbit, aligned to their actual date ranges. The current sign subtly highlights as Earth passes through.

Nebula Background - Replace the flat dark background with procedurally generated nebula clouds using layered noise functions on a secondary canvas. Slowly drifting, barely perceptible movement.

Aurora Events - On days where mood is 5/5, trigger a shimmering aurora borealis effect radiating from Earth. A visual reward for great days.

# Data & Tracking
Habit Tracker Rings - Add concentric rings inside the orbit for custom habits (exercise, reading, meditation, etc.). Each ring fills in day-by-day like a progress wheel. A full ring = a year of consistency.

Energy & Sleep Layers - Beyond mood, track energy level (1-5) and sleep quality (1-5). Show these as layered data in the report modal - three line charts overlaid, revealing correlations between sleep, energy, and mood.

Tagging System - Let users create custom tags (travel, work, social, creative) and assign them to days. Tags appear as colored dots on the orbit path. Filter the view by tag to see patterns.

Streaks & Achievements - Track consecutive logging streaks. Display a flame icon on Earth during active streaks. Unlock achievements: "30-day streak," "Logged every day in March," "First year complete." Confetti animation on unlock (you already have canvas-confetti in other apps).

# Journaling & Reflection
Time Capsule Notes - Write a note addressed to your future self. Lock it to a specific date. When that date arrives, Earth pulses with a special glow and the capsule "opens" in the modal. Until then, it shows as a sealed icon on the orbit.

Gratitude Prompts - Add an optional "3 things I'm grateful for" section in the day modal. Separate from free-form notes. Over time, build a searchable gratitude archive.

Year in Review Generator - At year's end (or on demand), generate a visual summary: total days logged, mood arc, best streak, most-used tags, a word cloud from notes, and the full colored orbit as a shareable image (canvas toDataURL).

Weekly Reflection - Every 7th logged day, prompt a brief weekly reflection: "What went well? What could improve?" Stored separately, viewable in reports as a timeline.

# Navigation & Time
Multi-Year Zoom - Pinch/scroll to zoom out and see multiple concentric orbits representing past years. Each ring colored by that year's mood data. Zoom into any year to explore it. Your entire life as nested orbits.

Decade View - A bird's-eye spiral showing 10 years at once. Each loop is one year. The spiral grows outward from your birth date. A literal visualization of your journey through time.

Today Pulse & Auto-Navigate - When you open the app, Earth smoothly animates from wherever it was to today's position. A gentle pulse on "today" distinguishes it from browsing past days.

# Ambient & Sensory
Ambient Soundscape - Optional background audio: a low space drone, subtle crystalline tones that shift pitch with the seasons. Mood-reactive - minor key for low moods, major for high. Use the Web Audio API to generate tones procedurally (no audio files needed).

Haptic Feedback - On mobile, subtle vibrations when dragging Earth past month boundaries or when a shooting star appears. Uses the Vibration API.

# Social & Export
Import/Export Data - Export all mood, notes, and settings as a JSON file. Import to restore. This is also a backup mechanism since everything is in localStorage.

Shareable Day Cards - Generate a beautiful image card for any day: the date, mood emoji, a snippet of your note, rendered on a starfield background. Save or share.

# Astronomical Realism
Real Eclipse Overlay - On dates of actual solar/lunar eclipses (hardcoded table for the next few years), animate the event on the canvas. The moon crosses the sun, or Earth's shadow crosses the moon.

Planetary Neighbors - Add simplified orbits for Mercury, Venus, and Mars as faint dotted lines with tiny dots. They move at their real relative speeds. Pure visual flavor - a reminder you're not alone out there.

Perihelion/Aphelion - Make the orbit slightly elliptical (Earth's real eccentricity is 0.017). Mark perihelion (January ~3) and aphelion (July ~4). The sun could pulse slightly larger at perihelion.

