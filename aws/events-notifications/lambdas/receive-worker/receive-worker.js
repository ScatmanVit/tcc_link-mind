import dotenv from 'dotenv'
dotenv.config()

export const handler = async (event) => {
  console.log("Lambda recebeu...")
  console.log(event)
  return
};