import { View, Text, StyleSheet } from "react-native";

export default function Separator() {
  return (
    <View style={s.container}>
      <View style={s.line} />
      <Text style={s.text}>OU</Text>
      <View style={s.line} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",      
    alignSelf: "center",
    marginVertical: 6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#888",
  },
  text: {
    marginHorizontal: 10,
    fontWeight: "bold",
    color: "#888",
  },
});
