import { View, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'
import Categories from '@/components/categories'

export default function LinksIndex() {
   const categories = [
      { id: '1', name: 'Trabalho' },
      { id: '2', name: 'Estudos' },
      { id: '3', name: 'Lazer' },
      { id: '4', name: 'Saúde' },
      { id: '5', name: 'Saúde' },
      { id: '6', name: 'Saúde' },
      { id: '7', name: 'Saúde' },
      { id: '8', name: 'Saúde' },
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
