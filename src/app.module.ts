import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { CommentModule } from './comment/comment.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'node:path'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { CaptchaModule } from './captcha/captcha.module'
import { FileModule } from './file/file.module'
import config from './common/configuration/config'

@Module({
  imports: [
    PrismaModule,
    UserModule,
    CommentModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      csrfPrevention: false,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CaptchaModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
