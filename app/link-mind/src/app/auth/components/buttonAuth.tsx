import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import type { ComponentProps } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { colors } from "@/src/styles/colors";

type ButtonAuthProps = {
  title: string;
  icon?: ComponentProps<typeof FontAwesome6>["name"];
  onPress: () => void;
};

export default function ButtonAuth({ icon, title, onPress }: ButtonAuthProps) {
  return (
    <TouchableOpacity style={s.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.title}>{title}</Text>
      {icon && <FontAwesome6 name={icon} size={24} color="#000" style={s.icon} />}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray[600],
  },
  title: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700", 
  },
  icon: {
    marginLeft: 8,
  },
});
