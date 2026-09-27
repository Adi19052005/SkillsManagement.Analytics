import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (
  name: string
): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is missing in environment variables`
    );
  }

  return value;
};

export const ENV = {
  PORT: Number(process.env.PORT || 4000),

  JWT_SECRET: requiredEnv("JWT_SECRET"),

  DATABASE_URL: requiredEnv("DATABASE_URL"),

  GROQ_API_KEY: requiredEnv("GROQ_API_KEY"),
};