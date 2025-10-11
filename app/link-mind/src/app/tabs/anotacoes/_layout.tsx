import { Stack } from 'expo-router'

export default function AnotacoesStackLayout() {
  /* quando eu tiver as outras telas eu
       defino as outras telas aqui diretamente com o Stack.screen */
  return (
    <Stack screenOptions={{
      headerShown: false
    }}/>
  )
}
