import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import ButtonApp from '@/src/components/button';
import Input from '@/src/components/input';
import { colors } from '@/src/styles/colors';

type FormData = {
    email: string;
};

export default function RecoverPassword() {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            email: '',
        }
    });

    async function handleRecoverPassword(data: FormData) {
        setLoading(true);
        setFeedbackMessage('');
        try {
            const res = await axios.post(
                "https://tcc-link-mind.onrender.com/api/v1/linkmind/auth/reset-password-send",
                data
            );
            console.log(res.data)
            setFeedbackMessage('Se este email estiver cadastrado, um link de recuperação foi enviado.');
        } catch (err: any) {
            console.error("Erro na recuperação de senha", err?.response?.data?.error || err.message);
            setFeedbackMessage(err?.response?.data?.error || 'Ocorreu um erro. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Image source={require("../../../assets/images/icon.png")} style={s.image_header} />
            </View>
            <View style={s.content}>
                <Text style={s.title}>Recuperar Senha</Text>
                <Text style={s.subtitle}>
                    Digite seu email para receber um link de redefinição de senha.
                </Text>

                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: "Email é obrigatório",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Email inválido",
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            icon="envelope"
                            value={value}
                            onBlur={onBlur}
                            placeholder="Digite seu email"
                            onChangeText={onChange}
                            error={!!errors.email}
                            placeholderTextColor={colors.gray[400]}
                        />
                    )
                    }
                />
                
                {errors.email && <Text style={s.errorText}>{errors.email.message}</Text>}

                <ButtonApp
                    text={loading ? "Enviando..." : "Enviar Link"}
                    colorBack={loading ? colors.gray[400] : undefined}
                    onPress={handleSubmit(handleRecoverPassword)}
                />

                {feedbackMessage && <Text style={s.feedbackText}>{feedbackMessage}</Text>}
                
                <TouchableOpacity style={s.backButton} onPress={() => router.push('/auth/login')}>
                    <Text style={s.backButtonText}>Voltar para o Login</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}


const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[950],
        alignItems: "center",
        justifyContent: 'center',
    },
    header: {
        marginTop: -130,
        width: '100%',
        marginBottom: 40,
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
        paddingHorizontal: 15,
        gap: 18
    },
    title: {
        color: colors.gray[50],
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: colors.gray[400],
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    errorText: {
        color: colors.red[500],
        alignSelf: 'flex-start',
        marginTop: -10,
    },
    feedbackText: {
        color: colors.green[300],
        textAlign: 'center',
        fontSize: 16,
    },
    backButton: {
        marginTop: 20,
    },
    backButtonText: {
        color: colors.gray[400],
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 16,
    }
});