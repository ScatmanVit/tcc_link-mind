import { colors } from "@/src/styles/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, View, Text } from "react-native";
import { formatDateCustom } from "@/src/utils/formateDateCustom";

export function DateDisplay({ date, text }: { date: Date, text: string }) {
    const formattedDate = formatDateCustom(date.toISOString());
    const [datePart, timePart] = formattedDate.split(' às ');

    return (
        <View style={dateStyles.dateContainer}>
            <Text style={dateStyles.sectionTitle}>{text}</Text>
            <View style={dateStyles.dateBox}>
                <FontAwesome6 name="calendar-days" size={20} color={colors.green[300]} style={dateStyles.icon} />
                <Text style={dateStyles.dateText}>{datePart}</Text>

                <View style={dateStyles.separator} />
                
                <FontAwesome6 name="clock" size={20} color={colors.green[300]} style={dateStyles.icon} />
                <Text style={dateStyles.dateText}>{timePart}</Text>
            </View>
        </View>
    );
}

const dateStyles = StyleSheet.create({
    dateContainer: {
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 17,
        marginLeft: 5,
        marginBottom: 8,
        color: colors.gray[100],
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    icon: {
        marginRight: 10,
    },
    dateText: {
        color: colors.gray[100],
        fontSize: 15,
        fontWeight: '500',
    },
    separator: {
        width: 1,
        height: '80%',
        backgroundColor: colors.gray[600],
        marginHorizontal: 15,
    }
});