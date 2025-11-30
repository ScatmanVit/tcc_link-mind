import { StyleSheet, Text, Pressable, View } from 'react-native';
import { colors } from '@/styles/colors';
import { FontAwesome6, MaterialIcons, Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type StatusNotificationEvent = "SENT" | "SCHEDULED" | "FAILED" | "PENDING"; 

export type EventProps = {
    id: string;
    date?: Date;
    title: string;
    address?: string;
    description?: string;
    notification?: boolean;
    onDelete?: () => void;
    onOpenDetails?: () => void;
    onToggleNotification?: () => void;
    statusNotification?: StatusNotificationEvent;
    onModalOptionsVisibilityViewEvent?: () => void;
};

export default function Event({
    title,
    date,
    address,
    onDelete,
    onOpenDetails,
    statusNotification,
    onToggleNotification,
    onModalOptionsVisibilityViewEvent,
}: EventProps) {

    const formattedDate = date ? format(new Date(date), "dd 'de' MMM, HH:mm", { locale: ptBR }) : 'Sem data';
    const hasAddress = !!address;
    const isFailed = statusNotification === "FAILED";

    const actionStatusIconInfo = {
        icon: isFailed ? 'notifications-off' : 'notifications-active',
        color: isFailed ? colors.red[500] : colors.gray[500], 
    }

    const statusTextColor = isFailed ? colors.red[500] : colors.gray[500];
    const statusTextBg = isFailed ? colors.red[500] + '15' : colors.gray[700]; 
    
    return (
        <Pressable
            onPress={onModalOptionsVisibilityViewEvent}
            onLongPress={onOpenDetails} 
            delayLongPress={300}
            style={({ pressed }) => [
                style.container,
                pressed && { backgroundColor: colors.gray[800] }
            ]}
        >
            <MaterialIcons 
                name="event" 
                size={22} 
                color={colors.green[300]} 
                style={style.leadingIcon} 
            />

            <View style={style.text_content}>
                
                <View style={style.titleRow}>
                    <Text style={style.title} numberOfLines={1}>
                        {title}
                    </Text>
                    
                    {statusNotification && statusNotification !== "PENDING" && (
                        <View style={[
                            style.statusPill, 
                            { backgroundColor: statusTextBg }
                        ]}>
                            <Text style={[
                                style.statusText, 
                                { color: statusTextColor }
                            ]}>
                                {statusNotification}
                            </Text>
                        </View>
                    )}
                </View>

     
                <View style={style.detailItem}>
                    <FontAwesome6 name="calendar" size={13} color={colors.gray[600]} /> 
                    <Text style={style.detailText} numberOfLines={1}>
                        {date ? formattedDate : 'Data indefinida'}
                    </Text>
                </View>
                
                {hasAddress && (
                    <View style={style.detailItem}>
                        <FontAwesome6 name="location-dot" size={13} color={colors.gray[600]} /> 
                        <Text style={style.detailText} numberOfLines={1}>
                            {address}
                        </Text>
                    </View>
                )}

            </View>

            <View style={style.right_content}>
                {onToggleNotification && (
                    <Pressable
                        onPress={onToggleNotification}
                        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, marginRight: 10 })}
                    >
                        <MaterialIcons
                            name={actionStatusIconInfo.icon as any} 
                            size={24}
                            color={actionStatusIconInfo.color}
                        />
                    </Pressable>
                )}
                {onDelete && (
                    <Pressable
                        onPress={onDelete}
                        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    >
                        <FontAwesome6
                            name="trash"
                            size={16}
                            color={colors.gray[500]}
                        />
                    </Pressable>
                )}
            </View>
        </Pressable>
    );
}


const style = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[950], 
        borderRadius: 8, 
        paddingVertical: 10,
        paddingHorizontal: 9,
        maxWidth: '100%',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leadingIcon: {
        marginRight: 10,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    text_content: {
        flex: 1,
        gap: 4,
        paddingRight: 10,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 2,
    },
    title: {
        color: colors.gray[50],
        fontSize: 16, 
        fontWeight: '700', 
        flexShrink: 1,
    },
    statusPill: {
        marginLeft: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    detailText: {
        color: colors.gray[400],
        fontSize: 13,
        fontWeight: '500', 
        flexShrink: 1,
    },
    footerStatusText: {
        marginTop: 8,
        fontSize: 12,
        color: colors.gray[600],
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    right_content: {
        paddingLeft: 10,
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 12,
    },
});