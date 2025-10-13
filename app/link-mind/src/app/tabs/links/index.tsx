import { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'
import Categories from '@/src/components/categories/categories'
import Link from '@/src/components/links/link'

import { useCategory } from '@/src/components/categories/useCategory' 
import Links from '@/src/components/links/links'

export default function LinksIndex() {
   const { selectedCategory, setSelectCategory } = useCategory()
   const [ links, setLinks ] = useState()
   // estado para prevalecer  e não precisar ficar fazendo refetch
   // além de quando adcionar um link ou categoria, inserir no estado sem precisar fazer GET de tudo de novo

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


const testLinks = [
  { id: '1', title: 'Google', link: 'https://www.google.com' },
  { id: '2', title: 'YouTube', link: 'https://www.youtube.com' },
  { id: '3', title: 'GitHub', link: 'https://github.com' },
  { id: '4', title: 'React Native Docs', link: 'https://reactnative.dev/docs/getting-started' },
  { id: '5', title: 'Stack Overflow', link: 'https://stackoverflow.com' },
  { id: '6', title: 'MDN Web Docs', link: 'https://developer.mozilla.org' },
  { id: '7', title: 'Reddit', link: 'https://www.reddit.com' },
  { id: '8', title: 'Twitter', link: 'https://twitter.com' },
  { id: '9', title: 'LinkedIn', link: 'https://www.linkedin.com' },
  { id: '10', title: 'Facebook', link: 'https://www.facebook.com' },
  { id: '11', title: 'Instagram', link: 'https://www.instagram.com' },
  { id: '12', title: 'Netflix', link: 'https://www.netflix.com' },
  { id: '13', title: 'Spotify', link: 'https://www.spotify.com' },
  { id: '14', title: 'Medium', link: 'https://medium.com' },
  { id: '15', title: 'Dev.to', link: 'https://dev.to' },
  { id: '16', title: 'Hacker News', link: 'https://news.ycombinator.com' },
  { id: '17', title: 'NPM', link: 'https://www.npmjs.com' },
  { id: '18', title: 'VS Code', link: 'https://code.visualstudio.com' },
  { id: '19', title: 'Docker', link: 'https://www.docker.com' },
  { id: '20', title: 'Kubernetes', link: 'https://kubernetes.io' },
  { id: '21', title: 'TypeScript', link: 'https://www.typescriptlang.org' },
  { id: '22', title: 'Python', link: 'https://www.python.org' },
  { id: '23', title: 'JavaScript', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { id: '24', title: 'Node.js', link: 'https://nodejs.org' },
  { id: '25', title: 'Expo', link: 'https://expo.dev' },
]

function handleOnDelete_Link(id: string) {
   // bla bla bla apaga do estado do links AQUI, recebendo o id de dentro do <Links/>
}

function handleOnDetails_Link(id: string) {
    // abre o modal/página do link, onde vai puxar no banco esse link
    // la vai poder, editar, deletar, ir para o link de novo, e resumir com IA
    // passa categorias aqui também porque lá o usuário também vai poder escolher 
}

   return (
      <View style={styles.container}>
         <Categories 
            data={categories}
            selectedCategory={selectedCategory}
            setSelectCategory={setSelectCategory}
         />
        <Links 
            data={testLinks}
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
