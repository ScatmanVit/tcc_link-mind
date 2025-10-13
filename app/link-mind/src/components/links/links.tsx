import { FlatList, StyleSheet, View } from 'react-native'
import Link from "@/components/links/link"

type LinksPropsComponent = {
    id: string,
    title: string,
    link: string
}

async function handleDelete_Link(id: string) {
    // chamada do service para apagar o link
}

function handleOpenUrl() {
    // redireciona para o link externo
}

type LinksProps = {
    data: LinksPropsComponent[]
    onDelete: (id: string) => void,
    onDetails: (id: string) => void
}

export default function Links({ data, onDelete, onDetails }: LinksProps) {
    return (
        <View style={style.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                style={{ flex: 1 }}
                contentContainerStyle={style.list}
                renderItem={({ item }) => (
                    <Link
                        id={item.id}
                        title={item.title}
                        link_url={item.link}
                        onOpen_url={handleOpenUrl}
                        onDelete={() => {
                            handleDelete_Link(item.id)
                            onDelete(item.id)
                        }}
                        onDetails={() => onDetails(item.id)}
                    />
                )}
                ItemSeparatorComponent={() => (
                    <View style={{
                        height: 0.5,
                        backgroundColor: '#444', // cor da linha
                        marginVertical: 4       // espaçamento acima e abaixo da linha
                    }} />
                )}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    list: {
        paddingHorizontal: 10,
        gap: 6,
    }
})