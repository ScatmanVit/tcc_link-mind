import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import DatePicker from "react-native-date-picker";
import { FontAwesome6 } from '@expo/vector-icons'; 
import { colors } from "@/styles/colors"; 
import { formatDateCustom } from "@/src/utils/formateDateCustom";

type EventNotifyProps = {
    open: boolean;
    date: Date;
    colorBack?: string, 
    setOpen: (state: boolean) => void;
    notification: {
        titleMessage: string;
        bodyMessage: string;
        scheduleAt: string;
        eventId: string;
    };
    setNotification: React.Dispatch<React.SetStateAction<{
        bodyMessage: string;
        titleMessage: string;
        scheduleAt: string;
        eventId: string;
    }>>;
    formatDateToSchedule: (date: Date) => string; 
};

export default function EventNotify({ 
    open,
    date, 
    setOpen,
    colorBack, 
    notification, 
    setNotification,
    formatDateToSchedule,
}: EventNotifyProps) {

    const handleChangeNotification = (field: 'titleMessage' | 'bodyMessage', value: string) => {
        setNotification(prevNotify => ({ ...prevNotify, [field]: value }));
    };

    return (
        <View>
            <View style={[styles.inputContainer, { marginBottom: 29 }]}>
                <Text style={[styles.label, { fontSize: 16.3 }]}>Titúlo da notificação</Text>
                <TextInput
                    style={[styles.input, colorBack && { backgroundColor: colorBack }]}
                    placeholder="Digite o título"
                    placeholderTextColor={colors.gray[300]}
                    underlineColorAndroid="transparent"
                    value={notification.titleMessage}
                    onChangeText={(titleMessage) => handleChangeNotification('titleMessage', titleMessage)}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={[styles.label, { fontSize: 16.3 }]}>Descrição da notificação</Text>
                <TextInput
                    style={[styles.input, styles.textArea, colorBack && { backgroundColor: colorBack }]}
                    placeholder="Digite uma descrição breve"
                    placeholderTextColor={colors.gray[300]}
                    underlineColorAndroid="transparent"
                    value={notification.bodyMessage}
                    onChangeText={(bodyMessage) => handleChangeNotification('bodyMessage', bodyMessage)}
                    autoCapitalize="none"
                    multiline
                />
            </View>
            <View style={styles.selectDateNotify}>
                <Pressable 
                    onPress={() => setOpen(true)}
                    style={[styles.datePickerButton, colorBack && { backgroundColor: colorBack }]} 
                >
                <FontAwesome6 name="calendar" size={22} color={colors.green[300]} /> 
                    <Text style={styles.datePickerButtonText}>
                        {"Selecione a data e hora"}
                    </Text>
                </Pressable>
                {notification.scheduleAt ?
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ color: colors.gray[400], marginTop: 10, marginBottom: 5 }}>Data selecionada</Text> 
                        <Text style={{ color: colors.gray[200] }}>{formatDateCustom(notification.scheduleAt)}</Text>
                    </View> 
                    : null
                } 
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="datetime"
                    onConfirm={(dateSelected) => {
                        setOpen(false)
                        setNotification(prev => ({
                            ...prev,
                            scheduleAt: formatDateToSchedule(dateSelected)
                        }))
                    }}
                    onCancel={() => setOpen(false)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        color: colors.gray[100],
        fontSize: 16.5,
        marginBottom: 6,
    },
    inputContainer: {
        marginBottom: 18,
    },
    input: {
        outlineWidth: 0,
        backgroundColor: colors.gray[800],
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: colors.gray[50],
        fontSize: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    selectDateNotify: {
            marginBottom: 30
    },
    datePickerButton: { 
        borderWidth: 1,
        borderColor: colors.gray[700],
        borderRadius: 10,              
        backgroundColor: colors.gray[950], 
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: 'center',          
        justifyContent: 'flex-start',
        minWidth: 150, 
        alignSelf: 'flex-start',
        gap: 10 
    },
    datePickerButtonText: { 
        color: colors.gray[100], 
        fontSize: 15,
        fontWeight: '500',
    },
});