const addTag = (tags, newTag) => [...tags, newTag];
const removeTag = (tags, tagToRemove) => tags.filter(tag => tag !== tagToRemove);
const getAllTags = (tags) => [...tags];
const tagExists = (tags, tagToCheck) => tags.includes(tagToCheck);

module.exports = { addTag, removeTag, getAllTags, tagExists };


