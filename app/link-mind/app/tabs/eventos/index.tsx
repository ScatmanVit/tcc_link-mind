import { View, StyleSheet } from "react-native";

const mockEvents = [
  {
    id: "1",
    title: "Consulta médica",
    adress: "Rua A, 123",
    description: "Rotina",
    date: "2025-01-20 14:00",
    notification: null,
    categoryId: "abc",
  },
  {
    id: "2",
    title: "Prova de matemática",
    adress: "ETEC sala 12",
    description: "Capítulo 5",
    date: "2025-01-20 09:30",
    notification: null,
    categoryId: "xyz",
  },
  {
    id: "3",
    title: "Treino de peito",
    adress: "SmartFit",
    description: "Hipertrofia",
    date: "2025-01-21 18:00",
    notification: null,
    categoryId: "xyz",
  },
];

export default function TestScreen() {
  return (
   <View style={styles.container}>

   </View>
  )
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   }
})