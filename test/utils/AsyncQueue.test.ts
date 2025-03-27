import { describe, it, expect, beforeEach } from 'vitest';
import AsyncQueue from '../../src/utils/AsyncQueue.js';
import {Worker} from 'node:worker_threads';
import { resolve } from 'node:path';


describe('AsyncQueue', () => {
  let queue: AsyncQueue<number>;
  
  beforeEach(() => {
    queue = new AsyncQueue<number>();
  });
  
  describe('isEmpty', () => {
    it('should return true when queue is empty', async () => {
      const result = await queue.isEmpty();
      expect(result).toBe(true);
    });
    
    it('should return false when queue is not empty', async () => {
      await queue.enqueue(1);
      const result = await queue.isEmpty();
      expect(result).toBe(false);
    });
    
    it('should return true after all items are dequeued', async () => {
      await queue.enqueue(1);
      await queue.dequeue();
      const result = await queue.isEmpty();
      expect(result).toBe(true);
    });
    
    it('should correctly reflect queue state after multiple operations', async () => {
      expect(await queue.isEmpty()).toBe(true);
      await queue.enqueue(10);
      await queue.enqueue(20);
      expect(await queue.isEmpty()).toBe(false);
      await queue.dequeue();
      expect(await queue.isEmpty()).toBe(false);
      await queue.dequeue();
      expect(await queue.isEmpty()).toBe(true);
      await queue.enqueue(30);
      expect(await queue.isEmpty()).toBe(false);
    });
  });

  describe('thread safety', () => {
    it('should return the same value with multiple threads', async () => {
      const threads = 300;
      const fileName = resolve(__dirname, '../../dist/src/workers/worker.js');
      const numbers = new AsyncQueue<number>();
      const results: Promise<number>[] = [];
      
      
      for (let i = 0; i < threads; i++) {
        results.push(
          new Promise((resolve, reject) => {
            const worker = new Worker(fileName, {
              workerData: { value: i } 
            });
            
            worker.on('message', (data) => {
              numbers.enqueue(data).then(() => {
                resolve(data);
              }).catch(reject);
            });
            
            worker.on('error', reject);
            worker.on('exit', (code) => {
              if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          })
        );
      }
      
      await Promise.all(results);
      
      expect(await numbers.size()).toBe(threads);
    });
  });

  describe('size', () => {
    it('should handle concurrent enqueue and dequeue without race conditions', async () => {
      const threads = 100;
      const workerPromises: Promise<number>[] = [];
      
      expect(await queue.size()).toBe(0);
      
      const fileName = resolve(__dirname, '../../dist/src/workers/worker.js');
      for (let i = 0; i < threads; i++) {
        workerPromises.push(new Promise((resolve, reject) => {
          const worker = new Worker(fileName, {
            workerData: { value: i }
          });
          worker.on('message', async (data) => {
            try {
              await queue.enqueue(data);
              const dequeued = await queue.dequeue();
              expect(dequeued).toBe(data);
              resolve(data);
            } catch (err) {
              reject(err);
            }
          });
          worker.on('error', reject);
          worker.on('exit', (code) => {
            if (code !== 0) {
              reject(new Error(`Worker stopped with exit code ${code}`));
            }
          });
        }));
      }
      await Promise.all(workerPromises);
      expect(await queue.size()).toBe(0);
    });
    

  });


  describe('peek', () => {
    
    it('should consistently return the first element with concurrent peek calls', async () => {
      // Creamos una nueva instancia de la cola
      const queue = new AsyncQueue<number>();
      const threads = 100;
      await queue.enqueue(42);
      for(let i = 0; i < threads; i++) {
        await queue.enqueue(i);
      }

      const peekPromises: Promise<number | undefined>[] = [];
      for (let i = 0; i < threads; i++) {
        peekPromises.push(queue.peek());
      }
      
      const results = await Promise.all(peekPromises);

      // Always returns the First element in, FIFO
      for( const result of results) {
        expect(result).toBe(42);
      }
    });
  })
});