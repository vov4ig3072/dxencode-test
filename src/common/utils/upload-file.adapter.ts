import { FileUpload } from 'graphql-upload-ts'
import { Readable } from 'stream'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IFileConfig } from '../interfaces/config.interface'
import * as path from 'path'

@Injectable()
export class UploadFileAdapter {
  constructor(private configService: ConfigService) {}

  adaptFileUpload(file: FileUpload, buffer: Buffer): Express.Multer.File {
    if (!file) {
      return undefined
    }

    const filePath = this.configService.get<IFileConfig>('file').uploadDir
    const tempFilePath = path.join(__dirname, '..', filePath, file.filename)

    return {
      fieldname: file.fieldName,
      originalname: file.filename,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: buffer.length,
      buffer,
      stream: Readable.from(buffer),
      filename: file.filename,
      path: tempFilePath,
      destination: path.dirname(tempFilePath),
    }
  }
}
