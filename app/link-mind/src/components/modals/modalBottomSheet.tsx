import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { colors } from "@/styles/colors";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Modal from 'react-native-modal';
import { ArrowLeft } from "lucide-react-native";

type ChooseOptionModalProps = {
    item?: string, 
    modalVisible: boolean,
    children: React.ReactNode,
    pageNameModal?: string
    toggleModal: () => void,
    pageOrigin?: string
    ChangePageNameModal: (page: string) => void,
    toggleModalClose: () => void
};

export default function ChooseOptionModal({ 
        item,    
        children, 
        toggleModal, 
        modalVisible, 
        pageNameModal,
        toggleModalClose,
        pageOrigin, 
        ChangePageNameModal 
    }: ChooseOptionModalProps) {
    return (
        <Modal
            isVisible={modalVisible}
            onBackdropPress={toggleModalClose}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={100}   
            animationOutTiming={100}  
            useNativeDriver
            style={styles.modal}
            backdropOpacity={0}
            onBackButtonPress={toggleModalClose}
            onDismiss={toggleModalClose}
        >
            <View style={[
                styles.container,
                    pageNameModal === "Editar Link"
                    ? { height: "78%" }
                    : pageNameModal === "Resumir Link com IA"
                    ? { height: "80%" }
                    : pageNameModal === "Editar Evento" 
                    ? { height: "95%" }
                    : pageNameModal === "Notificar Evento" 
                    ? { height: "70%" }
                    : pageNameModal && pageOrigin === "events" 
                    ? { height: "80%" }
                    : pageNameModal && pageOrigin === "links" && { height: "60%" }

                    
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
                        <Text style={styles.header_title} numberOfLines={1}>
                            {pageNameModal}
                        </Text>
                    </View>
                    <Pressable
                        onPress={toggleModalClose}
                        style={({ pressed }) => [
                            styles.close_button,
                            pressed && { backgroundColor: colors.gray[500] },
                            pageNameModal && { marginTop: -2, marginBottom: 2, marginRight: 12 },
                            pageNameModal?.includes("") && { marginLeft: -30 }
                        ]}
                    >
                        <FontAwesome6
                            name="xmark"
                            size={21}
                            color={colors.gray[300]}
                        />
                    </Pressable>
                </View> 
                : <Pressable
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
        borderWidth: 0.7,
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
        marginLeft: 6,
        maxWidth: "75%"

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
        height: "24%",
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
