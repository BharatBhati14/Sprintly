const databseUrl = process.env.DATABASE_URL;

if (!databseUrl) {
  throw new Error("Database Url is not defined!");
}

export const env = {
  DATABASE_URL: databseUrl,
} as const;
