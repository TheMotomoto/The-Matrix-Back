interface AsyncQueueInterface<T> {
  enqueue: (item: T) => Promise<void>;
  dequeue: () => Promise<T | undefined>;
  size: () => Promise<number>;
  isEmpty: () => Promise<boolean>;
}
export default AsyncQueueInterface;
