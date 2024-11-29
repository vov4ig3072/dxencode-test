import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class VerifyCaptchaInput {
  @Field()
  id: string

  @Field()
  text: string
}
