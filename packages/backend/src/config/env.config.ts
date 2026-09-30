export const envConfig = {
  jwtSecret: process.env.JWT_SECRET || 'iclix-dev-secret-key-change-in-production',
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://iclix:iclix_dev@localhost:5432/iclix',
};
