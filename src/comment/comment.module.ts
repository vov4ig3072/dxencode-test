import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentResolver } from './comment.resolver'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  providers: [CommentService, CommentResolver, PrismaService],
})
export class CommentModule {}
