import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { Octicons } from "@expo/vector-icons";

type ActionSelectorProps = {
    nameAction: string;
    colorBack?: string; // cor do ícone opcional
    icon: keyof typeof Octicons.glyphMap;
    onPress?: () => void;
};

export default function ActionSelector({
    nameAction,
    icon,
    colorBack,
    onPress,
}: ActionSelectorProps) {
    return ( 
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && { opacity: 0.7 },
            ]}
            onPress={onPress}
        >
            <View style={[styles.square, colorBack && { backgroundColor: colors.red[100] }]}>
                <Octicons
                    name={icon}
                    size={35}
                    color={colorBack || colors.gray[50]}
                />
            </View>
            <Text style={styles.text}>{nameAction}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    square: {
        width: 80,
        height: 80,
        backgroundColor: colors.gray[700],
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        marginTop: 10,
        color: colors.gray[50],
        fontSize: 14,
        textAlign: "center",
    },
});
