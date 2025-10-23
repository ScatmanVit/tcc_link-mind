import { Text, Pressable, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'

export type CategoryProps = {
    categoryName?: string
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
                            ? colors.gray[800]
                            : colors.gray[950],
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
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 14,
        color: colors.gray[400],
        fontWeight: '600',
        fontSize: 13,
        textTransform: 'capitalize',
    },
})
