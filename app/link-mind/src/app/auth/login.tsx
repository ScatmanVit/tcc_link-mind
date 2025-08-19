import { StyleSheet, View, Image } from 'react-native';
import { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios'

import { AuthContext } from '@/src/context/auth';

import ButtonApp from '@/src/components/button';
import Separator  from '@/components/separator';
import Input from '@/src/components/input';
import { colors } from '@/src/styles/colors';
import { useRouter } from 'expo-router';


export default function Login() {
  const router = useRouter()

  type userLogin = {
    email: string,
    password: string
  }

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { signUp, user } = useContext(AuthContext)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function userLogin({ 
      email,
      password, 
    }: userLogin) {
    try {
        const res = await axios.post(
            "https://tcc-link-mind.onrender.com/linkmind/auth/login",{
            email,
            password,
            platform: "mobile"
          }
        );
        console.log("Usuário Logado com sucesso!", res.data)
        return res.data
    } catch(err: any) {
        console.error("Erro no Login", err?.response?.data?.message || err.message);
    }
  }


  async function onSubmitLogin(data: any) {
      const loginSuccess = await userLogin(data)
      if(loginSuccess){
        signUp({
          name: loginSuccess?.nameUser,
          email: data.email
        })
        // router.push('/tabs/provisional')
      }
  }


  return (
    <View style={s.container}>  
      {/* chamar o modal de alerta depois */}
      <View style={s.header}>
        <Image source={require("../../../assets/images/icon.png")} style={s.image_header}/>
      </View>
      <View style={s.content}>
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
            )
          }
        />

        <Controller
          control={control}
          name='password'
          rules={{
            required: "Senha é obrigatória",
            minLength: { value: 8, message: "mínimo 8 caracteres" },
          }}
          render={({ field: { onBlur, onChange, value }}) => (
              <Input
                icon="lock"
                value={value}
                onBlur={onBlur}
                placeholder='Senha'
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