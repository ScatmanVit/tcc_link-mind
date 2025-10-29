import React from "react";
import { View, Modal, StyleSheet } from "react-native";
import { colors } from "@/styles/colors"; 

type ConfirmModalProps = {

};

export default function ChooseOptionModal() {
    return (
        <View style={styles.container}>
            <Modal
                transparent
                animationType="fade"
            >
             {/* MODAL DE ESCOLHA ESTILO PINTEREST, 3 ESCOLHAS, ALTERAR, RESUMIR COM IA( OU ESCREVER COM IA OU ABRIR ROTA ENFIM ) 
                Depois de ter o modal feito ir para o back-end escrever e arquiteturar a ferramenta resumir com IA, pensar e fazer tudo
             */}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    }
});