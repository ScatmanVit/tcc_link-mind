import { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/colors';
import { useCategory } from '@/src/components/categories/useCategory';
import { AuthContext } from '@/context/auth';

import type { CategoryPropsItem } from '../../../app/_layout';
import {
    getCategoriesToSync,
    invalidateCategoriesStorage
} from '@/src/async-storage/categories';

import EventSkeleton from '@/src/components/events/eventSkeleton';
import Events, { EventWithId } from '@/src/components/events/events';

import list_Events from '@/src/services/events/listEvents'; 
import delete_Event from '@/src/services/events/deleteEvent'; 
import category_Create from '@/src/services/categories/createCategories';
import categories_List from '@/src/services/categories/listCategories';

import ChooseOptionModal from '@/src/components/modals/modalBottomSheet';
import ActionSelector from '@/src/components/actionSelector';
import CreateCategoryModal from '@/src/components/modals/createCategoryModal';
import NotifyEvent from './notify-event';
import EditEvent from './edit-event';
import ViewEvent from './view-event';


export default function EventsIndex() {
    const { user } = useContext(AuthContext);
    const { selectedCategory, setSelectCategory } = useCategory();

    const [ events, setEvents ] = useState<EventWithId[]>([]);
    const [ event, setEvent ] = useState<EventWithId | undefined>(undefined); 
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ bottomModalVisible, setBottomModalVisible ] = useState<boolean>(false);
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([]);
    const [ eventsFiltered, setEventsFiltered ] = useState<EventWithId[] | null>(null);
    const [ pageNameModal, setPageNameModal ] = useState<string | undefined>(undefined);
    const [ modalCreateCategory, setModalCreateCategory ] = useState<boolean>(false);

    async function fetch_Events() {
        if (user && user.access_token_prov) {
            try {
                setIsLoading(true);
                const eventsRes = await list_Events(user.access_token_prov);
                if (Array.isArray(eventsRes?.events)) {
                    console.log(eventsRes.message);
                    setTimeout(() => {
                        setEvents(eventsRes.events.map((e: any) => ({
                            ...e,
                            date: e.date ? new Date(e.date) : undefined
                        })));
                        setIsLoading(false);
                    }, 500);
                } else {
                    setEvents([]);
                    setIsLoading(false);
                }
            } catch (err: any) {
                console.log("Erro ao buscar eventos:", err.message);
                setIsLoading(false);
            }
        } else {
            console.log("Usuário não autenticado para buscar eventos");
        }
    }

    async function handleOnDelete_Event(id: string) {
        if (user && user.access_token_prov) {
            try {
                const deleteEventRes = await delete_Event({
                    access_token: user.access_token_prov,
                    eventId: id
                })
                if (deleteEventRes?.message) {
                    console.log(deleteEventRes.message)
                    setEvents(prev => prev.filter(e => e.id !== id))
                }
            } catch (err: any) { 
                console.log("Erro ao deletar evento:", err.message)
            }
        } else {
            console.log("Usuário não autenticado para deletar evento")
        }
    }

    function onUpdatedEvent(updatedEvent: EventWithId) {
        setEvents(prev =>
            prev.map((e: EventWithId) =>
                e.id === updatedEvent.id ? { ...e, ...updatedEvent, date: updatedEvent.date ? new Date(updatedEvent.date) : undefined } : e
            )
        );
    }
    function onScheduledEvent(eventId: string) {
        setEvents(prev => 
            prev.map(event =>
                event.id === eventId
                    ? { ...event, statusNotification: "SCHEDULED" }
                    : event
            )
        );
    }

    async function syncCategories_and_fetchCategories() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado");
            return;
        }

        const netState = await NetInfo.fetch();
        const isConnected = netState.isConnected;

        if (!isConnected) {
            console.log("Sem internet, carregando categorias locais");
            const localCategories = await getCategoriesToSync();
            setCategories([...localCategories, { id: "ADD_CATEGORY", nome: "+" }]);
            return;
        }
        try {
            const localCategories = await getCategoriesToSync();

            if (localCategories.length > 0) {
                const res = await category_Create(user.access_token_prov, localCategories);

                if (res?.message) {
                    const resList = await categories_List(user.access_token_prov);
                    if (resList?.categories) {
                        setCategories([...resList.categories, { id: "ADD_CATEGORY", nome: "+" }]);
                    } else {
                        setCategories(localCategories);
                    }
                    await invalidateCategoriesStorage();
                } else {
                    setCategories(localCategories);
                    console.log("Falha ao sincronizar, usando categorias locais");
                }
            } else {
                const res = await categories_List(user.access_token_prov);
                if (res?.categories) {
                    console.log(res.message);
                    setCategories([...res.categories, { id: "ADD_CATEGORY", nome: "+" }]);
                }
            }
        } catch (err: any) {
            console.log("Erro ao sincronizar/buscar categorias:", err);
        }
    }

    async function handle_CreateCategory(name: string) {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado");
            return;
        }
        try {
            const res = await category_Create(user.access_token_prov,
                                     [{ id: "TEMP_ID", nome: name }]); 
            if(res?.message) {
                const resList = await categories_List(user.access_token_prov);
                if(resList?.message) {
                    setCategories(() => [...resList.categories, { id: "ADD_CATEGORY", nome: "+" }]);
                    ChangeModalVisibilityCategory();
                }
            }
        } catch(err: any) {
            console.error("Erro ao criar categoria:", err.message);
        }
    }

    function ChangeModalVisibilityClose() {
        setBottomModalVisible(prev => !prev);
        setTimeout(() => { setPageNameModal(undefined); }, 500);
    }

    function ChangeModalVisibility() {
            setBottomModalVisible(prev => !prev);
    }

    function ChangeModalVisibilityViewEvent(title: string) {
        setPageNameModal(`${title}`); 
        ChangeModalVisibility();
    }

    function ChangePageNameModal(page: string | undefined) {
         ChangeModalVisibility();
         setTimeout(() => {
            setPageNameModal(page);
            ChangeModalVisibility();
       }, 300);
    }

    function ChangeModalVisibilityCategory() {
        setTimeout(() => {
            setModalCreateCategory(prev => !prev);
        }, 100);
    }

    useEffect(() => {
        if (user?.access_token_prov) {
            fetch_Events();
            syncCategories_and_fetchCategories();
        }
    }, [user?.access_token_prov]);

    useEffect(() => {
        if (!modalCreateCategory) {
            syncCategories_and_fetchCategories();
        }
    }, [modalCreateCategory]);

    useEffect(() => {
        if (!selectedCategory) {
            setEventsFiltered(null);
        } else if (selectedCategory.nome === "Sem categoria") {
            const eventsFilter = events.filter(e => !e.categoriaId || e.categoriaId === "");
            setEventsFiltered(eventsFilter);
        } else if (selectedCategory.nome !== "Todas") {
            const eventsFilter = events.filter(e => e.categoriaId === selectedCategory.id);
            setEventsFiltered(eventsFilter);
        } else {
            setEventsFiltered(null);
        }
    }, [selectedCategory, events]);
    

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: -25.8, paddingBottom: -15 }}>
            <View style={styles.container}>
                <CreateCategoryModal
                    modalVisible={modalCreateCategory}
                    toggleModal={ChangeModalVisibilityCategory}
                    onCategoryName={handle_CreateCategory}
                />

                {isLoading ? ( 
                    <>
                        <EventSkeleton /> 
                        <EventSkeleton />
                        <EventSkeleton />
                        <EventSkeleton />
                        <EventSkeleton />
                    </>
                ) : (  
                    <Events
                        data={eventsFiltered ? eventsFiltered : events}
                        setEvent={setEvent}
                        categories={categories}
                        onDelete={handleOnDelete_Event}
                        onCreateCategory={ChangeModalVisibilityCategory}
                        selectedCategory={selectedCategory}
                        setSelectCategory={setSelectCategory}
                        modalOptionsVisibility={ChangeModalVisibility}
                        modalOptionsVisibilityViewEvent={ChangeModalVisibilityViewEvent}
                        onFetchData={async () => {
                            fetch_Events();
                            syncCategories_and_fetchCategories();
                        }}
                    />
                )}

                <ChooseOptionModal
                    modalVisible={bottomModalVisible}
                    toggleModal={ChangeModalVisibility}
                    pageNameModal={pageNameModal}
                    ChangePageNameModal={ChangePageNameModal}
                    toggleModalClose={ChangeModalVisibilityClose}
                    pageOrigin="events"
                >
                    {pageNameModal ? (
                        pageNameModal === "Editar Evento" ? (

                            <EditEvent  
                                data={{
                                    title: event?.title!!,
                                    address: event?.address,
                                    description: event?.description,
                                    date: event?.date,
                                    categoriaId: event?.categoriaId
                                }}
                                eventIdProps={event?.id!!}
                                categoriesProps={categories}
                                onUpdate={onUpdatedEvent}
                                onChangeModalVisibilityClose={ChangeModalVisibilityClose}
                            />
                        ) : pageNameModal === "Notificar Evento" ? ( 
                            <NotifyEvent
                                toggleModal={ChangeModalVisibilityClose}
                                onScheduled={onScheduledEvent}  
                                data={{
                                    eventId: event?.id!!,
                                    scheduleAt: event?.scheduleAt!!,
                                    statusNotification: event?.statusNotification!!
                                }}
                            /> 
                        )
                        : (
                             <ViewEvent eventObj={event} categories={categories} />

                        )
                    ) : (
                        <View style={styles.content_modal}>
                            <ActionSelector nameAction='Editar' icon={"pencil"} onPress={() => {
                                ChangePageNameModal("Editar Evento")
                            }}/>
                            <ActionSelector nameAction='Notificar' icon={"bell"} onPress={() => {
                                ChangePageNameModal("Notificar Evento")
                            }}/>
                            <ActionSelector nameAction='Deletar' icon={"trash"} colorBack={colors.red[200]} onPress={() => {
                                setTimeout(() => {
                                    ChangeModalVisibility()
                                }, 50)
                                handleOnDelete_Event(event?.id!)
                            }}/>
                        </View>
                    )}
                </ChooseOptionModal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: colors.gray[950],
    },
    content_modal: {
        flex: 1,
        gap: 19,
        marginTop: -15,
        marginBottom: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
});