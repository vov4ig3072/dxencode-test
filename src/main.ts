import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { INestConfig } from './common/interfaces/config.interface'
import { useContainer } from 'class-validator'
import { graphqlUploadExpress } from 'graphql-upload-ts'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.use(
    graphqlUploadExpress({
      maxFileSize: 2 * 1024 * 1024,
      maxFiles: 5,
      overrideSendResponse: false,
    }),
  )

  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(
    configService.get<INestConfig>('nest').port ?? process.env.PORT ?? 3000,
  )
}
bootstrap()
