import { View, Text, StyleSheet, Pressable, Linking, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/colors";
import Category from '@/components/categories/category'
import { formatDateCustom } from "@/src/utils/formateDateCustom"


type LinkBoxProps = {
    text: string,
    categoryEvent?: string,
    scheduleAt?: boolean
};

export default function EventBox({ text, categoryEvent, scheduleAt }: LinkBoxProps) {

    const [category, setCategory] = useState<string | undefined>('')

    useEffect(() => {
        setCategory(categoryEvent)
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{
                    fontSize: 17,
                    marginLeft: 5,
                    color: colors.gray[100],
                    marginBottom: "1%"
                }}
                >
                    Evento
                </Text>
                <View style={styles.row}>
                    {category &&
                        <Category
                            categoryName={category}
                            height={25.5}
                            focused={true}
                            onPress={() => { }}
                            color={colors.gray[200]}
                            marginTop={-4}
                        />
                    }

                    {scheduleAt && (
                        <View style={styles.badge}>
                            <Octicons
                                name="bell"
                                size={19}
                                color={colors.green[200]}
                            />
                        </View>
                    )}
                </View>
            </View>

            <Pressable onPress={() => { }} style={styles.eventArea}>
                <Text style={styles.eventText} >
                    {text}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: "1%",
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 6,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    eventArea: {
        flexDirection: "row",
        justifyContent: "flex-start",
        borderRadius: 18,
        backgroundColor: colors.gray[700],
        maxHeight: 48,
        padding: 12,
    },
    eventText: {
        color: colors.gray[200],
        fontSize: 14,
        width: "90%",
        fontWeight: "500",
        marginLeft: "2%",
        marginRight: "1.5%"
    },
});
