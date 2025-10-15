import { useEffect, useState, useContext } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { colors } from '@/styles/colors'

import { useCategory } from '@/src/components/categories/useCategory'
import { AuthContext } from '@/context/auth'
import Categories from '@/src/components/categories/categories'
import LinkSkeleton from '@/src/components/links/linksSkeleton';
import Links from '@/src/components/links/links'
import EmptyState from '@/src/components/emptyStatePage'

import list_Links from '@/src/services/links/listLinks'
import delete_Link from '@/src/services/links/deleteLink'

export default function LinksIndex() {
   const { user } = useContext(AuthContext) // provisório pegar do estado, não da para usar o secure store no web
   const router = useRouter()
   
   const { selectedCategory, setSelectCategory } = useCategory()
   const [ links, setLinks ] = useState<any[]>([])
   const [ isLoading, setIsLoading ] = useState<boolean>(false)
   
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
         - Quando ele cria um item usando uma categoria (real ou padrão), o controller do backend recebe todas as categorias necessárias em um único envio. 
         - Assim, ele trata como se estivesse enviando apenas a escolhida, mas persiste todas de uma vez, mantendo UX limpa e sem precisar alterar a API.
      */


   async function fetch_Links() {
      if(user && user.access_token_prov) {  
         try {
            setIsLoading(true)
            const linksRes = await list_Links(user.access_token_prov)
            if (Array.isArray(linksRes?.links)) {
               console.log(linksRes.message)
               console.log(linksRes.links) 
               setTimeout(() => {
                  setLinks(linksRes.links)
                  setIsLoading(false)
               }, 1000)
            } else {
                  setLinks([]) 
                  setIsLoading(false)
            } 
         } catch(err: any) {  
            console.log(err.message)    
         } 
      } else {
         console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
      } 
   }

   async function handleOnDelete_Link(id: string) {
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
         } catch(err: any) {
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

   useEffect(() => {
      if (user?.access_token_prov) {
         fetch_Links()
      }
   }, [])
   
   const categories = [
      { id: '1', name: 'Todas' },
      { id: '2', name: 'Estudos' }, 
      { id: '3', name: 'Trabalho' },
      { id: '4', name: 'Finanças' },
     { id: '5', name: 'Academia' },
     { id: '6', name: 'Progresso' },
     { id: '7', name: '+' }
  ]
  
   
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
         ) : links.length === 0 ? (
            <EmptyState 
               categoryName={selectedCategory} 
               pageName="Links"
               onBackPage={() => router.push('/tabs/links')} 
            />
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
