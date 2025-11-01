import { useEffect, useState, useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors'
import { useCategory } from '@/src/components/categories/useCategory'
import { AuthContext } from '@/context/auth'

import type { CategoryPropsItem } from '../../../app/_layout'
import {
    getCategoriesToSync,
    invalidateCategoriesStorage
} from '@/src/async-storage/categories'

import LinkSkeleton from '@/src/components/links/linksSkeleton';
import Links, { LinkWithId } from '@/src/components/links/links'

import list_Links from '@/src/services/links/listLinks'
import delete_Link from '@/src/services/links/deleteLink'
import category_Create from '@/src/services/categories/createCategories'
import categories_List from '@/src/services/categories/listCategories'
import ChooseOptionModal from '@/src/components/modals/modalBottomSheet'
import ActionSelector from '@/src/components/actionSelector';


export default function LinksIndex() {
    const { user } = useContext(AuthContext) // provisório pegar do estado o token, não da para usar o secure store no web
    const { selectedCategory, setSelectCategory } = useCategory()
 
    const [ links, setLinks ] = useState<any[]>([])
    const [ link, setLink ] = useState<LinkWithId>()
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ modalVisible, setModalVisible ] = useState<boolean>(false)
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([])
    const [ linksFiltered, setLinksFiltered ] = useState<any[] | null>([])
    const [ pageNameModal, setPageNameModal ] = useState<string | undefined>(undefined)
    
    async function fetch_Links() {
        if (user && user.access_token_prov) {
            try {
                setIsLoading(true)
                const linksRes = await list_Links(user.access_token_prov)
                if (Array.isArray(linksRes?.links)) {
                    console.log(linksRes.message)
                    setTimeout(() => {
                        setLinks(linksRes.links)
                        setIsLoading(false)
                    }, 500)
                } else {
                    setLinks([])
                    setIsLoading(false)
                }
            } catch (err: any) {
                console.log(err.message)
            }
        } else {
            console.log("Usuário não autenticado")
        }
    }

    async function handleOnDelete_Link(id: string) { // aplicar comand pattern depois se der ( desfazer ) com toast
        if (user && user.access_token_prov) {
            try {
                const deleteLink = await delete_Link({
                    access_token: user.access_token_prov,
                    id_link: id
                })
                if (deleteLink?.message) {
                    console.log(deleteLink.message)
                    setLinks(prev => prev.filter(link => link.id !== id))
                }
            } catch (err: any) {
                console.log(err.message)
            }
        } else {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
        }
    }


    async function syncCategories_and_fetchCategories() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
            return
        }

        const netState = await NetInfo.fetch()
        const isConnected = netState.isConnected

        const localCategories = await getCategoriesToSync()

        if (!isConnected) {
            console.log("Sem internet, carregando categorias locais")
            setCategories([...localCategories, { id: 123123123, nome: "+" }])
            return
        }
        try {
            const localCategories = await getCategoriesToSync()

            if (localCategories.length > 0) {
                const res = await category_Create(user.access_token_prov, localCategories)

                if (res?.message) {
                    console.log("CADASTROU CATEGORIAS", res.message)
                    const resList = await categories_List(user.access_token_prov)

                    if (resList?.categories) {
                        setCategories([...resList.categories, { id: 123123123, nome: "+" }])
                    } else {
                        setCategories(localCategories)
                    }
                    await invalidateCategoriesStorage()
                } else {
                    setCategories(localCategories)
                    console.log("Falha ao sincronizar, usando categorias locais")
                }
            }
            else {
                const res = await categories_List(user.access_token_prov)
                if (res?.categories) {
                    console.log(res.message)
                    setCategories([...res.categories, { id: 123123123, nome: "+" }])
                }
            }
        } catch (err: any) {
            console.log(err)
        }
    }

    function ChangeModalVisibility() {
        setModalVisible(prev => !prev)
    }

    useEffect(() => {
        if (user?.access_token_prov) {
            fetch_Links()
            syncCategories_and_fetchCategories()
        }
    }, [])
    
    useEffect(() => {
        console.log("🔗 Link salvo no estado:", link)    
    }, [link])
 
    useEffect(() => {
        if (!selectedCategory) {
            setLinksFiltered(null);
        } else if (selectedCategory.nome === "Sem categoria") {
            const linksFilter = links.filter(link => !link.categoriaId || link.categoriaId === "");
            setLinksFiltered(linksFilter);
        } else if (selectedCategory.nome !== "Todas") {
            const linksFilter = links.filter(link => link.categoriaId === selectedCategory.id);
            setLinksFiltered(linksFilter);
        } else {
            setLinksFiltered(null);
        }
    }, [selectedCategory, links])  
 
    function ChangePageNameModal(page: string | undefined) {
         ChangeModalVisibility()
         setTimeout(() => {
            setPageNameModal(page)
            ChangeModalVisibility()
       }, 185) 
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.container}>

                {isLoading ? (
                    <>
                        <LinkSkeleton />
                        <LinkSkeleton />
                        <LinkSkeleton />
                        <LinkSkeleton />
                        <LinkSkeleton />
                        <LinkSkeleton />
                        <LinkSkeleton />
                        <LinkSkeleton />
                    </> 
                ) : (
                        <Links
                            data={linksFiltered ? linksFiltered : links}
                            setLink={setLink}
                            categories={categories}
                            onDelete={handleOnDelete_Link}
                            selectedCategory={selectedCategory}
                            setSelectCategory={setSelectCategory}
                            modalOptionsVisiblity={ChangeModalVisibility}
                        />
                )} 
                <ChooseOptionModal 
                    modalVisible={modalVisible} 
                    toggleModal={ChangeModalVisibility}
                    pageNameModal={pageNameModal}
                    ChangePageNameModal={ChangePageNameModal}
                >
                    {pageNameModal ?
                        <Text>
                            PAGE NAME MODAL TESTE
                        </Text>
                    :    
                        <View style={styles.content_modal}>
                            <ActionSelector nameAction='Editar' icon={"pencil"} onPress={() => {
                                ChangePageNameModal("Editar Link")
                            }}/>
                            <ActionSelector nameAction='Resumir com IA' icon={"north-star"} onPress={() => {
                                ChangePageNameModal("Resumir Link com IA")
                            }}/>
                            <ActionSelector nameAction='Deletar' icon={"trash"} colorBack={colors.red[200]} onPress={() => {
                                ChangeModalVisibility()
                                handleOnDelete_Link(link?.id!)
                            }}/>
                        </View>
                    }
                </ChooseOptionModal> 
            </View>
        </SafeAreaView>
    )
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
        marginTop: -6,
        marginBottom: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
})
