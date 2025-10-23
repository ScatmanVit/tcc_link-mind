import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";
import { colors } from '@/styles/colors';
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import Categories from "@/src/components/categories/categories";
import Input from "@/src/components/input";
import { useRouter } from "expo-router";
import { FontAwesome6 } from '@expo/vector-icons';
import { useCategory } from "@/src/components/categories/useCategory";

export default function PesquisaIndex() {
    const router = useRouter();
    const { selectedCategory, setSelectCategory, } = useCategory()

    const categories = [
        { id: '1', name: 'Todas' },
        { id: '2', name: 'Estudos' },
        { id: '3', name: 'Trabalho' },
        { id: '4', name: 'Finanças' },
        { id: '5', name: 'Academia' },
        { id: '6', name: 'Progresso' },
        { id: '7', name: 'Família' }
    ];

    return (
        <SafeAreaView style={{ padding: 7, paddingTop: 1, flex: 1, backgroundColor: colors.gray[950] }}>
            <View style={style.header}>
                <Pressable style={({ pressed }) => [
                    { padding: 8, borderRadius: 9999 }, 
                    pressed && { backgroundColor: colors.gray[600] } 
                ]}>
                    <ArrowLeft
                        size={24}
                        color="#fff"
                        onPress={() => router.back()}
                    />     
                </Pressable>


                <View style={style.searchContainer}>
                    <Input
                        placeholder="Pesquise links, notas ou eventos"
                        placeholderTextColor={colors.gray[400]}
                        radius={26}
                        size={15}
                        iconColor={colors.gray[400]}
					    icon="magnifying-glass"
                    />
                    <TouchableOpacity activeOpacity={0.7} style={style.searchButton}>
                        <FontAwesome6
                            name="magnifying-glass"
                            color={colors.gray[950]}
                            size={19}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Categories 
                data={categories}
                selectedCategory={selectedCategory}
                setSelectCategory={setSelectCategory}
            />
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    header: {
        width: "100%",
        height: 77,
        backgroundColor: colors.gray[950],
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2.5,
        paddingLeft: 8,
        gap: 15
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: -9,
        maxWidth: 260,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: colors.gray[800],
        borderRadius: 25,
        paddingHorizontal: 15,
        color: "#fff",
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: colors.green[300],
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    }
});
