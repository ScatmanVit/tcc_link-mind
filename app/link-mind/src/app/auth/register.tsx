import { View, StyleSheet, Image } from "react-native";
import axios from 'axios'

import Input from "@/components/input";
import Separator from '@/components/separator'
import ButtonAuth from "./components/buttonAuth";
import ButtonApp from '@/components/button'

import { AuthContext } from '@/src/context/auth'
import { useForm, Controller } from "react-hook-form";
import { useContext, useEffect } from "react";
import { colors } from "@/src/styles/colors";


export default function Register() {
  const { signUp, isLogged, user } = useContext(AuthContext)
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  }); 

  async function registerUser(data: { 
    name: string; 
    email: string; 
    password: string,
    platform: "mobile" 
  }) {
    try {
      const res = await axios.post(
        "https://tcc-link-mind.onrender.com/linkmind/auth/cadastro",
        data
      );
      console.log("Usuário cadastrado com sucesso!", res.data);
      return res.data;
    } catch (err: any) {
      console.error("Erro no cadastro", err?.response?.data?.message || err.message);
    }
  }

  function onSubmit(data: any) {
    signUp({
      name: data.name,
      email: data.email
    });

    registerUser(data)
  }

  useEffect(() => {
    if (user) {
      isLogged(user);
    }   
  }, [])

  return (
    <View style={s.content}>
      <View style={s.header}>
        <Image source={require("../../../assets/images/icon.png")} style={s.image_header}/>
    
      </View>

      <View style={s.container}>
         <Controller
          control={control}
          name="name"
          rules={{ required: "Nome é obrigatório" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nome"
              icon="user"
              value={value}
              onBlur={onBlur}
              placeholder="Nome"
              onChangeText={onChange}
              error={errors.name ? true : false}
              placeholderTextColor={colors.gray[400]}
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
            icon="envelope"
            value={value}
            onBlur={onBlur}
            placeholder="Email"
            onChangeText={onChange}
            error={errors.email ? true : false}
            placeholderTextColor={colors.gray[400]}

          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "Senha é obrigatória",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Senha"
            icon="lock"
            value={value}
            onBlur={onBlur}
            placeholder="Senha"
            secureTextEntry={true}
            onChangeText={onChange}
            error={errors.password ? true : false}
            placeholderTextColor={colors.gray[400]}
          />
        )}
      />
      
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
    </View>
  );
}

const s = StyleSheet.create({
  content: { 
    flex:1,
    backgroundColor: colors.gray[950], 
    alignItems: "center" 
  },
  header:{
    width: '100%',
    marginTop: 7,
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
