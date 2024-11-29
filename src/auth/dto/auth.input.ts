import { InputType, Field } from '@nestjs/graphql'
import { CreateUserInput } from '../../user/dto/create-user.input'
import { IsNotEmpty } from 'class-validator'
import { IsCaptchaVerified } from '../../common/decorators/is-captcha-verified-constraint.service'

@InputType()
export class SignUpInput extends CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsCaptchaVerified()
  captchaId: string
}
