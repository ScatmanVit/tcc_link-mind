import { Text, Pressable, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'

export type CategoryProps = {
    categoryName: string
    focused: boolean
    onPress: () => void
}

export default function Category({ categoryName, focused, onPress }: CategoryProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: focused
                        ? colors.gray[900]
                        : pressed
                            ? colors.gray[900]
                            : "transparent",
                    borderColor: focused ? colors.gray[300] : colors.gray[700],
                },
            ]}
        >
            <Text style={styles.text}>{categoryName}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        minWidth: 30,
        minHeight: 33,
        borderRadius: 22,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 16,
        color: colors.gray[400],
        fontWeight: '600',
        fontSize: 12.5
    },
})
