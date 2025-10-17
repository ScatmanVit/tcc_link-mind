import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

import { colors } from '@/styles/colors'
import { useCategory } from '@/src/components/categories/useCategory'
import { AuthContext } from '@/context/auth'

import type { CategoryPropsItem } from '../../../app/_layout'
import { STORAGE_KEY, FLAG_KEY } from '../../../app/_layout'
import { getCategoriesToSync, 
    invalidateCategoriesStorage } 
from '@/src/async-storage/categories'



import LinkSkeleton from '@/src/components/links/linksSkeleton';
import Links from '@/src/components/links/links'
import EmptyState from '@/src/components/emptyStatePage'

import list_Links from '@/src/services/links/listLinks'
import delete_Link from '@/src/services/links/deleteLink'
import category_Create from '@/src/services/categories/createCategories'
import categories_List from '@/src/services/categories/listCategories'

export default function LinksIndex() {
    const { user } = useContext(AuthContext) // provisório pegar do estado, não da para usar o secure store no web
    const router = useRouter()

    const { selectedCategory, setSelectCategory } = useCategory()
    const [categories, setCategories] = useState<CategoryPropsItem[]>([])
    const [links, setLinks] = useState<any[]>([])
    const [linksFiltered, setLinksFiltered] = useState<any[] | null>([])

    const [isLoading, setIsLoading] = useState<boolean>(false)


    // ------------------------- NOTAS ------------------------------
    // além de quando adcionar um link ou categoria, inserir no estado sem precisar fazer GET de tudo de novo
    /* fazer uma função que busca as categoriais do usuário com base no seu ID, em uma função 
       utilit[aria que só recebe o objeto e e usar ela aqui para pegar as categorias e jogar no componente categories */

    /* USAR PRESSIONAR POR 1 SEGUNDO PARA DELETAR CATEGORIA INDIVIDUALMENTE COM MODAL */

    /* 
       Melhor opção: TER UMA TABELA DE CATEGORIAS VINCULADAS AO USUÁRIO. 
       O usuário só pode usar essas categorias para categorizar itens no geral. 
       Ao cadastrar um novo item, se quiser criar uma categoria nova, ele deve usar um botão que cria a categoria na tabela de categorias (não no item), 
       e só depois criar o item com essa nova categoria.
 
       Fetch inicial:
       - Buscar categorias do usuário 
       - Buscar itens do usuário 
 
       Vantagens:
       - Cadastro de categorias centralizado
       - Facilita filtros no app
       - Mantém consistência e escalabilidade
 
       IMPORTANTE:
       - No primeiro uso do app, o usuário vê categorias padrão **localmente**, sem estarem no banco ainda. 
       - Mas quando ele abrir o app pela primeira vez quando o app detectar conexão com internet, ele vai enviar todas juntas
          e apaga-las do async storage, e passar a puxar apartir dali sempre do banco de dados,
       - E ele também vai poder cadastrar só uma, porque a api foi construida para aceitar envio de vários objetos e 1 só também
       obs: para inutilizar o async storage mudando a flag de categoriesSynced": true para categoriesSynced": false
       */


    async function fetch_Links() {
        if (user && user.access_token_prov) {
            try {
                setIsLoading(true)
                const linksRes = await list_Links(user.access_token_prov)
                if (Array.isArray(linksRes?.links)) {
                    console.log(linksRes.message)
                    console.log(linksRes.links)
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

    async function handleOnDelete_Link(id: string) { // aplicar comand pattern depois ( desfazer ) com toast
        if (user && user.access_token_prov) {
            try {
                const deleteLink = await delete_Link({
                    access_token: user.access_token_prov,
                    id_link: id
                })
                if (deleteLink?.message) {
                    console.log(deleteLink.message)
                    setTimeout(() => {
                        setLinks(prev => prev.filter(link => link.id !== id))
                    }, 500)
                }
            } catch (err: any) {
                console.log(err.message)
            }
        } else {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
        }
    }

    function handleOnDetails_Link(id: string) {
        const link = links.find(link => link.id === id)
        if (link) {
            console.log('Detalhes do link:', link)
        }
    }

    
    async function syncCategories_and_fetchCategories() {
        if(user && user.access_token_prov) {
        try {
            const localCategories = await getCategoriesToSync()
            console.log("CATEGORIAS LOCAIS", localCategories)
            
            if (localCategories.length > 0) {
                const res = await category_Create(user.access_token_prov, localCategories)
                    if(res?.message) {
                        console.log("CADASTROU CATEGORIAS", res.message)
                    }
                    await invalidateCategoriesStorage()
                    setCategories(localCategories)
                }
            else { 
                console.log("asdasd")  
                const res = await categories_List(user.access_token_prov)
                if (res?.categories) {
                    console.log("CHAMOU CATEOGIRAS DA API", res.message)
                    console.log(res.categories)
                    setCategories(res.categories)
                }
            } 
        } catch(err: any) {
                    console.log(err)
                }
            
        } else {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
        }
    }


    useEffect(() => {
        if (user?.access_token_prov) {
            console.log("asdas")
            fetch_Links()
            syncCategories_and_fetchCategories()
        }
    }, [])


    // ISSO AQUI VAI FUNCIONAR QUANDO EU TIVER O OBJETO DA API DAS CATEGORIAS DO USUÁRIO, FALTA FAZER A FUNÇÃO DE FETCH DAS CATEGORIAS, CHAMAR AQUI E GUARDAR NO ESTADO
    // useEffect(() => {
    //    if (selectedCategory && selectedCategory != "Todas") {
    //       setLinksFiltered(
    //          links.filter(links => links.categoryId === selectedCategory.id)
    //       )
    //    } else {
    //       setLinksFiltered(null)
    //    }

    // }, [selectedCategory])


    return (
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
                </>
            ) : (
                <Links
                    data={links}
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
