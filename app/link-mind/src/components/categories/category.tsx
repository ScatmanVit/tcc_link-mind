import { Text, Pressable, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'

export type CategoryProps = {
    categoryName: string,
    focused: boolean,
    onPress: () => void,
    color?: string
    height?: number,
    marginTop?: number

}

export default function Category({ 
    categoryName, 
    focused, 
    onPress, 
    color, 
    height,
    marginTop 
}: CategoryProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                height != null ? { height } : undefined,
                height != null ? { borderWidth: 0.2 } : undefined,
                {
                    backgroundColor: focused
                        ? "transparent"
                        : pressed
                            ? colors.gray[900]
                            : "transparent",
                    borderColor: focused ? colors.gray[300] : colors.gray[700],
                },
            ]}
        >
            <Text style={[
                    styles.text, 
                    color && { color: color },
                    marginTop != null ? { marginTop } : undefined                
            ]}
            > {categoryName}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        minWidth: 30,
        height: 33,
        borderRadius: 22,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        paddingVertical: 6,
        marginTop: -1,
        marginLeft: -1,
        paddingHorizontal: 16,
        color: colors.gray[400],
        fontWeight: '600',
        fontSize: 12.5,
    },
})
