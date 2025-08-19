import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

export function formatEmail(email) {
   let emailFormated
   return emailFormated = email
      .replace(/\s+/g, '')
      .toLowerCase()
}

export async function findOneUser(email, idUser) {
   let user
   return (
      user = email !== "" ? await prisma.user.findUnique({
         where: {
            email: email
         }
      }) : ( idUser !== "" 
         && await prisma.user.findUnique({
            where: {
               id: idUser
            }
         }) 
      ) 
   ) 
}

export function captalize(word) {
   return word
      .charAt(0)
      .toUpperCase() + word
      .slice(1)
      .toLowerCase();
}
