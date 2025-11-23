import { View, StyleSheet, Text } from "react-native"
import { colors } from "../styles/colors"

type DescriptionBoxProps = {
    description?: string
}

export default function DescriptionBox({ description }: DescriptionBoxProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title_header}>
                Descrição
            </Text>
            <View style={styles.description_container}>
                <Text style={[
                    styles.description_text,
                        !description && { fontFamily: "RobotoItalic", opacity: 0.7 }
                    ]}>
                    {description ? description : "Não foi adcionada nenhuma descrição."}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title_header: {
        fontSize: 17, 
        marginLeft: 7 ,
        color: colors.gray[100],
        marginBottom: 6,
    },
    description_container: {
        padding: 15,
        width: "100%",
        backgroundColor: colors.gray[700],
        borderRadius: 18
    },
    description_text: {
        color: colors.gray[200],
        fontSize: 14
    }
})