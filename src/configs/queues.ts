import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { env } from '@configs';  // Assuming your Redis config is stored in the env file
import { Log } from '@helpers';
import { ECommentJobNames } from '@types';
import { CommentHelper } from '@modules/comments/helpers';

// Initialize a Redis connection
const logger = Log.getLogger();

const connection = {
  host: env.redisHost,
  port: Number(env.redisPort) || 6379,
};

const myQueue = new Queue('myQueue', { connection });

// Create QueueEvents instance
const queueEvents = new QueueEvents('myQueue', { connection });

// Process the job
const processJob = async (job: Job): Promise<any> => {
  if (job.name === ECommentJobNames.AddComment) {
    try {
      const commentHelper = new CommentHelper();  // Instantiate CommentHelper
      const result = await commentHelper.addComment(job);  // Pass the whole job to addComment
      logger.info(`Job ${job.id} processed successfully.`);

      return { success: true, jobId: job.id, data: result };  // Return the result from the addComment method
    } catch (error) {
      logger.error(`Error processing job ID ${job.id}: ${error.message}`);
      return { success: false, message: `Error processing job: ${error.message}` };
    }
  }
  return { success: false, message: 'Invalid job name' };
};

const worker = new Worker(
  'myQueue',
  async (job: Job) => {
    logger.info(`Processing job ${job.id}`);

    const result = await processJob(job);
    return result;
  },
  { connection }
);

export { myQueue, worker, queueEvents };
