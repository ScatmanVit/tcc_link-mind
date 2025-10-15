import { FlatList, StyleSheet, View } from 'react-native'
import Category from '@/src/components/categories/category'

export type CategoryItem = {
    id: string
    name: string
}

type CategoriesProps = {
    data: CategoryItem[],
    selectedCategory: string,
    setSelectCategory: (category: string) => void
}

export default function Categories({ data, selectedCategory, setSelectCategory }: CategoriesProps) {

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Category
                        categoryName={item.name}
                        focused={selectedCategory === item.name}
                        onPress={() => setSelectCategory(item.name)}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 3,
        justifyContent: 'center'
    },
    list: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 6,
    },
})