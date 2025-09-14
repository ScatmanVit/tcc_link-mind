import Register from '@/src/app/auth/register'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth'
import { useRouter } from 'expo-router'

export default function Index() {
   const router = useRouter()
   const { user } = useContext(AuthContext)
   const [mounted, setMounted] = useState<boolean>(false)

   // useEffect(() => {
   //    setMounted(true)
   // }, [])

   // useEffect(() => {
   //    if (mounted && user && user.email && user.name) {
   //       router.replace('/tabs/links') 
   //    }
   // }, [mounted, user])

   return <Register />
}
