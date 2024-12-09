import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CommentService } from './comment.service'
import { CreateCommentInput } from './dto/create-comment.input'
import { Comment } from './entities/comment.entity'
import { GetCommentsArgs } from './dto/get-comments.arg'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { GetRepliesArgs } from './dto/get-replies.arg'
import { PaginationComments } from './entities/pagination.entity'
import { UploadFileAdapter } from '../common/utils/upload-file.adapter'
import { CacheService } from '../cache/cache.service'

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private readonly commentsService: CommentService,
    private readonly fileAdapter: UploadFileAdapter,
    private readonly cacheService: CacheService,
  ) {}

  @Query(() => PaginationComments, { name: 'replyComments' })
  async findReplies(@Args() args: GetRepliesArgs) {
    const key = `replies-${args.parentId}:${JSON.stringify(args)}`
    let replies = await this.cacheService.get(key)

    if (!replies) {
      replies = await this.commentsService.findReplies(args)

      await this.cacheService.set(key, replies, 60 * 60)
    }

    return replies
  }

  @Query(() => PaginationComments, { name: 'topLevelComments' })
  async getTopLevelComments(@Args() args: GetCommentsArgs) {
    const key = `comments:${JSON.stringify(args)}`
    const { page, limit, sortBy, sortOrder } = args
    let comments = await this.cacheService.get(key)

    if (!comments) {
      comments = await this.commentsService.getTopLevelComments(
        page,
        limit,
        sortBy,
        sortOrder,
      )

      await this.cacheService.set(key, comments, 60 * 60)
    }

    return comments
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    const { image, textFile, parentId } = createCommentInput

    await this.cacheService.deleteMany(
      parentId ? `replies-${parentId}` : 'comments',
    )

    const imageBuffer = image
      ? await this.streamToBuffer((await image).createReadStream())
      : undefined

    const textFileBuffer = textFile
      ? await this.streamToBuffer((await textFile).createReadStream())
      : undefined

    return this.commentsService.createComment(
      createCommentInput,
      this.fileAdapter.adaptFileUpload(await image, imageBuffer),
      this.fileAdapter.adaptFileUpload(await textFile, textFileBuffer),
    )
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', (err) => reject(err))
    })
  }
}
