export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};

export const defaultJobOptions = {
  attempts: 3,
  removeOnComplete: {
    age: 60 * 30, // 30 minutes
  },
  removeOnFail: {
    count: 100,
    age: 60 * 30, // 30 minutes
  },
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};
