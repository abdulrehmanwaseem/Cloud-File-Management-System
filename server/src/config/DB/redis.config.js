import redis from "express-redis-cache";

const redisCache = redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  auth_pass: process.env.REDIS_PASSWORD,
  prefix: "docs_management_system",
  expire: 60 * 45,
});

export default redisCache;
