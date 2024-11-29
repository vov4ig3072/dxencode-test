import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './services/auth.service'
import { Auth } from './entities/auth.entity'
import { SignUpInput } from './dto/auth.input'
import { LoginInput } from './dto/login.input'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation(() => Auth)
  singUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<Auth> {
    const { captchaId, ...login } = signUpInput
    return this.authService.singUp(login)
  }

  @Mutation(() => Auth)
  login(@Args('loginInput') { email, password }: LoginInput): Promise<Auth> {
    return this.authService.singIn(email, password)
  }
}
