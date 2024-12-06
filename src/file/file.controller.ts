import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common'
import { FileService } from './file.service'
import { existsSync } from 'fs'
import { Response } from 'express'

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('/:id')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const { path } = await this.fileService.getFile(id)
    if (!existsSync(path)) {
      throw new NotFoundException('File not found')
    }

    res.download(path, (err) => {
      if (err)
        throw new HttpException('File upload filed', HttpStatus.BAD_REQUEST)
    })
  }
}
