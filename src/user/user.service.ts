import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserInput } from './dto/create-user.input'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany()
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async createUser(data: CreateUserInput) {
    return this.prisma.user.create({ data })
  }
}
