import { useState, useContext, useEffect } from 'react' 
import { View, StyleSheet } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { AuthContext } from '@/context/auth'


import { colors } from '@/styles/colors'
import Button from "@/components/button/button";
import EventNotify from '@/src/components/events/eventNotify'
import { formatDateToSchedule } from '@/utils/formatDate'
import { StatusNotificationEvent } from '@/src/components/events/event';
import send_Notification_Event from '@/src/services/events/sendEventNotification'
import { FontAwesome6 } from '@expo/vector-icons';

type NotifyEventProps = {
    data: {
        eventId: string,
        scheduleAt: string,
        statusNotification: StatusNotificationEvent
    }
    toggleModal: () => void
    onScheduled: (id: string) => void
}

export default function NotifyEvent({ data, toggleModal, onScheduled }: NotifyEventProps) {
    const toast = useToast()
    const { user } = useContext(AuthContext)

    const [ open, setOpen ] = useState<boolean>(false)
    const [ date, setDate ] = useState(new Date()) 
    const [ loading, setLoading ] = useState<boolean>(false)

    const [ notification, setNotification ] = useState({
        bodyMessage: '',
        titleMessage: '',
        scheduleAt: '',
        eventId: ''
    })    

    useEffect(() => {
        setNotification((prev) => 
            ({...prev, eventId: data.eventId })
        )
    }, [])


    async function handleNotifyEvent() {
        if (!user || !user?.access_token_prov) {
            console.log("Usuário não autenticado")
            return
        }
        if (!notification.eventId) {
            return
        }
        if (!notification.titleMessage
            || !notification.bodyMessage
            || !notification.scheduleAt
        ) {  
            toast.show("Preencha os dados da notificação por favor.", {
                type: 'danger',
                placement: "top",
                duration: 2000,
                icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                style: { backgroundColor: colors.amber[500] }
            })
        }
         try {
            setLoading(true)
            const eventNotifyScheduled = await send_Notification_Event(user?.access_token_prov, notification)
            if (eventNotifyScheduled?.success){
                toggleModal()
                onScheduled(notification.eventId)
                toast.show(eventNotifyScheduled.message, {
                    type: 'success',
                    placement: "top",
                    duration: 2000,
                    icon: <FontAwesome6 name="check-circle" size={20} color="#4CAF50" />
                });
            }
        } catch (err: any) {
            console.log(err.message)
            toast.show(err.message, {
                type: 'danger',
                placement: "top",
                duration: 3000,
                dangerIcon: err.message.includes("Informações necessárias para agendamento do evento não fornecidas.") 
                || err.message.includes("Data de disparo da notificação não fornecida.")
                    ? <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />
                    : <FontAwesome6 name="triangle-exclamation" size={20} color="#F44336" />,
                style: err.message.includes("Informações necessárias para agendamento do evento não fornecidas.") 
                || err.message.includes("Data de disparo da notificação não fornecida.") 
                    ? { backgroundColor: colors.amber[500] }
                    : { backgroundColor: colors.red[500] }

            });
        } finally {
            setLoading(false)
        }
    }
    return (

        <View style={styles.container}>
            <EventNotify 
                open={open}
                date={date} 
                setOpen={setOpen}
                colorBack={colors.gray[700]}
                notification={notification}
                setNotification={setNotification}
                formatDateToSchedule={formatDateToSchedule}
            />
            <View style={{ flex: 1, flexDirection: "column", justifyContent:"flex-end", marginTop: "5%" }}>
                <View style={{ height: 50, marginBottom: "15%" }}>
                    <Button
                        text={loading ? "Carregando..." : "Agendar Notificação"}
                        colorBack={loading ? colors.gray[400] : undefined}
                        onPress={handleNotifyEvent}
                    />
                </View>
            </View>   
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