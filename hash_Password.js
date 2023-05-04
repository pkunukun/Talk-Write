const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Hashed password: ${hashedPassword}`);
  } catch (err) {
    console.log('Error hashing password', err.message);
  }
}

hashPassword('NiteshNishanth');