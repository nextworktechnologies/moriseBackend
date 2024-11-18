import bcrypt from "bcrypt";

export const HashPassword = async (password) => {
  try {
    const Rounds = 10;
    const hashedPassword = await bcrypt.hash(password, Rounds);
    return hashedPassword;
  } catch (error) {
    console.log("error in Password encryption=>", error);
  }
};

export const ComparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
