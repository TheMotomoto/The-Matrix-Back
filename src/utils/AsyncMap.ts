import { Mutex } from 'async-mutex';
import type AsyncMapInterface from './AsyncMapInterface.js';

export default class AsyncMap<_any, _any2> implements AsyncMapInterface<_any, _any2> {
  private map: Map<_any, _any2>;
  private mutex;
  constructor() {
    this.map = new Map();
    this.mutex = new Mutex();
  }

  public async size(): Promise<number> {
    return await this.mutex.runExclusive(() => {
      return this.map.size;
    });
  }
  public async add(key: _any, value: _any2): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.map.set(key, value);
    });
  }
  public async get(key: _any): Promise<_any2 | undefined> {
    return await this.mutex.runExclusive(() => {
      return this.map.get(key);
    });
  }
  public async remove(key: _any): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.map.delete(key);
    });
  }
  public async clear(): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.map.clear();
    });
  }
}
