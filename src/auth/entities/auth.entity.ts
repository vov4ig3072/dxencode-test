import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Auth {
  @Field()
  token: string
}
