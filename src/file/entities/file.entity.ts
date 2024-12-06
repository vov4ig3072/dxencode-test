import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Comment } from '../../comment/entities/comment.entity'

@ObjectType()
export class File {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  commentId: number

  @Field(() => Comment)
  comment: Comment

  @Field()
  path: string

  @Field()
  type: string

  @Field()
  createdAt: Date
}

@ObjectType()
export class FileTypeEntity {
  @Field()
  path: string

  @Field()
  type: string
}
