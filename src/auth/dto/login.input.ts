import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { IsCaptchaVerified } from '../../common/decorators/is-captcha-verified-constraint.decorator'

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  password: string

  @Field()
  @IsNotEmpty()
  @IsCaptchaVerified()
  captchaId: string
}
