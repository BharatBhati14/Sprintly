const databseUrl = process.env.DATABASE_URL;

if (!databseUrl) {
  throw new Error("Database Url is not defined!");
}

const nodeEnv = process.env.NODE_ENV;

export const env = {
  DATABASE_URL: databseUrl,
  NODE_ENV: nodeEnv,
} as const;
