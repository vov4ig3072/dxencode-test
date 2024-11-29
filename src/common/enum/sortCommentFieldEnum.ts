import { registerEnumType } from '@nestjs/graphql'

export enum SortCommentFieldEnum {
  createdAt = 'createdAt',
  username = 'username',
  email = 'email',
}

export enum SortOrderEnum {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortOrderEnum, { name: 'SortOrderEnum' })
registerEnumType(SortCommentFieldEnum, { name: 'SortCommentFieldEnum' })
