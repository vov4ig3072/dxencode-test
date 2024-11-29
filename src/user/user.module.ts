import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { PrismaService } from '../prisma/prisma.service'
import { IsEmailUniqueConstraint } from '../common/decorators/is-unique.decorator'

@Module({
  providers: [
    UserService,
    UserResolver,
    PrismaService,
    IsEmailUniqueConstraint,
  ],
  exports: [UserService],
})
export class UserModule {}
