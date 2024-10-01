import { Queue, Worker } from "bullmq";
import { defaultJobOptions, redisConnection } from "../config/queue.js";
import logger from "../config/logger.js";
import sendEmail from "../config/mailer.js";

export const EMAIL_QUEUE_NAME = "email-quene";

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: defaultJobOptions,
});

// * Workers
export const handler = new Worker(
  EMAIL_QUEUE_NAME,
  async (job) => {
    const data = job.data;
    console.log("the email worker data is", data);
    const emails = data?.map((item) =>
      sendEmail(item.toEmail, item.subject, item.body)
    );
    try {
      await Promise.allSettled(emails);
    } catch (e) {
      console.log(e);
    }
  },
  {
    connection: redisConnection,
  }
);

// * Worker Listeners

handler.on("completed", (job) => {
  logger.info({ job, message: "Job completed" });
  console.log(`the job ${job.id} is complete`);
});
handler.on("failed", (job) => {
  console.log(`the job ${job.id} is failed`);
});
