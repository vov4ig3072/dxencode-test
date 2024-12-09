import { Global, Module } from '@nestjs/common'
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis'
import { ConfigService } from '@nestjs/config'
import { IRedisConfig } from '../common/interfaces/config.interface'
import { CacheService } from './cache.service'

@Global()
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { url } = configService.get<IRedisConfig>('redis')
        return { type: 'single', url }
      },
    }),
  ],
  providers: [CacheService],
  exports: [NestRedisModule, CacheService],
})
export class CacheModule {}
