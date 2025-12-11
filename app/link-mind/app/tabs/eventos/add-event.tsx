import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { useToast } from 'react-native-toast-notifications';
import { FontAwesome6 } from '@expo/vector-icons';

import { colors } from "@/styles/colors";
import { AuthContext } from '@/context/auth'
import Button from "@/components/button/button";
import Categories from "@/components/categories//categories";
import { useCategory } from "@/components/categories/useCategory";
import ButtonToggle from '@/src/components/button/buttonToggle'; 

import { type CategoryPropsItem } from "../../_layout";
import categories_List from "@/src/services/categories/listCategories";
import CreateCategoryModal from "@/src/components/modals/createCategoryModal";
import category_Create from "@/src/services/categories/createCategories";

import { type CreateEventProps } from "@/src/services/events/createEvent";
import { type NotificationEvent } from '@/src/services/events/sendEventNotification'
import create_Event from '@/src/services/events/createEvent'
import send_Notification_Event from '@/src/services/events/sendEventNotification'
import { formatDateToSchedule } from "@/src/utils/formatDate";
import EventNotify from "@/src/components/events/eventNotify";
import DatePicker from "react-native-date-picker";
import { formatDateCustom } from "@/src/utils/formateDateCustom";

export default function CreateEvent() {
    const toast = useToast()
    const { user } = useContext(AuthContext)


    const [ event, setEvent ] = useState<Partial<CreateEventProps>>({
        title: '',
        date: undefined,
        address: '',
        scheduleAt: '',
        description: ''
    });
    const [ notification, setNotification ] = useState({
        bodyMessage: '',
        titleMessage: '',
        scheduleAt: '',
        eventId: ''
    })
    const [ openEventDatePicker, setOpenEventDatePicker ] = useState<boolean>(false) 
    const [ openNotifyDatePicker, setOpenNotifyDatePicker ] = useState<boolean>(false)
    const [ date, setDate ] = useState(new Date) 
    const [ dateNotify, setDateNotify ] = useState(new Date())
    const [ loading, setLoading ] = useState<boolean>(false)
    const { selectedCategory, setSelectCategory } = useCategory();
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([])
    const [ modalCreateCategory, setModalCreateCategory ] = useState<boolean>(false)
    const [ toggleButtonSelect, setToggleButtonSelect ] = useState<boolean | undefined>(false)

    useEffect(() => {
        console.log("Categorias do estado", categories)
    }, [categories])

    async function handleCreateEvent() {
        if (!event.title?.trim()) {
            toast.show("O título é obrigatório", {
                type: 'danger',
                placement: "top",
                duration: 2000,
                icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                style: { backgroundColor: colors.amber[500] }
            })
            return
        }
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") 
            return
        }

        if (toggleButtonSelect) {
            if (!notification.bodyMessage || !notification.titleMessage || !notification.scheduleAt) {
                 toast.show("Preencha os dados e horário da notificação para continuar.", {
                    type: 'danger',
                    placement: "top",
                    duration: 3000,
                    icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                    style: { backgroundColor: colors.amber[500] }
                })
                return;
            }
        }

        try {
            setLoading(true)
            const eventCreated = await create_Event(
                user.access_token_prov,
                {
                    title: event?.title,
                    date: event?.date,
                    address: event?.address,
                    description: event?.description,
                    categoriaId: selectedCategory?.id,
                    scheduleAt: notification?.scheduleAt,
                    statusNotification: 'PENDING'
                } as CreateEventProps
            )

            if (eventCreated?.success) {
                const newEventId = eventCreated.eventCreated.id;

                toast.show(eventCreated.message, { 
                    type: 'success',
                    placement: "top",
                    duration: 2000,
                    icon: <FontAwesome6 name="check-circle" size={20} color="#4CAF50" />
                });

                if (toggleButtonSelect) {
                    try {
                        const notificationData = {
                            ...notification,
                            eventId: newEventId 
                        };

                        const notifyResponse = await send_Notification_Event(
                            user?.access_token_prov, 
                            notificationData
                        );

                        if (notifyResponse?.success) {
                             toast.show("Notificação agendada com sucesso!", {
                                type: 'success',
                                placement: "top",
                                duration: 2000,
                                icon: <FontAwesome6 name="check-circle" size={20} color="#4CAF50" />
                            });
                        }
                    } catch (notifyErr: any) {
                        console.log(notifyErr);
                        toast.show(`Erro ao agendar notificação: ${notifyErr.message}`, {
                            type: 'warning',
                            placement: "top",
                            duration: 4000,
                        });
                    }
                }

                setEvent({ title: '', address: '', description: '', date: undefined });
                setSelectCategory(undefined);
                setNotification({ bodyMessage: '', titleMessage: '', scheduleAt: '', eventId: '' });
                setToggleButtonSelect(false);
            }
        } catch (err: any) {
            console.log(err.message)
            toast.show(err.message, {
                type: 'danger',
                placement: "top",
                duration: 3000,
                dangerIcon: err.message.includes("Forneça um título para o seu novo evento.") 
                    ? <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />
                    : <FontAwesome6 name="triangle-exclamation" size={20} color="#F44336" />,
                style: err.message.includes("Forneça um título para o seu novo evento.") 
                    ? { backgroundColor: colors.amber[500] }
                    : { backgroundColor: colors.red[500] }

            });
        } finally {
            setLoading(false)
        }
    }
    
    async function fetch_Categories() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") 
            return
        }
        try {   
            const resList = await categories_List(user.access_token_prov)
            if (resList?.categories) { 
                console.log("Categorias LISTADAS COM SUCESSO", resList.categories)
                setCategories([...resList.categories
                        .filter((categorie: any) => categorie.nome !== "Sem categoria" && "Expirado")
                        .map((categorie: any) => ({
                            id: String(categorie.id),
                            nome: categorie.nome
                        })), 
                { id: "123123123123", nome: "+" }])
            }
        } catch (err: any) { 
            console.log(err.message)
        }
    }
 
    function ChangeModalVisibilityCategory() {
        setModalCreateCategory(prev => !prev)
    }

    async function handle_CreateCategry(name: string) {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") 
            return
        }
        try {
            const res = await category_Create(user.access_token_prov,
                                        [{ id: "123123123", nome: name }])
            if(res?.message) {
                const resList = await categories_List(user.access_token_prov)
                if(resList?.message) {
                    setCategories(() => [...resList.categories, { id: "123123123", nome: "+" }])
                    ChangeModalVisibilityCategory()
                }
            }
        } catch(err: any) {
            console.error(err.message)
        }
    }

    function buttonToggleSelect() {
        setToggleButtonSelect((prev) => !prev)
    }

    useEffect(() => {
        if (user?.access_token_prov) {
            fetch_Categories()
        } 
    }, [user?.access_token_prov])

    return (
        <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <CreateCategoryModal 
                    modalVisible={modalCreateCategory}
                    toggleModal={ChangeModalVisibilityCategory}
                    onCategoryName={handle_CreateCategry}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o título do evento"
                        placeholderTextColor={colors.gray[300]}
                        underlineColorAndroid="transparent"
                        value={event?.title}
                        onChangeText={(title) => setEvent(prevEvent => ({ ...prevEvent, title }))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Endereço</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite um endereço (opcional)"
                        placeholderTextColor={colors.gray[300]}
                        underlineColorAndroid="transparent"
                        value={event?.address}
                        onChangeText={(address) => setEvent(prevEvent => ({ ...prevEvent, address }))}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Adicione uma descrição... (opcional)"
                        placeholderTextColor={colors.gray[300]}
                        underlineColorAndroid="transparent"
                        value={event?.description}
                        onChangeText={(description) => setEvent(prevEvent => ({ ...prevEvent, description }))}
                        multiline
                    />
                </View>
                    <Text style={styles.label}>Data</Text>
                    <View style={styles.selectDateNotify}>
                        <Pressable 
                            onPress={() => setOpenEventDatePicker(true)}
                            style={styles.datePickerButton} 
                        >
                        <FontAwesome6 name="calendar" size={22} color={colors.green[300]} /> 
                            <Text style={styles.datePickerButtonText}>
                                {"Selecione a data"}
                            </Text>
                        </Pressable>
                        {event.date ?
                            <View>
                                <Text style={{ color: colors.gray[400], marginTop: 10, marginBottom: 5 }}>Data selecionada</Text> 
                                <Text style={{ color: colors.gray[200] }}>{formatDateCustom(event.date)}</Text>
                            </View> 
                            : null
                        } 
                        <DatePicker
                            modal
                            open={openEventDatePicker}
                            date={date}
                            mode="datetime"
                            onConfirm={(dateSelected) => {
                                setOpenEventDatePicker(false)
                                setEvent(prev => ({
                                    ...prev,
                                    date: dateSelected.toISOString()
                                }))
                            }}
                            onCancel={() => setOpenEventDatePicker(false)}
                        />
                    </View>
                    <View style={{ marginBottom: 20 }}>
                    <Text style={styles.label}>Categoria</Text>
                    <Categories
                        data={categories}
                        selectedCategory={selectedCategory}
                        setSelectCategory={setSelectCategory}
                        onCreateCategory={ChangeModalVisibilityCategory}
                    />
                </View>

                <View style={styles.buttonNotification}>
                    <View style={styles.buttonNotification_text}>
                        <Text style={styles.label}>
                            Notificação
                        </Text>
                        <Text style={{ color: colors.gray[400], fontSize: 13.5, marginTop: "-3%"}}>
                            Ative para receber a notificação deste evento. É possível personalizar o texto, data e horário de recebimento.
                        </Text>
                    </View>
                    <ButtonToggle isEnabled={toggleButtonSelect!!} onToggle={buttonToggleSelect}/>
                </View>
                
            { toggleButtonSelect ? 
                    <EventNotify 
                        open={openNotifyDatePicker}
                        date={dateNotify} 
                        setOpen={setOpenNotifyDatePicker}
                        notification={notification}
                        setNotification={setNotification}
                        formatDateToSchedule={formatDateToSchedule}
                />
                : null    
            }
                <View style={{ flex: 1, flexDirection: "column", justifyContent:"flex-end", marginTop: "5%" }}>
                    <View style={{ height: 50, marginBottom: "15%" }}>
                        <Button
                            text={loading ? "Carregando..." : "Criar Evento"}
                            colorBack={loading ? colors.gray[400] : undefined}
                            onPress={handleCreateEvent}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[950],
        paddingHorizontal: 9,
        paddingTop: "4%",
        gap: 12
    },
    title: {
        color: colors.gray[50],
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
    },
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
    toastContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0', 
        padding: 18,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonNotification: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingRight: 10,
        marginBottom: 31
    },
    buttonNotification_text: {
        flexDirection: "column",
        maxWidth: "80%",
        gap: 5
    },
    sideBar: {
        width: 6,
        height: '100%',
        borderRadius: 2,
        marginRight: 10,
    },
    toastText: {
        color: '#000',
        flexShrink: 1,
    },
    selectDateNotify: {
            marginBottom: 25
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