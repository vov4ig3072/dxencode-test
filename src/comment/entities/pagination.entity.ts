import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Comment } from './comment.entity'

@ObjectType()
export class PaginationComments {
  @Field(() => [Comment])
  comments?: Comment[]

  @Field(() => Int)
  totalCount: number

  @Field(() => Int)
  totalPages: number

  @Field(() => Int)
  currentPage: number
}
