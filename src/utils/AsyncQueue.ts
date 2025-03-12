import { Mutex } from 'async-mutex';
import type AsyncQueueInterface from './AsyncQueueInterface.js';

class AsyncQueue<_any> implements AsyncQueueInterface<_any> {
  private queue: _any[] = [];
  private mutex = new Mutex();

  public async size(): Promise<number> {
    return await this.mutex.runExclusive(() => {
      return this.queue.length;
    });
  }

  public async isEmpty(): Promise<boolean> {
    return await this.mutex.runExclusive(() => {
      return this.queue.length === 0;
    });
  }

  public async peek(): Promise<_any | undefined> {
    return await this.mutex.runExclusive(() => {
      return this.queue[0];
    });
  }

  public async enqueue(item: _any): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.queue.push(item);
    });
  }

  public async dequeue(): Promise<_any | undefined> {
    return await this.mutex.runExclusive(() => {
      return this.queue.shift();
    });
  }
}
export default AsyncQueue;
