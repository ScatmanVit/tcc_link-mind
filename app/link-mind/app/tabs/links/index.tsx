import { useEffect, useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'


import { colors } from '@/styles/colors'
import { useCategory } from '@/src/components/categories/useCategory'
import { AuthContext } from '@/context/auth'

import type { CategoryPropsItem } from '../../../app/_layout'
import {
    getCategoriesToSync,
    invalidateCategoriesStorage
} from '@/src/async-storage/categories'

import LinkSkeleton from '@/src/components/links/linksSkeleton';
import Links from '@/src/components/links/links'

import list_Links from '@/src/services/links/listLinks'
import delete_Link from '@/src/services/links/deleteLink'
import category_Create from '@/src/services/categories/createCategories'
import categories_List from '@/src/services/categories/listCategories'

export default function LinksIndex() {
    const { user } = useContext(AuthContext) // provisório pegar do estado o token, não da para usar o secure store no web
    const { selectedCategory, setSelectCategory } = useCategory()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoryPropsItem[]>([])
    const [linksFiltered, setLinksFiltered] = useState<any[] | null>([])
    const [links, setLinks] = useState<any[]>([])


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

    function handleOnDetails_Link(id: string) { // Bottom sheet com tudo do link
        const link = links.find(link => link.id === id)
        if (link) {
            console.log('Detalhes do link:', link)
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


    useEffect(() => {
        if (user?.access_token_prov) {
            fetch_Links()
            syncCategories_and_fetchCategories()
        }
    }, [])


    useEffect(() => {
        if (selectedCategory && selectedCategory.nome != "Todas") {
            const linksFilter = links.filter(links => links.categoriaId === selectedCategory.id)
            setLinksFiltered(linksFilter)
        } else {
            setLinksFiltered(null)
        }
    }, [selectedCategory, links])


    return (
        <View style={styles.container}>
            {isLoading ? (
                <>
                    <LinkSkeleton />
                    <LinkSkeleton />
                    <LinkSkeleton />
                    <LinkSkeleton />
                    <LinkSkeleton />
                </>
            ) : (
                <Links
                    data={linksFiltered ? linksFiltered : links}
                    onDelete={handleOnDelete_Link}
                    onDetails={handleOnDetails_Link}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectCategory={setSelectCategory}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: colors.gray[950],
    },
})
