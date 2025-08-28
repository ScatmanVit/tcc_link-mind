import { View, StyleSheet, Image, Text, Button } from "react-native";
import axios from 'axios'

import ModalAlert from "@/components/Modal/modalAlert"
import ButtonApp from '@/components/button'
import Separator from '@/components/separator'
import Input from "@/components/input";

import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from '@/src/context/auth'
import { colors } from "@/src/styles/colors";
 

export default function Register() {
  const { signUp, isLogged, user } = useContext(AuthContext)
  
  const [modalVisible, setModalVisible] = useState<boolean>(false)  
  const [registerButton, setRegisterButton] = useState<boolean>(false)

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
    password: string;
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

  async function onSubmit(data: any) {
    signUp({
      name: data.name,
      email: data.email
    })
    const registerSuccess = await registerUser(data)
    if(registerSuccess){
      setRegisterButton(true)
    }
  }

  useEffect(() => {
    let timeout: any
    if (user) {
      timeout = setTimeout(() => {
        isLogged(user);
      }, 900);
    } 

    return () => {
      clearTimeout(timeout)
      setRegisterButton(false)
    }
  }, [registerButton])

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

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
          minLength: { value: 8, message: "mínimo 8 caracteres" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
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

      <ButtonApp 
        text="Entrar sem conta"
        colorBack={colors.gray[800]}
        color={colors.gray[50]}
        onPress={toggleModal}
      />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  content: { 
    flex:1,
    backgroundColor: colors.gray[950], 
    alignItems: "center",
    justifyContent: "center" 
  },
  header:{
    width: '100%',
    marginVertical: 100,
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
   gap: 16
  }
});
