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

  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  app.use(
    graphqlUploadExpress({
      maxFileSize: 2 * 1024 * 1024,
      maxFiles: 5,
      overrideSendResponse: false,
    }),
  )

  await app.listen(
    configService.get<INestConfig>('nest').port ?? process.env.PORT ?? 3000,
  )
}
bootstrap()
