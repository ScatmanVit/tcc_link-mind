import { Text, View } from "react-native";
import ItemSelector from "@/src/components/itemSelector";
import { colors } from "@/src/styles/colors";

export default function AnotacoesIndex() {
    return (
        <View>
            <View style={{ width: 140 }}>
                <ItemSelector name="Arquivar" icon="box-archive" onPress={() => { }} />
                <ItemSelector
                    name="Excluir"
                    icon="trash"
                    iconColor={colors.red[500]}
                    textColor={colors.red[500]}
                    onPress={() => { }}
                />
            </View>
            <Text>testando Anotacoes INDEX</Text>
        </View>
    );
}
