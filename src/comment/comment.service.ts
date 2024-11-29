import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentInput } from './dto/create-comment.input'
import {
  SortCommentFieldEnum,
  SortOrderEnum,
} from '../common/enum/sortCommentFieldEnum'
import { GetRepliesArgs } from './dto/get-replies.arg'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findReplies({ page, limit, parentId }: GetRepliesArgs) {
    const offset = (page - 1) * limit

    const comments = await this.prisma.comment.findMany({
      where: { parentId },
      skip: offset,
      take: limit,
      include: {
        user: true,
        parent: { include: { user: true } },
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

  async createComment(data: CreateCommentInput) {
    const { parentId } = data

    if (parentId) {
      const parent = await this.prisma.comment.findUniqueOrThrow({
        where: { id: parentId },
      })
    }

    return this.prisma.comment.create({
      data,
      include: {
        user: true,
        parent: { include: { user: true } },
        replies: true,
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
