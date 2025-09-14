import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthContext } from '@/src/context/auth';
import ButtonApp from '@/src/components/button';
import Input from '@/src/components/input';
import ModalAlert from '@/src/components/Modal/modalAlert';
import { colors } from '@/src/styles/colors';
import tokenFuncs from '@/src/secure-store/token'

export default function Login() {
    const { signUp } = useContext(AuthContext);
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>()

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    async function userLogin(data: any) {
        try {
            const res = await axios.post(
                "https://tcc-link-mind.onrender.com/api/v1/linkmind/auth/login", {
					email: data.email,
					password: data.password,
					platform: "mobile"
            	}
            );
            await tokenFuncs.saveToken("access-token", res.data.access_token)
            await tokenFuncs.saveToken("refresh-token", res.data.refresh_token)
            console.log(tokenFuncs.getToken("access-token"),tokenFuncs.getToken("refresh-token"))
            return res.data;
        } catch (err: any) {
            setFeedbackMessage(err?.response?.data?.error || 'Ocorreu um erro. Por favor, tente novamente mais tarde.');
            console.error("Erro no Login", err?.response?.data?.message || err.message);
            return null;
        }
    }

    async function onSubmitLogin(data: any) {
        setLoading(true);
        const loginSuccess = await userLogin(data);
        setLoading(false);

        if (loginSuccess) {
            signUp({
                name: loginSuccess?.nameUser,
                email: data.email
            });
            router.replace('/tabs/links');
        } else {
            console.log("Email ou senha inválidos.");
        }
    }

    function onInvalid() {
        setModalVisible(true);
    }

    function toggleModal() {
        setModalVisible(!modalVisible);
    }

    return (
        <View style={s.container}>
            <ModalAlert
                errors={errors}
                toggleModal={toggleModal}
                modalVisible={modalVisible}
            />
            <View style={s.header}>
                <Image source={require("../../../assets/images/icon.png")} style={s.image_header} />
            </View>
            <View style={s.content}>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: "inválido ou não foi fornecido",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "inválido ou não foi fornecido",
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            icon="envelope"
                            value={value}
                            onBlur={onBlur}
                            placeholder="Email"
                            onChangeText={onChange}
                            error={!!errors.email}
                            placeholderTextColor={colors.gray[400]}
                        />
                    	)
                    }
                />

                <Controller
                    control={control}
                    name='password'
                    rules={{
                        required: "inválida ou não foi fornecida",
                        minLength: { 
                            value: 8, message: "mínimo 8 caracteres" 
                        },
                    }}
                    render={({ field: { onBlur, onChange, value } }) => (
                        <Input
                            icon="lock"
                            value={value}
                            onBlur={onBlur}
                            placeholder='Senha'
                            secureTextEntry={true}
                            onChangeText={onChange}
                            error={!!errors.password}
                            placeholderTextColor={colors.gray[400]}
                        />
                    	)
                    }
                />

                <TouchableOpacity 
                    style={s.forgotPasswordButton}
                    onPress={() => router.push('/auth/recover-password')}
                >
                    <Text style={s.forgotPasswordText}>
                        Recuperar senha
                    </Text>
                </TouchableOpacity>

                {feedbackMessage && <Text style={s.feedbackText}>{feedbackMessage}</Text>}

                <ButtonApp
                    text={loading ? "Carregando..." : "Entrar"}
                    colorBack={loading ? colors.gray[400] : undefined}
                    onPress={handleSubmit(onSubmitLogin, onInvalid)}
                />
                
                <View style={s.signupContainer}>
                    <Text style={s.signupText}>Não tem cadastro? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/register')}>
                        <Text style={s.signupLink}>Clique aqui</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}


const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[950],
        alignItems: "center",
        gap: 19
    },
    header: {
        width: '100%',
        marginVertical: 55,
        marginBottom: 27,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    image_header: {
        width: 100,
        height: 100
    },
    content: {
        width: '95%',
        height: '95%',
        justifyContent: "flex-start",
        paddingHorizontal: 15,
        marginTop: 17,
        gap: 16
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 8,
		marginTop: -5
    },
    forgotPasswordText: {
        color: colors.gray[400],
        textDecorationLine: 'underline',
		fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: -3,
    },
    signupText: {
        color: colors.gray[400],
    },
    signupLink: {
        color: colors.gray[400],
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    feedbackText: {
        color: colors.green[300],
        textAlign: 'center',
        fontSize: 16,
    },
});