import { ArgsType, Field, Int } from '@nestjs/graphql'
import {
  SortCommentFieldEnum,
  SortOrderEnum,
} from '../../common/enum/sortCommentFieldEnum'
import { PaginationArgs } from './pagination.args'

@ArgsType()
export class GetCommentsArgs extends PaginationArgs {
  @Field(() => SortCommentFieldEnum, { nullable: true })
  sortBy?: SortCommentFieldEnum

  @Field(() => SortOrderEnum, { nullable: true })
  sortOrder?: SortOrderEnum
}
