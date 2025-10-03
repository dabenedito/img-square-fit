import PQueue from "p-queue";
import { QueueStatus } from "../types/queue-status";

export class QueueService {
  queue:  PQueue;

  constructor(concurrency = 4) {
    this.queue = new PQueue({ concurrency });
  }

  schedule<T>(task: () => Promise<T>): Promise<T> {
    return this.queue.add(task);
  }

  getStatus(): QueueStatus {
    return {
      pending: this.queue.pending,
      size:  this.queue.size,
      isPaused: this.queue.isPaused
    }
  }

  pause() {
    this.queue.pause();
  }

  resume() {
    this.queue.start();
  }
}