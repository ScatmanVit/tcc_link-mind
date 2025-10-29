import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useToast } from 'react-native-toast-notifications';
import { FontAwesome6 } from '@expo/vector-icons';

import { colors } from "@/styles/colors";
import { AuthContext } from '@/context/auth'
import Button from "@/components/button/button";
import Categories from "@/components/categories//categories";
import { useCategory } from "@/components/categories/useCategory";

import { type CategoryPropsItem } from "../../_layout";
import { type CreateLinkProps } from '@/src/services/links/createLink'
import categories_List from "@/src/services/categories/listCategories";
import create_Link from "@/src/services/links/createLink";

export default function CreateLink() {
    const toast = useToast()
    const { user } = useContext(AuthContext) // provisório pegar do estado o token, não da para usar o secure store no web


    const [link, setLink] = useState<Partial<CreateLinkProps>>({
        title: '',
        link: '',
        description: '', 
    });
    const [ loading, setLoading ] = useState(false)
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([])
    const { selectedCategory, setSelectCategory } = useCategory();

    async function handleCreateLink() {
        if (!link.title?.trim() || !link.link?.trim()) {
            toast.show("O título e o link são obrigatórios", {
                type: 'danger',
                placement: "top",
                duration: 2000,
                icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                style: { backgroundColor: colors.amber[500] }
            })
            return
        }
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
            return
        }
        console.log({
            link
        });

        try {
            setLoading(true)
            const linkCreated = await create_Link(
                user.access_token_prov,
                {
                    title: link?.title,
                    link: link?.link,
                    description: link?.description,
                    categoriaId: selectedCategory?.id
                } as CreateLinkProps
            )
            if (linkCreated?.success) {
                console.log(linkCreated)
                setLink({ title: '', link: '', description: '' })
                setSelectCategory(undefined)
                toast.show(linkCreated.message, {
                    type: 'success',
                    placement: "top",
                    duration: 2000,
                    icon: <FontAwesome6 name="check-circle" size={20} color="#4CAF50" />
                });
            }
        } catch (err: any) {
            console.log(err.message)
            toast.show(err.message, {
                type: 'danger',
                placement: "top",
                duration: 3000,
                dangerIcon: err.message.includes("Campos obrigatórios") 
                    ? <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />
                    : <FontAwesome6 name="triangle-exclamation" size={20} color="#F44336" />,
                style: err.message.includes("Campos obrigatórios") 
                    ? { backgroundColor: colors.amber[500] }
                    : { backgroundColor: colors.red[500] }

            });
        } finally {
            setLoading(false)
        }
    }
    // COLOCAR NA API EM TODOS OS RETORNOS DE ERRO 400 UM ATRIBUTO NA RSPOSTA CHAMADO TYPE ERROR COM OS SEGUINTES POSSÍVEIS VALORES:
    /* 
        erros 400... = typeError: "alert"
        erros 200... = typeError: "success"
        erros 500... = typeError: "error"
    */ 
    async function fetch_Categories() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
            return
        }
        try {  
            const resList = await categories_List(user.access_token_prov)
            if (resList?.categories) { 
                console.log("Categorias LISTADAS COM SUCESSO")
                setCategories([...resList.categories
                        .filter((categorie: any) => categorie.nome !== "Sem categoria")
                        .map((categorie: any) => ({
                            id: categorie.id,
                            nome: categorie.nome
                        })), 
                { id: 123123123, nome: "+" }])
            }
        } catch (err: any) { 
            console.log(err.message)
        }
    }
 
    useEffect(() => {
        if (user?.access_token_prov) {
            fetch_Categories()
        } 
    }, [user?.access_token_prov])

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o título do link"
                    placeholderTextColor={colors.gray[300]}
                    underlineColorAndroid="transparent"
                    value={link?.title}
                    onChangeText={(title) => setLink(prevLink => ({ ...prevLink, title }))}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Link</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://..."
                    placeholderTextColor={colors.gray[300]}
                    underlineColorAndroid="transparent"
                    value={link?.link}
                    onChangeText={(link) => setLink(prevLink => ({ ...prevLink, link }))}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Adicione uma descrição..."
                    placeholderTextColor={colors.gray[300]}
                    underlineColorAndroid="transparent"
                    value={link?.description}
                    onChangeText={(description) => setLink(prevLink => ({ ...prevLink, description }))}
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
                <Button
                    text={loading ? "Carregando..." : "Criar Link"}
                    colorBack={loading ? colors.gray[400] : undefined}
                    onPress={handleCreateLink}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[950],
        paddingHorizontal: 18,
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
        fontSize: 17,
        marginBottom: 6,
    },
    inputContainer: {
        marginBottom: 18,
    },
    input: {
        outlineWidth: 0,
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
    toastContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0', // fundo cinza
        padding: 12,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    sideBar: {
        width: 6,
        height: '100%',
        borderRadius: 2,
        marginRight: 10,
    },
    toastText: {
        color: '#000',
        flexShrink: 1,
    }
});
