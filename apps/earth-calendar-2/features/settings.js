/**
 * Settings Feature
 * User preferences and personalization
 */

import { STORAGE_KEYS } from '../constants.js';
import { save, load } from '../utils/storage.js';
import { calculateDaysAlive, getTimeOfDay } from '../utils/date.js';
import { setState } from '../state.js';

/**
 * Get user name
 * @returns {string}
 */
export function getUserName() {
    return load(STORAGE_KEYS.USER_NAME, '');
}

/**
 * Set user name
 * @param {string} name
 */
export function setUserName(name) {
    save(STORAGE_KEYS.USER_NAME, name);
}

/**
 * Get user date of birth
 * @returns {string|null} ISO date string or null
 */
export function getUserDOB() {
    return load(STORAGE_KEYS.USER_DOB);
}

/**
 * Set user date of birth
 * @param {string} dob - ISO date string
 */
export function setUserDOB(dob) {
    save(STORAGE_KEYS.USER_DOB, dob);
}

/**
 * Create personalized greeting
 * @returns {string}
 */
export function createGreeting() {
    const name = getUserName() || 'friend';
    const dob = getUserDOB();
    const timeOfDay = getTimeOfDay();
    const daysAlive = calculateDaysAlive(dob);

    if (daysAlive && daysAlive > 0) {
        return `${timeOfDay}, ${name}! This is day ${daysAlive.toLocaleString()} of your journey. Make. it. count.`;
    }

    return `${timeOfDay}, ${name}!`;
}

/**
 * Get a boolean toggle value from storage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
function getToggle(key) {
    const value = load(key);
    return value === null ? true : value === 'true';
}

/**
 * Get saved toggle values for initializing state
 * @returns {{ showMonthLabels: boolean, showSeasons: boolean, showMoodTrail: boolean, showMoon: boolean, showZodiac: boolean }}
 */
export function getSavedToggles() {
    return {
        showMonthLabels: getToggle(STORAGE_KEYS.SHOW_MONTH_LABELS),
        showSeasons: getToggle(STORAGE_KEYS.SHOW_SEASONS),
        showMoodTrail: getToggle(STORAGE_KEYS.SHOW_MOOD_TRAIL),
        showMoon: getToggle(STORAGE_KEYS.SHOW_MOON),
        showZodiac: getToggle(STORAGE_KEYS.SHOW_ZODIAC),
    };
}

/**
 * Create settings form element
 * @param {Function} onSave - Callback when settings are saved
 * @returns {HTMLElement}
 */
export function createSettingsForm(onSave) {
    const container = document.createElement('div');
    container.className = 'settings-form';

    const toggles = getSavedToggles();

    container.innerHTML = `
        <h2>Settings</h2>
        <div class="form-group">
            <label for="settings-name">Your Name</label>
            <input type="text" id="settings-name" placeholder="Enter your name" />
        </div>
        <div class="form-group">
            <label for="settings-dob">Date of Birth</label>
            <input type="date" id="settings-dob" />
        </div>
        <fieldset class="toggle-group">
            <legend>Display</legend>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-month-labels" ${toggles.showMonthLabels ? 'checked' : ''} />
                <span>Month Labels</span>
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-seasons" ${toggles.showSeasons ? 'checked' : ''} />
                <span>Seasons & Equinoxes</span>
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-mood-trail" ${toggles.showMoodTrail ? 'checked' : ''} />
                <span>Mood Trail</span>
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-moon" ${toggles.showMoon ? 'checked' : ''} />
                <span>Moon Phase</span>
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-zodiac" ${toggles.showZodiac ? 'checked' : ''} />
                <span>Zodiac Constellations</span>
            </label>
        </fieldset>
        <button type="button" class="save-button">Save Settings</button>
        <section class="about-content">
            <h2>About Earth Calendar 2</h2>
            <p>
                Earth Calendar 2 is a visual calendar that maps the year onto Earth’s orbit,
                highlighting seasons, moods, and celestial companions in a single living scene.
            </p>

            <h3>Credits</h3>
            <ul>
                <li>Gemini by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/gemini/" target="_blank" title="Gemini Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Aries by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/aries/" target="_blank" title="Aries Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Sagittarius by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/sagittarius/" target="_blank" title="Sagittarius Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Libra by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/libra/" target="_blank" title="Libra Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Capricorn by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/capricorn/" target="_blank" title="Capricorn Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Cancer by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/cancer/" target="_blank" title="cancer Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Pisces by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/pisces/" target="_blank" title="Pisces Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Leo by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/leo/" target="_blank" title="Leo Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Scorpio by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/scorpio/" target="_blank" title="Scorpio Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Taurus by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/taurus/" target="_blank" title="Taurus Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Virgo by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/virgo/" target="_blank" title="Virgo Icons">Noun Project</a> (CC BY 3.0)</li>
                <li>Aquarius by Gregor Cresnar from <a href="https://thenounproject.com/browse/icons/term/aquarius/" target="_blank" title="Aquarius Icons">Noun Project</a> (CC BY 3.0)</li>
            </ul>
    </section>
    `;

    // Load existing values
    const nameInput = container.querySelector('#settings-name');
    const dobInput = container.querySelector('#settings-dob');
    const saveButton = container.querySelector('.save-button');

    nameInput.value = getUserName();
    dobInput.value = getUserDOB() || '';

    // Toggle change handlers (apply immediately)
    container.querySelector('#toggle-month-labels').addEventListener('change', (e) => {
        save(STORAGE_KEYS.SHOW_MONTH_LABELS, String(e.target.checked));
        setState({ showMonthLabels: e.target.checked });
    });
    container.querySelector('#toggle-seasons').addEventListener('change', (e) => {
        save(STORAGE_KEYS.SHOW_SEASONS, String(e.target.checked));
        setState({ showSeasons: e.target.checked });
    });
    container.querySelector('#toggle-mood-trail').addEventListener('change', (e) => {
        save(STORAGE_KEYS.SHOW_MOOD_TRAIL, String(e.target.checked));
        setState({ showMoodTrail: e.target.checked });
    });
    container.querySelector('#toggle-moon').addEventListener('change', (e) => {
        save(STORAGE_KEYS.SHOW_MOON, String(e.target.checked));
        setState({ showMoon: e.target.checked });
    });
    container.querySelector('#toggle-zodiac').addEventListener('change', (e) => {
        save(STORAGE_KEYS.SHOW_ZODIAC, String(e.target.checked));
        setState({ showZodiac: e.target.checked });
    });

    // Save handler
    saveButton.addEventListener('click', () => {
        setUserName(nameInput.value.trim());
        setUserDOB(dobInput.value);
        if (onSave) onSave();
    });

    return container;
}
