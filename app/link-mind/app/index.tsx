import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from './auth/register';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../src/context/auth';
import { useRouter } from 'expo-router';



export default function Index() {
   const router = useRouter();
   const { user } = useContext(AuthContext);
   
   // useEffect(() => {
   //    setMounted(true)
   // }, [])
   
   // useEffect(() => {
   //    if (mounted && user && user.email && user.name) {
   //       router.replace('/tabs/links') 
   //    }
   // }, [mounted, user])
   
   // useEffect(() => {
   //    const timer = setTimeout(() => {
   //       router.replace('/tabs/links')
   //    }, 300)
   
   //    return () => clearTimeout(timer)
   // }, [])


  return <Register />;
}
