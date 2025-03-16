import { Mutex } from 'async-mutex';
import type AsyncListInterface from './AsyncListInterface.js';

export default class AsyncList<_any> implements AsyncListInterface<_any> {
  private list: _any[];
  private mutex: Mutex;

  constructor() {
    this.mutex = new Mutex();
    this.list = [];
  }

  async size(): Promise<number> {
    return await this.mutex.runExclusive(() => {
      return this.list.length;
    });
  }
  async isEmpty(): Promise<boolean> {
    return await this.mutex.runExclusive(() => {
      return this.list.length === 0;
    });
  }

  async add(item: _any): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.list.push(item);
    });
  }

  async get(item: _any): Promise<_any | undefined> {
    return await this.mutex.runExclusive(() => {
      return this.list.find((element) => element === item);
    });
  }
  async remove(item: _any): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.list = this.list.filter((element) => element !== item);
    });
  }
  async clear(): Promise<void> {
    await this.mutex.runExclusive(() => {
      this.list = [];
    });
  }
}
