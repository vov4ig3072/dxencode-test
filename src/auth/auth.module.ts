import { Module } from '@nestjs/common'
import { CaptchaService } from '../captcha/captcha.service'
import { CaptchaResolver } from '../captcha/captcha.resolver'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ISecurityConfig } from '../common/interfaces/config.interface'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from '../prisma/prisma.module'
import { JwtStrategy } from './jwt.strategy'
import { AuthService } from './services/auth.service'
import { AuthResolver } from './auth.resolver'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { IsCaptchaVerifiedConstraint } from '../common/decorators/is-captcha-verified-constraint.service'
import { UserService } from '../user/user.service'
import { PasswordService } from './services/password.service'

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const securityConfig = config.get<ISecurityConfig>('security')
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            algorithm: securityConfig.algorithm,
            expiresIn: securityConfig.expiresIn,
          },
        }
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    CaptchaService,
    CaptchaResolver,
    JwtStrategy,
    AuthService,
    AuthResolver,
    IsCaptchaVerifiedConstraint,
    UserService,
    PasswordService,
  ],
})
export class AuthModule {}
