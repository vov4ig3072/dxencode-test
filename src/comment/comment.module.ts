import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentResolver } from './comment.resolver'
import { PrismaService } from '../prisma/prisma.service'
import { UploadFileAdapter } from 'src/common/utils/upload-file.adapter'
import { FileService } from '../file/file.service'
import { CacheService } from '../cache/cache.service'
import { DateScalar } from '../common/scalars/date.scalar'

@Module({
  providers: [
    CommentService,
    CommentResolver,
    PrismaService,
    UploadFileAdapter,
    FileService,
    CacheService,
    DateScalar,
  ],
})
export class CommentModule {}
