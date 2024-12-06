import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CommentService } from './comment.service'
import { CreateCommentInput } from './dto/create-comment.input'
import { Comment } from './entities/comment.entity'
import { GetCommentsArgs } from './dto/get-comments.arg'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { GetRepliesArgs } from './dto/get-replies.arg'
import { PaginationComments } from './entities/pagination.entity'
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts'
import { UploadFileAdapter } from '../common/utils/upload-file.adapter'

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private readonly commentsService: CommentService,
    private readonly fileAdapter: UploadFileAdapter,
  ) {}
  @Query(() => PaginationComments, { name: 'replyComments' })
  findReplies(@Args() args: GetRepliesArgs) {
    return this.commentsService.findReplies(args)
  }

  @Query(() => PaginationComments, { name: 'topLevelComments' })
  async getTopLevelComments(@Args() args: GetCommentsArgs) {
    const { page, limit, sortBy, sortOrder } = args

    return this.commentsService.getTopLevelComments(
      page,
      limit,
      sortBy,
      sortOrder,
    )
  }

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    // @Args({ name: 'image', type: () => GraphQLUpload, nullable: true })
    // image?: FileUpload,
    // @Args({ name: 'textFile', type: () => GraphQLUpload, nullable: true })
    // textFile?: FileUpload,
  ) {
    const { image, textFile } = createCommentInput
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
