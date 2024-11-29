import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { CaptchaService } from './captcha.service'
import { Captcha } from './entities/captcha.entity'
import { VerifyCaptchaInput } from './dto/captcha.input'

@Resolver(() => Captcha)
export class CaptchaResolver {
  constructor(private readonly captchaService: CaptchaService) {}

  @Query(() => Captcha)
  generateCaptcha() {
    return this.captchaService.generateCaptcha()
  }

  @Mutation(() => Boolean)
  verifyCaptcha(
    @Args('verifyCaptchaInput') input: VerifyCaptchaInput,
  ): boolean {
    return this.captchaService.verifyCaptcha(input)
  }
}
