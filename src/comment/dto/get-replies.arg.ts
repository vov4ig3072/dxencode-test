import { ArgsType, Field, Int } from '@nestjs/graphql'
import { PaginationArgs } from './pagination.args'

@ArgsType()
export class GetRepliesArgs extends PaginationArgs {
  @Field(() => Int)
  parentId: number
}
