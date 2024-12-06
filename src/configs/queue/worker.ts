import { Worker, Job } from "bullmq";
import { env } from "@configs";
import { Log } from "@helpers";
import { EQueue, ECommentJobNames } from "@types";
import { CommentHelper } from "@modules/comments/helpers";

// Redis connection configuration
const connection = {
  host: env.redisHost,
  port: env.redisPort,
};

const logger = Log.getLogger();

export class QueueWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      EQueue.Comment,
      this.processJob,
      { connection }
    );
    logger.info(`Worker for queue "${EQueue.Comment}" initialized.`);
  }

  // Method to process jobs
  private async processJob(job: Job): Promise<any> {
    logger.info(`Processing job ${job.id}`);
    if (job.name === ECommentJobNames.AddComment) {
      try {
        const commentHelper = new CommentHelper();
        const result = await commentHelper.addComment(job);
        logger.info(`Job ${job.id} processed successfully.`);
        return { success: true, jobId: job.id, data: result };
      } catch (error) {
        logger.error(`Error processing job ID ${job.id}: ${error.message}`);
        return { success: false, message: `Error processing job: ${error.message}` };
      }
    }
    return { success: false, message: "Invalid job name" };
  }

  // Graceful shutdown for the worker
  public async shutdown() {
    await this.worker.close();
    logger.info(`Worker for queue "${EQueue.Comment}" shut down.`);
  }
}
