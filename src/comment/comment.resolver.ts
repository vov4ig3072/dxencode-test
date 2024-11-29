import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CommentService } from './comment.service'
import { CreateCommentInput } from './dto/create-comment.input'
import { Comment } from './entities/comment.entity'
import { GetCommentsArgs } from './dto/get-comments.arg'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'
import { GetRepliesArgs } from './dto/get-replies.arg'
import { PaginationComments } from './entities/pagination.entity'

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentsService: CommentService) {}
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentsService.createComment(createCommentInput)
  }
}
