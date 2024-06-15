const { addTag, removeTag, getAllTags, tagExists } = require('./tagManager');

test('adds a new tag', () => {
    const tags = ['nodejs', 'jest'];
    expect(addTag(tags, 'TDD')).toEqual(['nodejs', 'jest', 'TDD']);
});

test('removes a tag', () => {
    const tags = ['nodejs', 'jest', 'TDD'];
    expect(removeTag(tags, 'jest')).toEqual(['nodejs', 'TDD']);
});

test('gets all tags', () => {
    const tags = ['nodejs', 'jest'];
    expect(getAllTags(tags)).toEqual(['nodejs', 'jest']);
});

test('checks if a tag exists', () => {
    const tags = ['nodejs', 'jest'];
    expect(tagExists(tags, 'nodejs')).toBe(true);
    expect(tagExists(tags, 'mocha')).toBe(false);
});