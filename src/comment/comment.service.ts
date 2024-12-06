import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentInput } from './dto/create-comment.input'
import {
  SortCommentFieldEnum,
  SortOrderEnum,
} from '../common/enum/sortCommentFieldEnum'
import { GetRepliesArgs } from './dto/get-replies.arg'
import * as sanitizeHtml from 'sanitize-html'
import { FileService } from '../file/file.service'

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async findReplies({ page, limit, parentId }: GetRepliesArgs) {
    const offset = (page - 1) * limit

    const comments = await this.prisma.comment.findMany({
      where: { parentId },
      skip: offset,
      take: limit,
      include: {
        user: true,
        parent: { include: { user: true } },
        file: true,
      },
    })

    const totalCount = await this.prisma.comment.count({ where: { parentId } })

    return {
      comments,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  }

  async createComment(
    data: CreateCommentInput,
    imageFile: Express.Multer.File | undefined,
    textFile: Express.Multer.File | undefined,
  ) {
    const { parentId, text, userId } = data

    if (parentId) {
      await this.prisma.comment.findUniqueOrThrow({
        where: { id: parentId },
      })
    }

    const { path, type } = textFile
      ? await this.fileService.uploadTextFile(textFile)
      : await this.fileService.uploadImage(imageFile)

    const sanitizedText = sanitizeHtml(data.text, {
      allowedTags: ['a', 'code', 'i', 'strong'],
      allowedAttributes: {
        a: ['href', 'title'],
      },
      enforceHtmlBoundary: true,
    })

    return this.prisma.comment.create({
      data: {
        parentId,
        userId,
        text: sanitizedText,
        file: {
          create: {
            path,
            type,
          },
        },
      },
      include: {
        user: true,
        parent: { include: { user: true } },
        replies: true,
        file: true,
      },
    })
  }

  async getTopLevelComments(
    page: number = 1,
    limit: number = 25,
    sortBy: SortCommentFieldEnum = SortCommentFieldEnum.createdAt,
    sortOrder: SortOrderEnum = SortOrderEnum.desc,
  ) {
    const offset = (page - 1) * limit

    const orderBy =
      sortBy === SortCommentFieldEnum.createdAt
        ? { [sortBy]: sortOrder }
        : { user: { [sortBy]: sortOrder } }

    const comments = await this.prisma.comment.findMany({
      where: {
        parentId: null,
      },
      orderBy,
      skip: offset,
      take: limit,
      include: {
        user: true,
        file: true,
      },
    })

    const totalCount = await this.prisma.comment.count({
      where: {
        parentId: null,
      },
    })

    return {
      comments,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  }
}
