import * as SecureStore from 'expo-secure-store';

async function saveToken(name: string,token: string) {
    try {
        await SecureStore.setItemAsync(name, token)
        console.log(`Token recebido: ${token}. Tipo dele: ${name}`)
        return true
    } catch(err) {
        console.error("Erro ao salvar o token no secure store", err)
        return false
    }
}

async function getToken(name: string) {
    try {
        const token = await SecureStore.getItemAsync(name)
        console.log(`Token recuperado com sucesso: ${token}` )
        return token
    } catch(err) {
        console.error("Erro ao recuperar o token no secure store", err)
        return false
    }
}

async function deleteToken(name: string) {
    try {
        await SecureStore.deleteItemAsync(name)
        return true
    } catch(err) {
        console.error("Erro ao deletar o token do secure store", err)
        return false
    }
}


export default {
    saveToken,
    getToken,
    deleteToken
}