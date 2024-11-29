import { Injectable } from '@nestjs/common'
import * as svgCaptcha from 'svg-captcha'
import { ConfigService } from '@nestjs/config'
import { ICaptchaConfig } from '../common/interfaces/config.interface'
import { Captcha } from './entities/captcha.entity'
import { VerifyCaptchaInput } from './dto/captcha.input'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class CaptchaService {
  private captchaStore = new Map<string, string>()
  private readonly captchaConfig: ICaptchaConfig
  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.captchaConfig = configService.get<ICaptchaConfig>('captcha')
  }
  generateCaptcha(): Captcha {
    const { size, noise, color } = this.captchaConfig

    const captcha = svgCaptcha.create({
      size,
      noise,
      color,
    })

    const id = Date.now().toString()
    this.captchaStore.set(id, captcha.text)

    setTimeout(() => this.captchaStore.delete(id), 300000)

    return { id, data: captcha.data }
  }

  verifyCaptcha({ text, id }: VerifyCaptchaInput): boolean {
    const storedText = this.captchaStore.get(id)
    if (!storedText || storedText.toLowerCase() !== text.toLowerCase()) {
      return false
    }

    this.eventEmitter.emit('captcha.verified', { verifiedId: id })
    this.captchaStore.delete(id)

    return true
  }
}
