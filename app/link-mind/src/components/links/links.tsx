import { FlatList, Linking, Alert, View, Text, StyleSheet, Pressable } from 'react-native'
import Link from "@/components/links/link"
import Categories from '@/src/components/categories/categories'
import { colors } from '@/src/styles/colors'
import { CreateLinkProps } from '@/src/services/links/createLink'

type LinksPropsComponent = {
    id: string,
    title: string,
    link: string
}

export type LinkWithId = CreateLinkProps & { id: string }

type LinksProps = {
    data: LinksPropsComponent[]
    onDelete: (id: string) => void,
    modalOptionsVisiblity: () => void,
    setLink: (link: LinkWithId) => void,
    categories: { id: string, nome?: string }[],
    selectedCategory?: { id: string, nome?: string },
    setSelectCategory: (category: { id: string, nome?: string }) => void
}

export default function Links({
     data,
     setLink, 
     onDelete, 
     categories, 
     selectedCategory, 
     setSelectCategory, 
     modalOptionsVisiblity 
    }: LinksProps) {

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
            nestedScrollEnabled
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator
            style={{ flex: 1 }}
            ListHeaderComponent={
                <View style={{ flexShrink: 0, flexDirection: "row", gap: 1, alignItems: "center", marginBottom: 6 }}>
                    <View pointerEvents="box-none" style={{ flexShrink: 0, width: "100%" }}>
                        <Categories
                            data={categories}
                            selectedCategory={selectedCategory}
                            setSelectCategory={setSelectCategory}
                        />
                    </View>
                    <Pressable
                        style={style.alert_add_category}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: colors.gray[400],
                            }}
                        >
                            {categories.length === 1 ? 'Adicione uma categoria!' : null}
                        </Text>
                    </Pressable>

                </View>
            }
            contentContainerStyle={{ padding: 3, gap: 12 }}
            renderItem={({ item }) => (
                <View style={{ marginHorizontal: 11 }}>
                    <Pressable onPress={() => {
                        setLink(item)
                    }} style={({ pressed }) => [
                        { flex: 1, marginHorizontal: -3 },
                        pressed && { backgroundColor: colors.gray[800], opacity: 0.7 }
                    ]}>
                        <Link
                            id={item.id}
                            title={item.title}
                            link_url={item.link}
                            onOpen_url={() => handleOpenUrl(item.link)}
                            onDelete={() => onDelete(item.id)}
                            onModalvisibleDetails={() => {
                                setLink(item)
                                modalOptionsVisiblity() 
                            }}
                        />
                    </Pressable>
                </View>
            )}ListFooterComponent={
                <View style={{ backgroundColor: colors.gray[950], flex: 1, height: 200, }}>

                </View>
            }
        />
    )
}

const style = StyleSheet.create({
    alert_add_category: {
        borderRadius: 22
    },

})