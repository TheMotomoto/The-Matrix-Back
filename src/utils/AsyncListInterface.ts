export default interface AsyncListInterface<_any> {
  size(): Promise<number>;
  isEmpty(): Promise<boolean>;
  add(item: _any): Promise<void>;
  get(item: _any): Promise<_any | undefined>;
  remove(item: _any): Promise<void>;
  clear(): Promise<void>;
}
