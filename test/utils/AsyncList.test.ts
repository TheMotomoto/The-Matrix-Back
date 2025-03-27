import { describe, it, expect, beforeEach } from 'vitest'; 
import AsyncList from '../../src/utils/AsynctList.js';
import { Worker } from 'node:worker_threads'; 
import { resolve } from 'node:path'; 
 
describe('AsyncList', () => { 
  let list: AsyncList<number>; 
   
  beforeEach(() => { 
    list = new AsyncList<number>(); 
  }); 
   
  describe('isEmpty', () => { 
    it('should return true when list is empty', async () => { 
      const result = await list.isEmpty(); 
      expect(result).toBe(true); 
    }); 
     
    it('should return false when list is not empty', async () => { 
      await list.add(1); 
      const result = await list.isEmpty(); 
      expect(result).toBe(false); 
    }); 
     
    it('should return true after all items are removed', async () => { 
      await list.add(1); 
      await list.remove(1); 
      const result = await list.isEmpty(); 
      expect(result).toBe(true); 
    }); 
     
    it('should correctly reflect list state after multiple operations', async () => { 
      expect(await list.isEmpty()).toBe(true); 
      await list.add(10); 
      await list.add(20); 
      expect(await list.isEmpty()).toBe(false); 
      await list.remove(10); 
      expect(await list.isEmpty()).toBe(false); 
      await list.remove(20); 
      expect(await list.isEmpty()).toBe(true); 
      await list.add(30); 
      expect(await list.isEmpty()).toBe(false); 
    }); 
  }); 
 
  describe('thread safety', () => { 
    it('should maintain integrity with multiple threads adding items', async () => { 
      const threads = 300; 
      const fileName = resolve(__dirname, '../../dist/src/workers/worker.js'); 
      const numbers = new AsyncList<number>(); 
      const results: Promise<number>[] = []; 
      // 300 threads adding 1 item each
      for (let i = 0; i < threads; i++) { 
        results.push( 
          new Promise((resolve, reject) => { 
            const worker = new Worker(fileName, { 
              workerData: { value: i }  
            }); 
             
            worker.on('message', (data) => { 
              numbers.add(data).then(() => { 
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
    it('should handle concurrent add and remove without race conditions', async () => { 
      const threads = 100; 
      const workerPromises: Promise<number>[] = []; 
       
      expect(await list.size()).toBe(0); 
       
      const fileName = resolve(__dirname, '../../dist/src/workers/worker.js'); 
      for (let i = 0; i < threads; i++) { 
        workerPromises.push(new Promise((resolve, reject) => { 
          const worker = new Worker(fileName, { 
            workerData: { value: i } 
          }); 
          worker.on('message', async (data) => { 
            try { 
              await list.add(data); 
              await list.remove(data); 
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
      expect(await list.size()).toBe(0); 
    }); 
  }); 
 
  describe('get', () => { 
    it('should consistently find elements with concurrent get calls', async () => { 
      const list = new AsyncList<number>(); 
      const targetValue = 42;
      await list.add(targetValue); 
      
      const threads = 100; 
      for(let i = 0; i < threads; i++) { 
        await list.add(i); 
      } 
 
      const getPromises: Promise<number | undefined>[] = []; 
      for (let i = 0; i < threads; i++) { 
        getPromises.push(list.get(targetValue)); 
      } 
       
      const results = await Promise.all(getPromises); 
 
      
      for (const result of results) { 
        expect(result).toBe(targetValue); 
      } 
    }); 
  });

  describe('clear', () => {
    it('should empty the list when called', async () => {
      await list.add(1);
      await list.add(2);
      await list.add(3);
      
      expect(await list.size()).toBe(3);
      await list.clear();
      expect(await list.size()).toBe(0);
      expect(await list.isEmpty()).toBe(true);
    });
    
    it('should be safe to call on an empty list', async () => {
      expect(await list.isEmpty()).toBe(true);
      await list.clear();
      expect(await list.isEmpty()).toBe(true);
    });
  });

  describe('add and remove', () => {
    it('should correctly add and remove multiple items', async () => {
      await list.add(10);
      await list.add(20);
      await list.add(30);
      
      expect(await list.size()).toBe(3);
      
      const item10 = await list.get(10);
      const item20 = await list.get(20);
      const item30 = await list.get(30);
      
      expect(item10).toBe(10);
      expect(item20).toBe(20);
      expect(item30).toBe(30);
      
      await list.remove(20);
      expect(await list.size()).toBe(2);
      expect(await list.get(20)).toBeUndefined();
      
      await list.remove(10);
      await list.remove(30);
      expect(await list.isEmpty()).toBe(true);
    });
    
    it('should handle removing non-existent items', async () => {
      await list.add(10);
      await list.remove(999); 
      
      expect(await list.size()).toBe(1);
      expect(await list.get(10)).toBe(10);
    });
  });

  describe('concurrent operations', () => {
    it('should maintain consistency with multiple concurrent operations', async () => {
      const operations = [];
      
      for (let i = 0; i < 100; i++) {
        operations.push(list.add(i));
      }
      for (let i = 0; i < 50; i++) {
        operations.push(list.remove(i));
      }
      for (let i = 0; i < 20; i++) {
        operations.push(list.size());
      }
      await Promise.all(operations);
      expect(await list.size()).toBe(50);
      for (let i = 0; i < 50; i++) {
        expect(await list.get(i)).toBeUndefined();
      }
      for (let i = 50; i < 100; i++) {
        expect(await list.get(i)).toBe(i);
      }
    });
  });
});