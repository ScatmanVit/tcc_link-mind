import { FlatList, View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
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
    categories: { id: string; nome: string }[];
    selectedCategory?: { id: string; nome?: string };
    setAnnotation: (annotation: AnnotationProps) => void; 
    navigationPageViewAnnotation: (item: AnnotationProps) => void; 
    setSelectCategory: (category: { id: string; nome?: string }) => void;
    onFetchData: () => Promise<void>; 
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
    navigationPageViewAnnotation,
    onFetchData, 
}: EventsProps) {
    const router = useRouter();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await onFetchData(); 
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
        } finally {
            setRefreshing(false);
        }
    }, [onFetchData]);

    return (
        <FlatList
            nestedScrollEnabled
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressBackgroundColor={colors.gray[50]}
                />
            }
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
                    onDelete={() => { onDelete(item.id)
                        console.log('delete', item)
                     }}
                    onOpenDetails={() => {
                        setAnnotation(item);
                        modalOptionsVisibility()
                    }}
                    modalOptionsVisibilityViewAnnotation={() => {
                            navigationPageViewAnnotation(item);
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