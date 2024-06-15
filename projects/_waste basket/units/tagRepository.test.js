const { addTag } = require('./tagRepository');

test('adds a new tag to the database', async () => {
  const result = await addTag('TDD');
  expect(result).toBe(true);
});

test('removes a tag from the database', async() => {
  
})
