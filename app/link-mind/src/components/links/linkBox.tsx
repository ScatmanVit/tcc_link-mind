import { View, Text, StyleSheet, Pressable, Linking, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/colors";
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Category from '@/components/categories/category'

type LinkBoxProps = {
    url: string,
    categoryLink?: string
    isSummarized?: boolean
};

export default function LinkBox({ url, isSummarized, categoryLink }: LinkBoxProps) {
    
    const [ copied, setCopied ] = useState(false);
    const [ category, setCategory ] = useState<string | undefined>('')

    async function handleCopy() {
        await Clipboard.setStringAsync(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    async function handleOpenUrl(link_url: string) {
        let url = link_url.trim();
        if (!link_url.includes('.') || link_url.includes(' ')) {
            Alert.alert('Isso não parece um link válido');
            return;
        }
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Não é possível abrir a URL: ${url}`);
        }
    }

    useEffect(() => {
        setCategory(categoryLink)
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ 
                        fontSize: 17, 
                        marginLeft: 5 ,
                        color: colors.gray[100], 
                    }}
                >
                    Link
                </Text>
                <View style={styles.row}>
                    {category && 
                        <Category 
                            categoryName={category} 
                            height={25.5}
                            focused={true}
                            onPress={() => { }}
                            color={colors.gray[200]}
                            marginTop={-4}
                        />
                    }
                    {isSummarized && (
                        <View style={styles.badge}>
                            <Octicons
                                name="north-star"
                                size={19}
                                color={colors.green[200]}
                            />
                        </View>
                    )}

                    <Pressable onPress={handleCopy} 
                        style={({ pressed}) => [
                            styles.copyButton,
                            pressed && { backgroundColor: colors.gray[600] }
                        ]}>
                        <Feather name={copied ? "check" : "copy"} size={19} color="#fff" />
                    </Pressable>
                </View>
            </View>

            <Pressable onPress={() => {}} style={({ pressed }) => [
                styles.linkArea,
                url.length > 25 && ( pressed && { maxHeight: 120, height: 120 } )
            ]}>
                <Pressable onPress={() => handleOpenUrl(url)}>
                    <FontAwesome
                        style={{ marginTop: 3, marginRight: -4, padding: 2.5 }} 
                        name="external-link" size={18.5} 
                        color={colors.gray[100]} 
                    />
                </Pressable>
                <Text style={styles.linkText} >
                    {url}
                </Text>
            </Pressable>
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
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 6,
    },
    badge: {
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
        paddingHorizontal: 7,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    linkArea: {
        flexDirection: "row",
        justifyContent: "flex-start",
        borderRadius: 18,
        backgroundColor: colors.gray[700],
        maxHeight: 48,
        padding: 12,
    },
    linkText: {
        color: colors.gray[200],
        fontSize: 14,
        width: "90%",
        fontWeight: "500",
        marginLeft: "5%",
        marginRight: "1.5%"
    },
});
