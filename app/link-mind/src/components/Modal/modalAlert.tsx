import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

type ErrorType = {
  name?: { message: string };
  email?: { message: string };
  password?: { message: string };
};

type ErroProps = {
  errors: ErrorType;
};

function Erro({ errors }: ErroProps) {
  return (
    <>
      {errors.password && (
        <Text style={styles.errorText}>
          <Text style={styles.errorPrefix}>A sua senha deve ter no mínimo: </Text>
          {errors.password.message}
        </Text>
      )}
    </>
  );
}

type ModalAlertProps = {
  modalVisible: boolean;
  toggleModal: () => void;
  errors: ErrorType;
};

export default function ModalAlert({ modalVisible, toggleModal, errors }: ModalAlertProps) {
  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={toggleModal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver
    >
      <View style={styles.modal}>
        <View style={styles.modal_header}>
          <Text style={styles.modal_header_content}>Aviso</Text>
        </View>
        <View style={styles.modal_content}>
          <Erro errors={errors} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    alignSelf: 'center',
  },
  modal_header: {
    marginBottom: 10,
  },
  modal_header_content: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modal_content: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  errorPrefix: {
    color: 'black',
  },
});
