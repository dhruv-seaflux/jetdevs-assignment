import { Queue, QueueEvents } from "bullmq";
import { env } from "@configs";
import { EQueue } from "@types";

// Redis connection configuration
const connection = {
  host: env.redisHost,
  port: env.redisPort,
};

// Create and export the queue
export const commentQueue = new Queue(EQueue.Comment, { connection });

// Create and export queue events
export const queueEvents = new QueueEvents(EQueue.Comment, { connection });
