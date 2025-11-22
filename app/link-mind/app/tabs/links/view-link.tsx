import { colors } from "@/src/styles/colors"
import { View, StyleSheet } from "react-native"
import { CreateLinkProps } from '@/src/services/links/createLink'
import LinkBox from '@/components/links/linkBox'
import { useEffect } from "react"

type ViewLinkProps = { 
    linkObj: CreateLinkProps
}

export default function ViewLink({ linkObj }: ViewLinkProps) {
    useEffect(() => {
        console.log("VEIO OS COISA", linkObj)
    }, [])
    return (
        <View style={styles.container}>
            <LinkBox url={linkObj.link} isSummarized={linkObj.summary_link}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[800],
        paddingHorizontal: 18,
        paddingTop: 20
    }
})