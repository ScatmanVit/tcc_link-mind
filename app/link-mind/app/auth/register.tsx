import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import axios from 'axios';
import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";

import ModalAlert from "@/src/components/modals/modalAlert";
import ButtonApp from '@/src/components/button/button';
import Input from "@/components/input";
import { AuthContext } from '@/context/auth';
import { colors } from "@/src/styles/colors";

type FormData = {
	name: string;
	email: string;
	password: string;
};

export default function Register() {
	const { signUp } = useContext(AuthContext);
	const router = useRouter();

	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [feedbackMessage, setFeedbackMessage] = useState<string>()

	const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
		defaultValues: {
			name: "",
			email: "",
			password: ""
		}
	});

	/* 	Depois de fazer cadastro, chamar o login para 
		receber os tokens e ai sim gaurdar o estado global e os tokens no secure store.
		Porque do jeito que ta não da para enviar o token de acesso para as rotas privadas.

		Além de gerencias o refresh token para preservar
		login sem obrigar o usuário a logar de novo, mesmo da web.
	*/

	async function registerUser(data: FormData) {
		try {
			const res = await axios.post(
				"http://localhost:3000/api/v1/linkmind/auth/cadastro",
				data
			);
			console.log("Usuário cadastrado com sucesso!", res.data);
			return res.data;
		} catch (err: any) {
			setFeedbackMessage(err?.response?.data?.error || 'Ocorreu um erro. Por favor, tente novamente mais tarde.');
			console.error("Erro no cadastro", err?.response?.data?.message || err.message);
			return null;
		}
	}

	async function onSubmit(data: FormData) {
		setLoading(true);
		const result = await registerUser(data);
		setLoading(false);

		if (result) {
			signUp({ name: data.name, email: data.email });
			setTimeout(() => {
				router.replace('/auth/login');
			}, 800)
		} else {
			console.log("Ocorreu um erro ao registrar no servidor.");
		}
	}

	function onInvalid() {
		setModalVisible(true);
	}

	function toggleModal() {
		setModalVisible(!modalVisible);
	}

	return (
		<View style={s.content}>
			<ModalAlert
				errors={errors}
				toggleModal={toggleModal}
				modalVisible={modalVisible}
			/>
			<View style={s.header}>
				<Image source={require("../../assets/images/icon.png")} style={s.image_header} />
			</View>

			<View style={s.container}>
				<Controller
					control={control}
					name="name"
					rules={{ required: "obrigatório" }}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							icon="user"
							value={value}
							onBlur={onBlur}
							placeholder="Nome"
							onChangeText={onChange}
							error={!!errors.name}
							placeholderTextColor={colors.gray[400]}
						/>
					)}
				/>
				<Controller
					control={control}
					name="email"
					rules={{
						required: "inválido ou não foi fornecido",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "inválido ou não fornecido",
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
					)}
				/>
				<Controller
					control={control}
					name="password"
					rules={{
						required: "inválida ou não foi fornecida",
						minLength: { 
							value: 8, message: "mínimo 8 caracteres"
						},
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							icon="lock"
							value={value}
							onBlur={onBlur}
			 				placeholder="Senha"
							secureTextEntry={true}
							onChangeText={onChange}
							error={!!errors.password}
							placeholderTextColor={colors.gray[400]}
						/>
					)}
				/>
				<View
					style={s.forgotPasswordButton}
				>
					<Text style={s.forgotPasswordText}>
						Já tem cadastro?  
					</Text>
					<TouchableOpacity onPress={() => router.push('/auth/login')}>
						<Text style={s.signupLink}>Clique aqui</Text>
					</TouchableOpacity>
				</View>

				{feedbackMessage && <Text style={s.feedbackText}>{feedbackMessage}</Text>}
					
				<View style={s.buttonSend}>
					<ButtonApp
						text={loading ? "Carregando..." : "Cadastre-se"}
						colorBack={loading ? colors.gray[400] : undefined}
						onPress={handleSubmit(onSubmit, onInvalid)}
					/>
				</View>

			</View>
		</View>
	);
}

const s = StyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: colors.gray[950],
		alignItems: "center",
		justifyContent: "center",
		gap: 40
	},
	header: {
		width: '100%',
		marginTop: 200,
		marginBottom: 6,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	image_header: {
		width: 100,
		height: 100
	},
	container: {
		width: '95%',
		height: '95%',
		justifyContent: "flex-start",
		paddingHorizontal: 15,
		gap: 14
	},
	forgotPasswordButton: {
		flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -3,
		marginBottom: 12,
		gap:5
	},
	forgotPasswordText: {
		color: colors.gray[400]
	},
	signupLink: {
        color: colors.gray[400],
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
	buttonSend: {
        width: "100%",
        height: 45
    },
	feedbackText: {
        color: colors.green[300],
        textAlign: 'center',
        fontSize: 16,
    },
});