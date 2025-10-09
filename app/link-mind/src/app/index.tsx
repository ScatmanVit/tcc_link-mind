import Register from '@/src/app/auth/register'
import LinksIndex from './tabs/links'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/auth'
import { useRouter } from 'expo-router'
import TabLayout from './tabs/_layout'

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

   useEffect(() => {
      const timer = setTimeout(() => {
         router.replace('/tabs/links')
      }, 300)

      return () => clearTimeout(timer)
   }, [])

   return null 
}
