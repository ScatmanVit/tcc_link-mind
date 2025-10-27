import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { colors } from "@/styles/colors";
import { useCategory } from "@/components/categories/useCategory";

import Button from "@/components/button/button";
import Categories from "@/components/categories//categories";
import categories_List from "@/src/services/categories/listCategories";
import { AuthContext } from '@/context/auth'
import { CategoryPropsItem } from "../../_layout";

export default function CreateLink() {
    const { user } = useContext(AuthContext) // provisório pegar do estado o token, não da para usar o secure store no web
    
    
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([])
    const { selectedCategory, setSelectCategory } = useCategory();

    function handleCreateLink() {
        if (!title.trim() || !url.trim()) return;
        console.log({
            title,
            url,
            description,
            category: selectedCategory,
        });
    }

    async function fecth_Categories() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
            return
        }
        try { 
            const resList = await categories_List(user.access_token_prov)
            console.log(resList)
            if (resList?.categories) {
                setCategories([...resList.categories, { id: 123123123, nome: "+" }])
            }
        } catch(err: any) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        if (user?.access_token_prov) {
            fecth_Categories()
        }
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Link</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o título do link"
                    placeholderTextColor={colors.gray[300]}
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Link</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://..."
                    placeholderTextColor={colors.gray[300]}
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Adicione uma descrição..."
                    placeholderTextColor={colors.gray[300]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
            </View>

            <Text style={styles.label}>Categoria</Text>
            <Categories
                data={categories}
                selectedCategory={selectedCategory}
                setSelectCategory={setSelectCategory}
            />

            <View style={{ marginTop: 25 }}>
                <Button text="Criar Link" onPress={() => console.log("sadasd")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[950],
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        color: colors.gray[50],
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
    },
    label: {
        color: colors.gray[100],
        fontSize: 15,
        marginBottom: 6,
    },
    inputContainer: {
        marginBottom: 18,
    },
    input: {
        backgroundColor: colors.gray[800],
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: colors.gray[50],
        fontSize: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
});
