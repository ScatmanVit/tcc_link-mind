import { FlatList, StyleSheet, View } from 'react-native'
import Category from '@/src/components/categories/category'
import { useEffect } from 'react'
import { type CategoryPropsItem as CategoryItem } from "../../../app/_layout";


type CategoriesProps = {
    data: CategoryItem[],
    selectedCategory?: { id: string, nome?: string },
    setSelectCategory: (category: { id: string, nome?: string }) => void
    onCreateCategory?: () => void
}

export default function Categories({ 
    data, 
    selectedCategory, 
    setSelectCategory,
    onCreateCategory = () => {}
}: CategoriesProps) {

    return (
        <View 
            style={styles.container}    
        >
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                        <Category
                            categoryName={item?.nome}
                            focused={selectedCategory?.id === item.id}
                            onPress={() => (
                                item.nome != '+' 
                                    ? setSelectCategory({ id: item.id, nome: item.nome })
                                    : onCreateCategory()
                            )}
                        />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 3,
        justifyContent: 'center',
        flexGrow: 0,

    },
    list: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 6,
    },
})