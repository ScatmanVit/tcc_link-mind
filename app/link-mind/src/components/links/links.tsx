// Links.tsx
import { FlatList, Linking, Alert, View } from 'react-native'
import Link from "@/components/links/link"
import Categories from '@/src/components/categories/categories'

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

    async function handleOpenUrl(link_url: string) {
        let url = link_url.trim();
        if (!link_url.includes('.') || link_url.includes(' ')) {
            Alert.alert('Isso não parece um link válido');
            return;
        }
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Não é possível abrir a URL: ${url}`);
        }
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
                        onOpen_url={() => handleOpenUrl(item.link)}
                        onDelete={() => onDelete(item.id)}
                        onDetails={() => onDetails(item.id)}
                    />
                </View>
            )}
            ItemSeparatorComponent={() => (
                <View style={{ height: 0.5, backgroundColor: '#444', marginVertical: 1 }} />
            )}
        />
    )
}
