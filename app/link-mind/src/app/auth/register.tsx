import { View, StyleSheet, Button, Text, Touchable, TouchableOpacity } from "react-native";
import Input from "@/components/input";
import Separator from '@/components/separator'
import ButtonAuth from "./components/buttonAuth";
import ButtonApp from '@/components/button'
import { useForm, Controller } from "react-hook-form";
import { colors } from "@/src/styles/colors";

export default function Register() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      senha: ""
    }
  });

  function onSubmit(data: any) {
    console.log("Dados do formulário:", data);
  }

  return (
    <View style={s.container}>
      <Controller
        control={control}
        name="nome"
        rules={{ required: "Nome é obrigatório" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Nome"
            icon="user"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.nome ? true : false}
          />
        )}
      />

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
            label="Email"
            placeholder="Email"
            icon="envelope"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email ? true : false}
          />
        )}
      />

      <Controller
        control={control}
        name="senha"
        rules={{
          required: "Senha é obrigatória",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Senha"
            placeholder="Senha"
            icon="lock"
            secureTextEntry={true}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.senha ? true : false}
          />
        )}
      />
      {errors.senha && <Text style={s.errorText}>{errors.senha.message}</Text>}
      
      <ButtonApp 
        text="Cadastre-se"
        onPress={handleSubmit(onSubmit)}
      />

      <Separator/>

      <View style={s.buttonGoogle}>
         <ButtonAuth 
          title="Entrar com Google" 
          icon="google" 
          onPress={() => console.log("clicou")} 
        />
      </View>

      <ButtonApp 
        text="Entrar sem conta"
        colorBack={colors.gray[800]}
        color={colors.gray[50]}
        // onPress={} mostrar modal de aviso, e depois do accept redirecionar
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
   backgroundColor: colors.gray[950],
   flex: 1,
   paddingTop: 80,
   justifyContent: "flex-start",
   alignItems: "center",
   paddingHorizontal: 20,
   gap: 12
  },
  errorText: {
   color: colors.red[500],
   alignSelf: "flex-start",
   marginLeft: 10,
   marginBottom: 10,
  },
  buttonGoogle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
