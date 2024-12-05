import { Queue, Job, QueueEvents } from "bullmq";
import { Constants } from "@configs";
import { ECommentJobNames } from "@types";

export class CommentQueue {
  private static instance: CommentQueue;

  private queue: Queue;

  private queueEvents: QueueEvents;

  public constructor() {
    this.queue = new Queue(Constants.COMMENT_QUEUE, {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    this.queueEvents = new QueueEvents(Constants.COMMENT_QUEUE, {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }

  private static gI(): CommentQueue {
    if (!CommentQueue.instance) {
      CommentQueue.instance = new CommentQueue();
    }
    return CommentQueue.instance;
  }

  public async addCommentToArticle(articleId: number, nickname: string, parentCommentId: number | null, comment: string) {
    const job = await CommentQueue.gI().queue.add(ECommentJobNames.ADD_COMMENT, {
      articleId,
      parentCommentId: parentCommentId ?? null,
      nickname,
      comment,
    });

    await job.waitUntilFinished(CommentQueue.gI().queueEvents);
    const completedJob = await Job.fromId(CommentQueue.gI().queue, job.id);

    return completedJob.returnvalue;
  }

  public async replyCommentToArticle(articleId: number, nickname: string, parentCommentId: number | null, comment: string) {
    const job = await CommentQueue.gI().queue.add(ECommentJobNames.ADD_COMMENT, {
      articleId,
      parentCommentId,
      nickname,
      comment,
    });

    await job.waitUntilFinished(CommentQueue.gI().queueEvents);
    const completedJob = await Job.fromId(CommentQueue.gI().queue, job.id);

    return completedJob.returnvalue;
  }
}
