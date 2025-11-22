import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

type LinkBoxProps = {
    url: string;
    isSummarized?: boolean;
};

export default function LinkBox({ url, isSummarized }: LinkBoxProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await Clipboard.setStringAsync(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                
                {isSummarized && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>⭐ Resumido</Text>
                    </View>
                )}

                <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                    <Feather name={copied ? "check" : "copy"} size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Link */}
            <TouchableOpacity onPress={() => {}} style={styles.linkArea}>
                <Text style={styles.linkText} numberOfLines={1}>
                    {url}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    badge: {
        backgroundColor: "#4C8EF7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    copyButton: {
        backgroundColor: "#4C8EF7",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    linkArea: {
        backgroundColor: "#EBF2FF",
        padding: 12,
        borderRadius: 10,
    },
    linkText: {
        color: "#1B4FAA",
        fontSize: 14,
        fontWeight: "500",
    },
});
