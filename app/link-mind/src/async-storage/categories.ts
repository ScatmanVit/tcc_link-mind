import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEY, FLAG_KEY } from '../../app/_layout'


async function getCategoriesToSync() {
    try {
        const flag = await AsyncStorage.getItem(FLAG_KEY)
        const shouldSync = flag ? JSON.parse(flag) : false

        if (shouldSync) {
            const stored = await AsyncStorage.getItem(STORAGE_KEY)
            const categories = stored ? JSON.parse(stored) : []
            console.log('Categorias locais prontas para sincronizar:', categories)
            return categories
        }
        return []
    } catch (err: any) {
        console.error('Erro ao buscar categorias locais:', err)
        return []
    }
}

async function invalidateCategoriesStorage() {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]))
        await AsyncStorage.setItem(FLAG_KEY, JSON.stringify(false))
        console.log('Categorias locais invalidadas — agora só banco de dados.')
    } catch (err: any) {
        console.error('Erro ao invalidar AsyncStorage:', err)
    }
}

export {
    getCategoriesToSync,
    invalidateCategoriesStorage
}