import { StyleSheet, Text, Pressable, View } from 'react-native'
import { colors } from '@/styles/colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'

export type LinkProps = {
    id: string,
    title: string,
    link_url: string,
    onOpen_url?: () => void,
    onDelete?: () => void,
    onModalvisibleDetails?: () => void,
    onModalOptionsVisibilityViewLink?: () => void
}

export default function Link({ 
    title, 
    link_url, 
    onDelete, 
    onOpen_url, 
    onModalvisibleDetails,
    onModalOptionsVisibilityViewLink 
}: LinkProps) {

    return (
            <Pressable
                onPress={onModalOptionsVisibilityViewLink}
                onLongPress={onModalvisibleDetails}
                delayLongPress={300}
                style={({ pressed }) => [
                    style.container,
                    pressed && { backgroundColor: colors.gray[800]}
                ]}
            >
            
            <MaterialIcons 
                name="link" 
                size={23} 
                color={colors.green[300]} 
                style={style.leadingIcon} 
            />

            <View style={style.text_content}>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={style.link_url} numberOfLines={1}>
                    {link_url}
                </Text>
            </View>

            <View style={style.right_content}> 
                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        onDelete?.();
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                    <FontAwesome6 
                        name="trash" 
                        size={15.5} 
                        color={colors.gray[500]} 
                    />
                </Pressable>

                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        onOpen_url?.();
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                    <FontAwesome 
                        name="external-link" size={15.5} 
                        color={colors.gray[500]} 
                    />
                </Pressable>
            </View>    
        </Pressable>
    ) 
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
    },
    leadingIcon: {
        marginRight: 10,
        alignSelf: 'center',
    },
    text_content: { 
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: colors.gray[50],
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 1
    },
    link_url: {
        color: colors.gray[400],
        fontSize: 14,
    },
    right_content: {
        paddingLeft: 10,
        marginTop: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 14
    },
    more_horizontal: {
        marginLeft: -3
    }
})