import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles/colors';

import Modal from 'react-native-modal';

type OptionsModalProps = {
    isVisible: boolean
    toggleVisible: () => void,
    children: React.ReactNode
} 

export default function OptionsModal({ children, isVisible, toggleVisible }: OptionsModalProps) {
    return (
        <Modal 
            isVisible={isVisible}
            onBackdropPress={toggleVisible}
            useNativeDriver
            backdropOpacity={0.1}
            animationInTiming={1} 
            animationOutTiming={1} 
        >
            <View style={style.container}>
                {children}
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[800],
        paddingVertical: 22,
        borderRadius: 22,
        minWidth: 150,
        marginTop: -390,
        marginRight: 25,
        alignSelf: "flex-end",
        alignItems: "flex-end",
    }
})