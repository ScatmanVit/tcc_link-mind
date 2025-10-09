import { FlatList, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import Category from '@/components/category'

export type CategoryItem = {
    id: string
    name: string
}

type CategoriesProps = {
    data: CategoryItem[]
}

export default function Categories({ data }: CategoriesProps) {
    const [selected, setSelected] = useState<string | null>(null)

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
                        focused={selected === item.id}
                        onPress={() => setSelected(item.id)}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        justifyContent: 'center'
    },
    list: {
        paddingHorizontal: 10,
        gap: 6,
    },
})