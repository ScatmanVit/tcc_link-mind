import { Stack } from 'expo-router'

export default function EventosStackLayout(){
   /* quando eu tiver as outras telas eu
       defino as outras telas aqui diretamente com o Stack.screen */
  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: "none"
    }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="add-event" />
    </Stack> 
  )
}