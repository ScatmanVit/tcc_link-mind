import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createUserService(data) {
   const { name, email, password, role } = data
   const userCreated = await prisma.user.create({
      data: {
         name: name,
         email: email,
         password: password,
         role: role
      }
   })
   return userCreated
}

export default {
   createUserService
}
