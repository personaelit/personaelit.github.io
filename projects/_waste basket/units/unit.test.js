const { Unit, GlobalTags } = require('./main');  // Replace 'your-file' with the actual file name

describe('Unit and GlobalTags', () => {
  let globalTags;

  beforeEach(() => {
    globalTags = new GlobalTags();
    globalTags.tags.clear();  // Reset tags before each test
  });

  test('should add tags to globalTags when creating a Unit', () => {
    const unit = new Unit(1, "Unit1", "active", 1, "First unit", ["tag1", "tag2"], globalTags);
    expect(globalTags.hasTag("tag1")).toBe(true);
    expect(globalTags.hasTag("tag2")).toBe(true);
  });

  test('should manipulate globalTags directly', () => {
    globalTags.addTag("tag3");
    expect(globalTags.hasTag("tag3")).toBe(true);

    globalTags.removeTag("tag3");
    expect(globalTags.hasTag("tag3")).toBe(false);
  });

  // Add more tests as needed
});
