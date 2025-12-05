import { FlatList, View, Text, StyleSheet, Pressable } from 'react-native';
import Categories from '@/src/components/categories/categories';
import { colors } from '@/src/styles/colors';
import { useRouter } from 'expo-router';
import Input from '../input'; 
import { AnnotationProps } from './annotation';
import Anotacao from './annotation'

type EventsProps = { 
    data: AnnotationProps[]; 
    onCreateCategory: () => void;
    onDelete: (id: string) => void;
    modalOptionsVisibility: () => void;
    setAnnotation: (annotation: AnnotationProps) => void; 
    categories: { id: string; nome: string }[];
    selectedCategory?: { id: string; nome?: string };
    modalOptionsVisibilityViewAnnotation: (title: string) => void; 
    setSelectCategory: (category: { id: string; nome?: string }) => void;
};

export default function Annotations({
    data,
    setAnnotation,
    onDelete,
    categories,
    selectedCategory,
    onCreateCategory,
    setSelectCategory,
    modalOptionsVisibility,
    modalOptionsVisibilityViewAnnotation,
}: EventsProps) {
    const router = useRouter();

    return (
        <FlatList
            nestedScrollEnabled
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            ListHeaderComponent={
                <View style={{ flexShrink: 0, flexDirection: 'column', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                    <Pressable style={style.input_search} onPress={() => router.push("/pesquisa")}>
                        <View pointerEvents='none'>
                            <Input
                                placeholder="Pesquise em Anotações"
                                placeholderTextColor={colors.gray[400]}
                                iconColor={colors.gray[400]}
                                icon="magnifying-glass"
                                radius={26}
                                height={45}
                                size={15}
                            />
                        </View>
                    </Pressable>
                    <View pointerEvents="box-none" style={{ flexShrink: 0, width: "105%", marginBottom: "-4%" }}>
                        <Categories
                            data={categories}
                            selectedCategory={selectedCategory}
                            setSelectCategory={setSelectCategory}
                            onCreateCategory={onCreateCategory}
                        />
                    </View>
                    {categories.length === 0 && ( 
                        <Pressable style={style.alert_add_category}>
                            <Text style={{ fontSize: 16, color: colors.gray[400] }}>
                                Adicione uma categoria para eventos!
                            </Text>
                        </Pressable>
                    )}
                </View>
            }
            contentContainerStyle={{ paddingHorizontal: 11, gap: "1%", paddingBottom: 200 }} 
            renderItem={({ item }) => (
                <Pressable
  
                    style={({ pressed }) => [ 
                        { flex: 1 },
                        pressed && { backgroundColor: colors.gray[800], opacity: 0.7, borderRadius: 8 }
                    ]}
                > 
                <Anotacao 
                    title={item.title}
                    annotation={item.annotation}
                    onDelete={() => onDelete(item.id)}
                    onOpenDetails={() => {
                        setAnnotation(item);
                        setTimeout(() => {
                            modalOptionsVisibility()
                        }, 0)  
                    }}
                    modalOptionsVisibilityViewAnnotation={() => {
                            setAnnotation(item);
                            modalOptionsVisibilityViewAnnotation(item.title);
                        }}
                />
                </Pressable>
            )}
            ListFooterComponent={<View style={{ height: 200 }} />}
        />
    );
}

const style = StyleSheet.create({
    alert_add_category: {
        borderRadius: 22,
    },
    input_search: {
        marginHorizontal: 0, 
        marginVertical: 7,
        width: '100%',
    },
});