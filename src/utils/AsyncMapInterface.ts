export default interface AsyncListInterface<_any, _any2> {
    size(): Promise<number>;
    add(key: _any, value:_any2): Promise<void>;
    get(key: _any): Promise<_any2 | undefined>;
    remove(item: _any): Promise<void>;
    clear(): Promise<void>;
}