import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = JSON.stringify(value)
    if (ttl) {
      await this.redis.set(key, data, 'EX', ttl)
    } else {
      await this.redis.set(key, data)
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async deleteMany(pattern?: string): Promise<void> {
    let keys: Array<string>

    if (!pattern) {
      keys = await this.redis.keys('*')
    } else {
      keys = await this.redis.keys(pattern)
    }

    await Promise.all(keys.map(async (k) => await this.redis.del(k)))
  }
}
