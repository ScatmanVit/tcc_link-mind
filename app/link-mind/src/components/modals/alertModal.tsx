import { colors } from '@/src/styles/colors';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

type ErrorType = {
  name?: { message?: string };
  email?: { message?: string };
  password?: { message?: string };
}; 

type ErroProps = {
  errors?: ErrorType | undefined;
};

function Erro({ errors }: ErroProps) {
  return (
    <>
      {errors && (
        <View>
          {errors.name && <Text style={styles.errorText}><Text style={styles.errorTextBlack}>Seu nome é </Text>{errors.name.message}</Text>}
          {errors.email && <Text style={styles.errorText}><Text style={styles.errorTextBlack}>O email esta </Text>{errors.email.message}</Text>}
          {errors.password && <Text style={styles.errorText}><Text style={styles.errorTextBlack}>A senha é </Text>{errors.password.message}</Text>}
        </View>
      )}
    </>
  );
}

type ModalAlertProps = {
  modalVisible: boolean;
  toggleModal: () => void;
  errors?: ErrorType;
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
            <Erro errors={errors}/>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.gray[700],
    borderRadius: 15,
    padding: 20,
    width: 350,
    alignSelf: 'center',
  },
  modal_header: {
    marginBottom: 10,
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 1
  },
  modal_header_content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  modal_content: {
    marginTop: 10
  },
  errorTextBlack: {
    color: "white"
  },
  errorText: {
    fontSize: 16,
    color: colors.green[200],
    marginBottom: 8,
    marginRight: 5
  }
});
