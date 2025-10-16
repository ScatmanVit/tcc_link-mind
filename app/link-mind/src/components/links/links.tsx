// Links.tsx
import { FlatList, StyleSheet, View } from 'react-native'
import Link from "@/components/links/link"
import Categories from '@/src/components/categories/categories'
import { Heading1 } from 'lucide-react-native'

type LinksPropsComponent = {
    id: string,
    title: string,
    link: string
}

type LinksProps = {
    data: LinksPropsComponent[]
    onDelete: (id: string) => void,
    onDetails: (id: string) => void,
    categories: { id: string, name: string }[],
    selectedCategory: string,
    setSelectCategory: (category: string) => void
}

export default function Links({ data, onDelete, onDetails, categories, selectedCategory, setSelectCategory }: LinksProps) {

    function handleOpenUrl() {
        // redireciona para o link externo
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator
            style={{ flex: 1 }}
            ListHeaderComponent={
                <View style={{ flexShrink: 0 }}>
                    <Categories 
                        data={categories}
                        selectedCategory={selectedCategory}
                        setSelectCategory={setSelectCategory}
                    />
                </View>
            }
            contentContainerStyle={{ padding: 3, gap: 14 }}
            renderItem={({ item }) => (
                <View style={{ marginHorizontal: 11 }}>
                    <Link
                        id={item.id}
                        title={item.title}
                        link_url={item.link}
                        onOpen_url={handleOpenUrl}
                        onDelete={() => onDelete(item.id)}
                        onDetails={() => onDetails(item.id)}
                    />
                </View>
            )}
            ItemSeparatorComponent={() => (
                <View style={{ height: 0.5, backgroundColor: '#444', marginVertical: 1}} />
            )}
        />
    )
}
