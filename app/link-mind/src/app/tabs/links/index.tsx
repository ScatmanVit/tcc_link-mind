import { View, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'
import Categories from '@/components/categories'

export default function LinksIndex() {
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
         <Categories data={categories} />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.gray[950],

   },
})
