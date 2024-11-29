import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class Captcha {
  @Field()
  id: string

  @Field()
  data: string
}
