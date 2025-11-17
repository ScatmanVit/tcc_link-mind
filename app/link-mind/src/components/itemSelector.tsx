import { Pressable, Text, StyleSheet, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { colors } from "../styles/colors";

type ItemSelectorProps = {
    name: string,
    textColor?: string;
    onPress: () => void,
    iconColor?: string
    icon?: keyof typeof FontAwesome6.glyphMap,
}

export default function ItemSelector({
     name, 
     icon, 
     iconColor = colors.gray[50],
     textColor = colors.gray[50], 
     onPress 
    }: ItemSelectorProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                style.container,
                pressed && { backgroundColor: colors.gray[600] }
            ]}>
            <View style={style.items}>
                {icon && (
                    <FontAwesome6
                        name={icon}
                        size={18}
                        color={iconColor}
                        style={{ marginLeft: -1 }}
                    />
                )}
                <Text style={[style.nameItem, { color: textColor }]}>
                    {name}
                </Text>
            </View>
        </Pressable>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
        backgroundColor: colors.gray[800],
    },
    items: {
        flex: 1,
        paddingVertical: 9,
        flexDirection: "row", 
        justifyContent: "flex-start", 
        alignItems: "center",
        gap: 10
    },
    nameItem: {
        fontSize: 17,
        fontWeight: 600
    }
})