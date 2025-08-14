import { Text, View } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '@/src/context/auth';

export default function Login() {
  const { user } = useContext(AuthContext);

  return (
    <View>
      {user ? (
        <>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
        </>
      ) : (
        <Text>Nenhum usuário registrado</Text>
      )}
    </View>
  );
}
