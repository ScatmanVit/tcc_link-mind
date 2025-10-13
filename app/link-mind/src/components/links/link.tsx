import { StyleSheet, Text, Pressable, View, TouchableOpacity } from 'react-native'
import { colors } from '@/styles/colors'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

export type LinkProps =  {
    id: string,
    title: string,
    link_url: string,
    onOpen_url?: () => void,
    onDelete?: () => void,
    onDetails?: () => void
}

export default function Link({ title, link_url, onDelete, onDetails, onOpen_url }: LinkProps) {
    return (
        <View style={style.container}>
            <View>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={style.link_url} numberOfLines={1}>
                    {link_url}
                </Text>
            </View>
            <View style={style.right_content}> 
                <Pressable onPress={onDelete}>
                    <TouchableOpacity activeOpacity={0.6}>
                            <FontAwesome6 name="trash" size={15} color={colors.gray[400]}/>
                    </TouchableOpacity>
                </Pressable>
                <Pressable onPress={onOpen_url}>
                    <TouchableOpacity activeOpacity={0.6}>
                            <FontAwesome style={style.external_link_icon} name="external-link" size={16.5} color={colors.gray[400]} />
                    </TouchableOpacity>
                </Pressable>
                <Pressable onPress={onDetails}>
                    <TouchableOpacity activeOpacity={0.6}>
                            <Feather style={style.more_horizontal} name="more-horizontal" size={22} color={colors.gray[400]} />
                    </TouchableOpacity>
                </Pressable>
            </View>    
        </View>
    ) 
}


const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
    },
    title: {
        color: colors.gray[50],
        fontSize: 16,
        fontWeight: 600
    },
    link_url: {
        color: colors.gray[500],
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