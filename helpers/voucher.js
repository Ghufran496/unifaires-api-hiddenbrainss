const { v4: uuidv4 } = require("uuid");

function generateUnique10CharacterUUID() {
  const prefix = uuidv4().substring(0, 6); // Use the first 6 characters from a standard UUID.
  const randomChars = generateRandomCharacters(4); // Generate 4 random characters.
  const uniqueId = prefix + randomChars;

  return uniqueId;
}

function generateRandomCharacters(length) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomChars = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomChars += characters.charAt(randomIndex);
  }
  return randomChars;
}

module.exports = {
  generateUnique10CharacterUUID, // Export the function
};
