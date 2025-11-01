import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { colors } from "@/styles/colors";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Modal from 'react-native-modal';
import { ArrowLeft } from "lucide-react-native";

type ConfirmModalProps = {
    item?: string, // para passar com prop para as páginas de edição de link e Resumir com IA
    modalVisible: boolean,
    children: React.ReactNode,
    pageNameModal?: string
    toggleModal: () => void,
    ChangePageNameModal: (page: string) => void,
};

export default function ChooseOptionModal({ 
        item,    
        children, 
        toggleModal, 
        modalVisible, 
        pageNameModal, 
        ChangePageNameModal 
    }: ConfirmModalProps) {
    return (
        <Modal
            isVisible={modalVisible}
            onBackdropPress={toggleModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            useNativeDriver
            style={styles.modal}
            backdropOpacity={0.1}
        >
            <View style={[
                styles.container,
                pageNameModal === "Editar Link"  && { height: "70%" },
                pageNameModal === "Resumir Link com IA"  && { height: "80%" }
            ]}>
                {pageNameModal ? 
                <View style={styles.header}>
                    <View style={styles.header_left}>
                        <Pressable
                            onPress={() => ChangePageNameModal("")}
                            style={({ pressed }) => [
                                {
                                    marginLeft: 10,
                                    padding: 10,
                                    borderRadius: 9999,
                                    justifyContent: "center",
                                    alignItems: "center",
                                },
                                pressed && { backgroundColor: colors.gray[500] }
                            ]}
                        >
                            <ArrowLeft
                                size={24}
                                color={colors.gray[300]}
                            />
                        </Pressable>
                        <Text style={styles.header_title}>
                            {pageNameModal}
                        </Text>
                    </View>
                    <Pressable
                        onPress={toggleModal}
                        style={({ pressed }) => [
                            styles.close_button,
                            pressed && { backgroundColor: colors.gray[500] },
                            pageNameModal && { marginTop: -2, marginBottom: 2, marginRight: 12 }
                        ]}
                    >
                        <FontAwesome6
                            name="xmark"
                            size={21}
                            color={colors.gray[300]}
                        />
                    </Pressable>
                </View> :
                    <Pressable
                        onPress={toggleModal}
                        style={({ pressed }) => [
                            styles.close_button,
                            pressed && { backgroundColor: colors.gray[500] },
                        ]}
                    >
                        <FontAwesome6
                            name="xmark"
                            size={21}
                            color={colors.gray[300]}
                        />
                    </Pressable>
                
                }
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: "flex-end",
    },
    header: { 
        width: "100%",
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderWidth: 0.1,
        paddingVertical: 10,
        borderBottomColor: colors.gray[700] 
    },
    header_left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2
    },
    header_title: {
        color: colors.gray[200],
        fontSize: 19,
        fontWeight: 600,
        marginLeft: 6
    },
    close_button: {
        alignSelf: "flex-start",
        marginLeft: 15,
        marginBottom: -10,
        marginTop: 10,
        padding: 10,
        borderRadius: 9999,
    },
    container: {
        width: "100%",
        height: "28%",
        backgroundColor: colors.gray[800],
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    }
});
