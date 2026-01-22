// helpers/authHelper.js
import bcrypt from "bcrypt";

// Hash a password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log("Error hashing password:", error);
  }
};

// Compare a plain password with a hashed password
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log("Error comparing password:", error);
    return false;
  }
};
