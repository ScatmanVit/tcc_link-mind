import { StyleSheet, Text, Pressable, View } from 'react-native'
import { colors } from '@/styles/colors'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export type LinkProps =  {
    id: string,
    title: string,
    link_url: string,
    onOpen_url?: () => void,
    onDelete?: () => void,
    onModalvisibleDetails?: () => void
}

export default function Link({ title, link_url, onDelete, onOpen_url, onModalvisibleDetails }: LinkProps) {
    return (
            <Pressable 
                onPress={onModalvisibleDetails}
                style={({ pressed }) => [
                    style.container,
                    pressed && { backgroundColor: colors.gray[800]}
                ]}
            >

            <View>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={style.link_url} numberOfLines={1}>
                    {link_url}
                </Text>
            </View>
            <View style={style.right_content}> 
                <Pressable
                    onPress={onDelete}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                    <FontAwesome6 
                        name="trash" 
                        size={15} 
                        color={colors.gray[400]} 
                    />
                </Pressable>

                <Pressable
                    onPress={onOpen_url}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                    <FontAwesome 
                        style={style.external_link_icon} 
                        name="external-link" size={16.5} 
                        color={colors.gray[400]} 
                    />
                </Pressable>

                {/* <Pressable
                    onPress={onDetails}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                    <Feather 
                        style={style.more_horizontal} 
                        name="more-horizontal" 
                        size={22} 
                        color={colors.gray[400]} 
                    />
                </Pressable> */}
            </View>    
        </Pressable>
    ) 
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
    },
    title: {
        color: colors.gray[50],
        fontSize: 17,
        fontWeight: 600,
        width: 290,
        marginBottom: 1
    },
    link_url: {
        color: colors.gray[500],
        fontSize: 16,
        width: 250
    },
    right_content: {
        paddingLeft: 10,
        marginTop: -7,
        flexDirection: "row",
        alignItems: "center",
        gap: 14
    },
    external_link_icon: {
        marginTop: 2
    },
    more_horizontal: {
        marginLeft: -3
    }
})