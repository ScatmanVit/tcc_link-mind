import { View, Text, StyleSheet } from 'react-native'
import { colors } from '@/styles/colors'
import ButtonApp from './button/button'

type EmptyStateProps = {
    categoryName: string,
    onBackPage: () => void,
    pageName: string
}

export default function EmptyState({ categoryName, onBackPage, pageName }: EmptyStateProps) {
  return (
    <View style={style.container}>
      <Text style={style.title}>Nada por aqui 👀</Text>

      <Text style={style.subtitle}>
        Não há {pageName} para listar na categoria{" "} 
        <Text style={style.category}>{categoryName}</Text>.
      </Text>

    <View style={style.button}>
        <ButtonApp  
            text='Voltar à tela inicial' 
            colorBack={colors.green[300]} 
            onPress={onBackPage}
            radius={22}
        />
    </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: colors.gray[950],
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[100],
    marginBottom: 11,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.gray[400],
    marginBottom: 37,
  },
  category: {
    color: colors.green[300],
    fontWeight: '600',
  },
  button: {
    width: "80%",
    height: 43
  },
  buttonText: {
    color: colors.gray[950],
    fontWeight: '600',
    fontSize: 15,
  },
})
