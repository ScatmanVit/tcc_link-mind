import { colors } from "@/src/styles/colors"
import { View, StyleSheet, ScrollView } from "react-native"
import { CreateLinkProps } from '@/src/services/links/createLink'
import LinkBox from '@/src/components/links/linkBox'
import { useEffect } from "react"
import DescriptionBox from "@/src/components/decriptionBox"
import { type CategoryPropsItem } from "../../../app/_layout";


type ViewLinkProps = { 
    linkObj: CreateLinkProps,
    categories: CategoryPropsItem[]
}

export default function ViewLink({ linkObj, categories }: ViewLinkProps) {
    useEffect(() => {
        console.log("VEIO OS COISA", linkObj)
    }, [])

    const category = categories.find((category) => category.id === linkObj.categoriaId)
    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={{ 
                paddingHorizontal: 18,
                paddingTop: 20,
                paddingBottom: 40,
                gap: 15
            }}
        >
            <LinkBox 
                url={linkObj.link} 
                isSummarized={linkObj.summary_link} 
                categoryLink={category?.nome}
            />
            <DescriptionBox description={linkObj.description}/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[800],
    }
})