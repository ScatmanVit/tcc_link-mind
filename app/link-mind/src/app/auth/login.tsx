import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios'

import { AuthContext } from '@/src/context/auth';

import ButtonAuth from './components/buttonAuth';
import ButtonApp from '@/src/components/button';
import Separator  from '@/components/separator';
import Input from '@/src/components/input';
import { colors } from '@/src/styles/colors';


export default function Login() {
  
  type userLogin = {
    name: string,
    email: string,
    password?: string,
    platform: "mobile"
    google_id?: string,
    id_token?: string
  }
  
  const { signUp, user } = useContext(AuthContext)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  async function userLogin({ 
      email,
      password, 
      platform 
    }: userLogin) {
    try {
        const res = await axios.post(
            "https://tcc-link-mind.onrender.com/linkmind/auth/login",{
            email: email,
            password: password,
            platform: platform
          }
        );
        console.log("Usuário Logado com sucesso!", res.data)
        return res.data
    } catch(err: any) {
        console.error("Erro no cadastro", err?.response?.data?.message || err.message);
    }
  }

  async function userLoginWithGoogle() {
    // login com o google ( quando feito, da pra replicar na tela de cadastro )
    userLogin({
      name: "comida",
      email: "legal",
      platform: "mobile",
      google_id: "asdasdas",
      id_token: "asasdasd"
    }) // contruir o objeto de email e nome para enviar pro bd com os dados do de retorno do google
  }

  async function onSubmitLogin(data: any) {
      signUp(data);
      await userLogin(data)
  }


  return (
    <View style={s.container}>  
      <View style={s.header}>
        <Image source={require("../../../assets/images/icon.png")} style={s.image_header}/>
      </View>
      <View style={s.content}>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
              <Input
                icon="user"
                value={value}
                onBlur={onBlur}
                placeholder="Email"
                onChangeText={onChange}
                error={errors.name ? true : false}
                placeholderTextColor={colors.gray[400]}
              />
            )
          }
        />

        
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
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
            )
          }
        />

        <Controller
          control={control}
          name='password'
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value }}) => (
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
            )
          }
        />
          <ButtonApp
            text="Logar"
            onPress={handleSubmit(onSubmitLogin)}
          />
          <Separator/>
          <ButtonAuth
            title="Logar com o Google"
            icon='google'
            onPress={() => console.log("clicou")}
          />
          <ButtonApp
            text="Entrar sem conta"
            colorBack={colors.gray[800]}
            color={colors.gray[50]}
          />
      </View>
    </View>
  );
}


const s = StyleSheet.create({
  container: {  
    flex:1,
    backgroundColor: colors.gray[950], 
    alignItems: "center",
  },
  header: {
    width: '100%',
    marginVertical: 50,
    marginBottom: 6,
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
   gap: 16
  }
})