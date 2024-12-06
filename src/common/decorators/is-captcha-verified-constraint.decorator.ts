import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCaptchaVerifiedConstraint
  implements ValidatorConstraintInterface
{
  private verifiedCaptchaIds = new Set<string>()

  constructor() {}
  @OnEvent('captcha.verified')
  handleOrderCreatedEvent({ verifiedId }: { verifiedId: string }) {
    this.verifiedCaptchaIds.add(verifiedId)
  }

  async validate(captchaId: string): Promise<boolean> {
    if (this.verifiedCaptchaIds.has(captchaId)) {
      this.verifiedCaptchaIds.delete(captchaId)
      return true
    }
    return false
  }

  defaultMessage(): string {
    return 'Captcha is not verified!'
  }
}

export function IsCaptchaVerified(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCaptchaVerifiedConstraint,
    })
  }
}
