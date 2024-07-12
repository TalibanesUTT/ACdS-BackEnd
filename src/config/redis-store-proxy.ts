/* eslint-disable @typescript-eslint/no-unused-vars */
import { Milliseconds, Store } from "cache-manager";
import { RedisStore } from "cache-manager-redis-store";

export class RedisStoreProxy implements Store {
    private readonly redisStore: RedisStore;

    constructor(redisStore: RedisStore) {
        this.redisStore = redisStore;
    }
    reset(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    mset(
        arguments_: Array<[string, unknown]>,
        ttl?: Milliseconds,
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    mget(...arguments_: string[]): Promise<unknown[]> {
        throw new Error("Method not implemented.");
    }
    mdel(...arguments_: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    keys(pattern?: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    ttl(key: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    // Implementing Store interface methods
    get(name: string): Promise<any> {
        return this.redisStore.get(name, null, null);
    }

    set(name: string, value: any, options?: any): Promise<any> {
        return this.redisStore.set(name, value, options, null);
    }

    del(name: string): Promise<any> {
        return this.redisStore.del(name);
    }

    // Add more methods as needed
}
