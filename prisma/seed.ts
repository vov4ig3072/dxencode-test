import { PrismaClient, User } from '@prisma/client'
import { hash, genSalt } from 'bcrypt'

const prisma = new PrismaClient()

const users = [
  {
    username: 'Test',
    email: 'test@gmail.com',
    password: 'Qwerty1',
  },
  {
    username: 'Reply',
    email: 'reply@gmail.com',
    password: 'Qwerty1',
  },
]

const comment =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

async function main() {
  const createdUsers = await Promise.all(
    users.map(
      async (create) =>
        await prisma.user.upsert({
          where: { email: create.email },
          update: {},
          create: {
            password: await hash(create.password, await genSalt(10)),
            ...create,
          },
        }),
    ),
  )

  for (let i = 0; i < 45; i++) {
    await Promise.all(
      createdUsers.map(async (user, index, arr) => {
        const { id: commentId } = await prisma.comment.create({
          data: { userId: user.id, text: `Top level comment ${comment}` },
        })

        await prisma.comment.create({
          data: {
            userId: arr[index + 1] ? arr[index + 1].id : arr[index - 1].id,
            text: `Reply comment ${comment}`,
            parentId: commentId,
          },
        })
      }),
    )
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
