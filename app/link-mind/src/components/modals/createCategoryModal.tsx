import { View, StyleSheet, Pressable, Text } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Modal from 'react-native-modal';
import { colors } from "@/styles/colors";
import Input from "../input";
import ButtonApp from "../button/button";
import { useState } from "react";

type CreateCategoryModalProps = {
    modalVisible: boolean;
    toggleModal: () => void;
    onCategoryName: (name: string) => void;
};

export default function CreateCategoryModal({ 
    toggleModal, 
    modalVisible,
    onCategoryName
}: CreateCategoryModalProps) {

    const [ name, setName ] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false)


    return (
        <Modal
            isVisible={modalVisible}
            onBackdropPress={toggleModal}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={20}   
            animationOutTiming={20}  
            useNativeDriver
        >
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <Text style={styles.title}>Criar categoria</Text>

                    <Pressable onPress={toggleModal}>
                        <FontAwesome6
                            name="xmark"
                            size={21}
                            color={colors.gray[300]}
                        />
                    </Pressable>
                </View>
                    <Input
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={colors.gray[400]}
                        placeholder="Nome da categoria"
                    />
                <View style={{ height: 48, marginTop: 13 }}>
                    <ButtonApp 
                        text={isLoading ? "...Carregando" : "Salvar"}
                        colorBack={isLoading ? colors.gray[400] : undefined}
                        
                        onPress={() => {
                            onCategoryName(name);
                            setTimeout(() => {
                                setIsLoading(false)
                            }, 3000)
                            setIsLoading(true)        
                            setName("");          
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[800],
        padding: 20,
        minHeight: "28.5%",
        borderRadius: 14

    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 45
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.gray[50]
    }
});
