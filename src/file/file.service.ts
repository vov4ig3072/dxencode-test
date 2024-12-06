import { IFileConfig } from '../common/interfaces/config.interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'node:path'
import * as sharp from 'sharp'
import * as fs from 'node:fs'
import { FileTypeEntity } from './entities/file.entity'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FileService {
  private readonly fileConfig: IFileConfig
  private readonly uploadDir: string

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.fileConfig = configService.get<IFileConfig>('file')
    this.uploadDir = path.join(__dirname, this.fileConfig.uploadDir)
    fs.mkdirSync(this.uploadDir, { recursive: true })
  }

  getFile(id: number) {
    return this.prisma.file.findUniqueOrThrow({ where: { id } })
  }

  async uploadImage(file: Express.Multer.File): Promise<FileTypeEntity> {
    const { allowedFormats, maxHeightImage, maxWidthImage } = this.fileConfig

    if (!allowedFormats.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image format')
    }

    const outputFileName = `resized-${Date.now()}-${file.originalname}`
    const outputFilePath = path.join(this.uploadDir, outputFileName)

    await sharp(file.buffer)
      .resize({ width: maxWidthImage, height: maxHeightImage, fit: 'inside' })
      .toFile(outputFilePath)

    return { path: outputFilePath, type: file.mimetype }
  }

  async uploadTextFile(file: Express.Multer.File): Promise<FileTypeEntity> {
    if (file.mimetype !== 'text/plain') {
      throw new BadRequestException('The file format must be TXT')
    }

    if (file.size > 100 * 1024) {
      throw new BadRequestException('The text file must not exceed 100 KB')
    }

    const outputFileName = `uploaded-${Date.now()}-${file.originalname}`
    const outputFilePath = path.join(this.uploadDir, outputFileName)

    fs.writeFileSync(outputFilePath, file.buffer)

    return { path: outputFilePath, type: file.mimetype }
  }
}
