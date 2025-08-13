import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Separator() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OU</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",      
    alignSelf: "center",
    marginVertical: 11.5,
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
