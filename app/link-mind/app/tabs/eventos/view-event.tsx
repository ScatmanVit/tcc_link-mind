import { colors } from "@/src/styles/colors"
import { View, StyleSheet, ScrollView, Text } from "react-native"
import { useEffect } from "react"
import DescriptionBox from "@/src/components/decriptionBox"
import { type CategoryPropsItem } from "../../../app/_layout";
import EventBox from "@/src/components/events/eventBox"
import { EventWithId } from "@/src/components/events/events"
import { DateDisplay } from "@/src/components/events/dateDisplay";


type ViewLinkProps = {
    eventObj: EventWithId | undefined,
    categories: CategoryPropsItem[]
}


export default function ViewEvent({ eventObj, categories }: ViewLinkProps) {
    useEffect(() => {
        console.log("VEIO OS COISA", eventObj)
    }, [])

    const category = categories.find((category) => category.id === eventObj?.categoriaId)

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={{ 
                paddingHorizontal: 18,
                paddingTop: 20,
                paddingBottom: 40,
                gap: 20
            }}
        >   
            <EventBox 
                text={eventObj?.title!!} 
                categoryEvent={category?.nome}
                scheduleAt={eventObj?.scheduleAt ? true : false}
            />
            

            <View style={ {flexDirection: "column", gap: 16 }}>
                <Text style={{
                    fontSize: 17,
                    marginLeft: 5,
                    marginBottom: "-3%",
                    color: colors.gray[100],
                }}
                >
                    Endereço
                </Text>
                <View style={styles.eventArea}>
                    <Text style={[
                        styles.eventText,
                            !eventObj?.address && { fontFamily: "RobotoItalic", opacity: 0.7 } 
                        ]}
                        
                    >
                        {eventObj?.address ? eventObj.address : "Não foi adcionado um endereço"}
                    </Text>
                </View>

            </View>
            <DescriptionBox description={eventObj?.description}/>
            {eventObj?.date && <DateDisplay text="Data e Hora" date={eventObj?.date} />}
            {eventObj?.scheduleAt && <DateDisplay text="Date e Hora da notificação" date={new Date(eventObj?.scheduleAt)} />}
            

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[800],
    },
     eventText: {
        color: colors.gray[200],
        fontSize: 14,
        width: "90%",
        fontWeight: "500",
        marginLeft: "2%",
        marginRight: "1.5%",
        textAlignVertical: 'top' 
    },
    eventArea: {
        flexDirection: "row",
        justifyContent: "flex-start",
        borderRadius: 18,
        backgroundColor: colors.gray[700],
        minHeight: 48, 
        padding: 12,
        alignItems: 'flex-start' 
    },
})