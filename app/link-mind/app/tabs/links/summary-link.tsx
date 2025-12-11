

import LinkBox from "@/src/components/links/linkBox"
import { colors } from "@/src/styles/colors"
import { useState, useEffect, useRef, useContext } from "react"
import { View, StyleSheet, ActivityIndicator, Animated, Text, ScrollView } from "react-native"
import { AuthContext } from "@/src/context/auth"
import link_Summary from "@/src/services/links/summaryLink"

type SummaryLinksProps = {
    linkUrl: string,
    linkType?: string,
    linkId?: string
}

export default function SummaryLink({ 
    linkUrl, 
    linkId, 
    linkType,
}: SummaryLinksProps) {

    const { user } = useContext(AuthContext)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ summaryText, setSummaryText ] = useState<string>('')

    async function summary_Link() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") 
            return
        }
        console.log('NOME USUÁRIO', user.name)
        try {
            const res = await link_Summary({
                access_token: user.access_token_prov,
                data: {
                    linkUrl: linkUrl, 
                    linkId: linkId!!, 
                    linkType: linkType!!,
                    instructionsFromUser: `Meu nome é ${user.name}. Se refira a mim usando esse nome, mas não seja formal, e nem intimo demais, comunique bem as ideias, e resuma com concisão e gradatividade, seja eloquente, e humano na resposta.`
                }
            })
            if (res?.success) {
                console.log(res.summary)
                setSummaryText(res.summary)
                setLoading(false)
            }
        } catch (err: any) {
            console.log(err.message)
            setLoading(false)
        } 
    }

    useEffect(() => {
        summary_Link()
    }, [])

    const colorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnim, {
                    toValue: 1,
                    duration: 500, 
                    useNativeDriver: false
                }),
                Animated.timing(colorAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                })
            ])
        ).start();
    }, [colorAnim]);

    const textColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.gray[200], colors.gray[500]] // Mudei para oscilar entre cinza e verde
    });

    return (
        <View style={styles.container}>
            { loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={45} color={colors.green[300]} />
                    <Animated.Text style={[styles.loadingText, { color: textColor }]}>
                        Resumindo Link...
                    </Animated.Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.resultContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    
                    <Text style={styles.summaryBody}>
                        {summaryText}
                    </Text>
                </ScrollView>
            )}            
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[800],
        paddingHorizontal: 20, // Aumentei levemente o padding lateral
        paddingTop: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
    },
    loadingText: {
        fontSize: 16,
        fontWeight: "500"
    },
    resultContainer: {
        flex: 1,
        width: "100%",
    },
    headerResult: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[600], // Uma linha sutil para separar o cabeçalho
        paddingBottom: 12
    },
    titleResult: {
        color: colors.gray[100],
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 0.5
    },
    summaryBody: {
        color: colors.gray[200], // Uma cor confortável para leitura longa
        fontSize: 16,
        lineHeight: 26, // Importante para legibilidade de textos longos
        textAlign: "left",
    }
})