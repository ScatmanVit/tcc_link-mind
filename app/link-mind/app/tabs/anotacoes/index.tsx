import { useContext, useEffect, useState } from "react";
import { colors } from "@/src/styles/colors";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from '@react-native-community/netinfo';

import { CategoryPropsItem } from "../../_layout";
import { AuthContext } from "@/src/context/auth";
import { useCategory } from "@/src/components/categories/useCategory";

import CreateCategoryModal from "@/src/components/modals/createCategoryModal";
import category_Create from "@/src/services/categories/createCategories";
import categories_List from "@/src/services/categories/listCategories";
import { type AnnotationProps } from "@/src/components/annotations/annotation";
import AnotacaoSkeleton from "@/src/components/annotations/annotationSkeleton";
import Annotations from '@/src/components/annotations/annotations'
import ChooseOptionModal from "@/src/components/modals/modalBottomSheet";
import ActionSelector from "@/src/components/actionSelector";
import { getCategoriesToSync, invalidateCategoriesStorage } from "@/src/async-storage/categories";
import list_Annotations from "@/src/services/annotations/listAnnotations";
import { useRouter } from "expo-router";

export default function AnotacoesIndex() {
    const { user } = useContext(AuthContext);
    const { selectedCategory, setSelectCategory } = useCategory();
    const router = useRouter();
    

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ bottomModalVisible, setBottomModalVisible ] = useState<boolean>(false);
    const [ modalCreateCategory, setModalCreateCategory ] = useState<boolean>(false);
    const [ pageNameModal, setPageNameModal ] = useState<string | undefined>(undefined);
    
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([]);
    const [ annotations, setAnnotations ] = useState<AnnotationProps[]>([])
    const [ annotation, setAnnotation ] = useState<AnnotationProps>()
    const [ filteredAnnotations, setFilteredAnnotations ] = useState<AnnotationProps[]>([])


    async function fetch_Annotations() {
        if (user && user.access_token_prov) {
            try {
                setIsLoading(true)
                const annotationRes = await list_Annotations(user.access_token_prov)
                if (Array.isArray(annotationRes?.annotations)) {
                    console.log(annotationRes.message)
                    setTimeout(() => {
                        setAnnotations(annotationRes.annotations)
                        setIsLoading(false)
                    }, 500) 
                } else {
                    setAnnotations([])
                    setIsLoading(false)
                }
            } catch (err: any) {
                console.log(err.message)
            }
        } else {
            console.log("Usuário não autenticado")
        }
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


    async function handleOnDelete_Event(id: string) {
        // if (user && user.access_token_prov) {
        //     try {
        //         const deleteEventRes = await delete_Event({
        //             access_token: user.access_token_prov,
        //             eventId: id
        //         })
        //         if (deleteEventRes?.message) {
        //             console.log(deleteEventRes.message)
        //             setEvents(prev => prev.filter(e => e.id !== id))
        //         }
        //     } catch (err: any) { 
        //         console.log("Erro ao deletar evento:", err.message)
        //     }
        // } else {
        //     console.log("Usuário não autenticado para deletar evento")
        // }
        return true
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
    
    function ChangeModalVisibility() {
            setBottomModalVisible(prev => !prev);
    }
    
    function ChangeModalVisibilityViewAnnotation(title: string) {
        setPageNameModal(`${title}`); 
        ChangeModalVisibility();
    }

    function ChangeModalVisibilityClose() {
        setBottomModalVisible(prev => !prev);
        setTimeout(() => { setPageNameModal(undefined); }, 500);
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
            fetch_Annotations();
            syncCategories_and_fetchCategories();
        }
    }, [user?.access_token_prov]);

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
                        <AnotacaoSkeleton/>
                        <AnotacaoSkeleton/>
                        <AnotacaoSkeleton/>
                        <AnotacaoSkeleton/>
                        <AnotacaoSkeleton/>
                        <AnotacaoSkeleton/>
                    </>

                ): 
                    <Annotations
                        data={annotations ? annotations : filteredAnnotations}
                        categories={categories}
                        setAnnotation={setAnnotation}
                        onDelete={handleOnDelete_Event}
                        selectedCategory={selectedCategory}
                        setSelectCategory={setSelectCategory}
                        modalOptionsVisibility={ChangeModalVisibility}
                        onCreateCategory={ChangeModalVisibilityCategory}
                        modalOptionsVisibilityViewAnnotation={ChangeModalVisibilityViewAnnotation}
                    />
                }
                
                 <ChooseOptionModal
                    modalVisible={bottomModalVisible}
                    toggleModal={ChangeModalVisibility}
                    pageNameModal={pageNameModal}
                    ChangePageNameModal={ChangePageNameModal}
                    toggleModalClose={ChangeModalVisibilityClose}
                    pageOrigin="annotations"
                >
                        <View style={styles.content_modal}>
                            <ActionSelector nameAction='Editar' icon={"pencil"} onPress={() => {
                                ChangeModalVisibilityClose()
                                
                            }}/>
                            <ActionSelector nameAction='Notificar' icon={"bell"} onPress={() => {
                                ChangePageNameModal("Notificar Evento")
                            }}/>
                            <ActionSelector nameAction='Deletar' icon={"trash"} colorBack={colors.red[200]} onPress={() => {
                                setTimeout(() => {
                                    ChangeModalVisibility()
                                }, 50)
                                handleOnDelete_Event(annotation?.id!)
                            }}/>
                        </View>
                </ChooseOptionModal>
            </View>
        </SafeAreaView>
        
    )   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
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
})