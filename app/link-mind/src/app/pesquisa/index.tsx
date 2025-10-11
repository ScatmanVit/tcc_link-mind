import { StyleSheet, View, TouchableOpacity } from "react-native";
import { colors } from '@/styles/colors';
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import Categories from "@/src/components/categories";
import Input from "@/src/components/input";
import { useRouter } from "expo-router";
import { FontAwesome6 } from '@expo/vector-icons'; 

export default function PesquisaIndex() {
    const router = useRouter();
    
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
        <SafeAreaView style={{ padding: 10, paddingTop: 7, flex: 1, backgroundColor: colors.gray[950] }}>
            <View style={style.header}>
                <ArrowLeft
                    size={24} 
                    color="#fff"
                    onPress={() => router.back()}
                />
                
                <View style={style.searchContainer}>
                    <Input 
                        placeholder="Pesquise links, notas ou eventos..." 
                        placeholderTextColor={colors.gray[400]} 
                        radius={26} 
                        size={15} 
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

            <Categories data={categories} />
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
        paddingLeft: 8,
        marginBottom: 6,
        gap: 15
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
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
