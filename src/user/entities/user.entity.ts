import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => Int)
  id: number

  @Field()
  username: string

  @Field()
  email: string

  @Field({ nullable: true })
  homepage?: string

  @Field()
  createdAt: Date
}
