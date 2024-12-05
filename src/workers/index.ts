import { CommentsWorker } from "@modules/comments/workers/comments.worker";

// Initialize all workers here
export const workers = {
  commentsWorker: new CommentsWorker(),
};
