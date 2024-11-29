import { Module } from '@nestjs/common'
import { CaptchaService } from './captcha.service'
import { CaptchaResolver } from './captcha.resolver'

@Module({
  providers: [CaptchaService, CaptchaResolver],
  exports: [CaptchaService],
})
export class CaptchaModule {}
