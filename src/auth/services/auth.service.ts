import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ISecurityConfig } from '../../common/interfaces/config.interface'
import { UserService } from '../../user/user.service'
import { PasswordService } from './password.service'
import { CreateUserInput } from '../../user/dto/create-user.input'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private passwordService: PasswordService,
  ) {}

  private generateAccessToken(userId: number, email: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn:
          this.configService.get<ISecurityConfig>('security').expiresIn,
      },
    )
  }

  async singUp({ password, email, username, homepage }: CreateUserInput) {
    const hashedPassword = await this.passwordService.hashPassword(password)

    const user = await this.userService.createUser({
      password: hashedPassword,
      homepage,
      username,
      email,
    })

    return { token: await this.generateAccessToken(user.id, user.email) }
  }

  async singIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new BadRequestException('Access Denied')
    }

    const validated = await this.passwordService.validatePassword(
      password,
      user.password,
    )

    if (!validated) {
      throw new BadRequestException('Access Denied')
    }

    return { token: await this.generateAccessToken(user.id, user.email) }
  }
}
