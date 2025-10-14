import { useEffect, useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'

import { useCategory } from '@/src/components/categories/useCategory'
import { AuthContext } from '@/context/auth'
import Categories from '@/src/components/categories/categories'
import Links from '@/src/components/links/links'

import list_Links from '@/src/services/links/listLinks'

export default function LinksIndex() {
   const { user } = useContext(AuthContext) // provisório pegar do estado, não da para usar o secure store no web
   const { selectedCategory, setSelectCategory } = useCategory()
   const [links, setLinks] = useState<any[]>([])
   // estado para prevalecer  e não precisar ficar fazendo refetch
   // além de quando adcionar um link ou categoria, inserir no estado sem precisar fazer GET de tudo de novo

   async function fetch_Links() {
      if(user) {  
         try {
            const linksRes = await list_Links(user.access_token_prov)
            if (linksRes?.links) {
               console.log(linksRes.message)
               console.log(linksRes.links)
               setLinks(linksRes.links)  
            } 
         } catch(err: any) {  
            console.log(err.message)    
         } 
      } else {
         console.log("Usuário não autenticado")
      } 
   }
   useEffect(() => {
      if (user?.access_token_prov) {
            console.log(user.access_token_prov)
         fetch_Links()
      }
   }, [user])

 
   
   const categories = [
      { id: '1', name: 'Todas' },
      { id: '2', name: 'Estudos' }, 
      { id: '3', name: 'Trabalho' },
      { id: '4', name: 'Finanças' },
      { id: '5', name: 'Academia' },
      { id: '6', name: 'Progresso' },
      { id: '7', name: '+' }
   ]
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



   function handleOnDelete_Link(id: string) {
      setLinks(prev => prev.filter(link => link.id !== id))
   }

   function handleOnDetails_Link(id: string) {
      const link = links.find(link => link.id === id)
      if (link) {
         console.log('Detalhes do link:', link)
      }
   }

   return (
      <View style={styles.container}>
         <Categories 
            data={categories}
            selectedCategory={selectedCategory}
            setSelectCategory={setSelectCategory}
         />
         <Links 
            data={links}
            onDelete={handleOnDelete_Link}
            onDetails={handleOnDetails_Link}   
         />
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
