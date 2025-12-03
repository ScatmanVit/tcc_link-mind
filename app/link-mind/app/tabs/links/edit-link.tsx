import { useState, useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useToast } from 'react-native-toast-notifications';
import { FontAwesome6 } from '@expo/vector-icons';
import equal from "fast-deep-equal";

import { colors } from "@/styles/colors";
import { AuthContext } from '@/context/auth'
import Button from "@/components/button/button";
import Categories from "@/components/categories//categories";
import { useCategory } from "@/components/categories/useCategory";
import { type Dispatch, type SetStateAction } from "react";


import { type CategoryPropsItem } from "../../_layout";
import { type UpdateLinkProps } from '@/src/services/links/updateLink'
import categories_List from "@/src/services/categories/listCategories";
import update_Link from '@/src/services/links/updateLink'
import CreateCategoryModal from "@/src/components/modals/createCategoryModal";
import category_Create from "@/src/services/categories/createCategories";
import { LinkWithId } from "@/src/components/links/links";


type EditLinkPageProps = {
    data: UpdateLinkProps
    toggleModal: () => void
    linkId: string | undefined,
    onUpdatedLink: (linkUpdated: LinkWithId) => void,
    setCategoriesPageHome: Dispatch<SetStateAction<CategoryPropsItem[]>>
}


export default function EditLink({
    data,
    linkId,
    toggleModal,
    onUpdatedLink,
    setCategoriesPageHome
    }: EditLinkPageProps) {
    const toast = useToast()
    const { user } = useContext(AuthContext) // provisório pegar do estado o token, não da para usar o secure store no web
    
    const [ link, setLink ] = useState<Partial<UpdateLinkProps>>({
        newTitle: '',
        newLink: '',
        newDescription: '',
        newCategoryId: '' 
    });
    const initialRef = useRef<Partial<UpdateLinkProps> | null>(null)

    useEffect(() => {
        const initial = {
            newTitle: data.newTitle,
            newLink: data.newLink,
            newDescription: data.newDescription,
            newCategoryId: data.newCategoryId
        };

        initialRef.current = initial
        setLink(initial)
        setIdLink(linkId)
        setSelectCategory(
            data.newCategoryId ? { id: data.newCategoryId } : undefined
        )
    }, [ 
        linkId, 
        data.newLink, 
        data.newTitle, 
        data.newCategoryId,
        data.newDescription
    ]);

    const [ idLink, setIdLink ] = useState<string | undefined>('')
    const [ loading, setLoading ] = useState(false)
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([])
    const [ modalCreateCategory, setModalCreateCategory ] = useState<boolean>(false)
    const { selectedCategory, setSelectCategory } = useCategory();

    useEffect(() => {
        console.log("Categorias do estado", categories)
    }, [categories])

    function hasChanges() {
        if (!initialRef.current) return false; 

        const current = {
            newTitle: link.newTitle,
            newLink: link.newLink,
            newDescription: link.newDescription,
            newCategoryId: selectedCategory?.id ?? null
        };

        return !equal(initialRef.current, current);
    }

    async function handleUpdateLink() {
        if (!hasChanges()) {
            toast.show("Nada foi alterado", {
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
            const linkUpdated = await update_Link(
                idLink,
                user.access_token_prov,
                {
                    newTitle: link?.newTitle,
                    newLink: link?.newLink,
                    newDescription: link?.newDescription,
                    newCategoryId: selectedCategory?.id
                } as UpdateLinkProps
            )
            if (linkUpdated?.message) {
                console.log(linkUpdated)
                setLink({ newTitle: '', newLink: '', newDescription: '' })
                setSelectCategory(undefined)
                onUpdatedLink(linkUpdated.linkUpdated)
                toggleModal()
                toast.show(linkUpdated.message, {
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
                dangerIcon: err.message.includes("O link que você tentou alterar não existe") 
                            || err.message.includes("Id do usuário ou link não fornecido para alterar o link do usuário") 
                    ? <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />
                    : <FontAwesome6 name="triangle-exclamation" size={20} color="#F44336" />,
                style: err.message.includes("O link que você tentou alterar não existe") 
                       || err.message.includes("Id do usuário ou link não fornecido para alterar o link do usuário") 
                    ? { backgroundColor: colors.amber[500] }
                    : { backgroundColor: colors.red[500] }

            });
        } finally {
            setLoading(false)
        }
    }
    // COLOCAR NA API EM TODOS OS RETORNOS DE ERRO 400 UM ATRIBUTO NA RSPOSTA CHAMADO TYPE ERROR COM OS SEGUINTES POSSÍVEIS VALORES:
    /* 
        erros 400... = typeMessage: "alert"
        erros 200... = typeMessage: "success"
        erros 500... = typeMessage: "error"
    */ 


   // PASSAR AS CATEGORIAS E A SELECIONADA NAS PROPS DEPOIS, ASSIM ESTOU FAZENDO CHAMADA DA API DESNECESSÁRIAMENTE
   // SÓ APLICAR O FILTRO NAS QUE FOREM PASSADAS E PRONTO, EVITA SOBRECARREGAR A API POR NADA. 
   async function fetch_Categories() {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
            return
        }
        try {   
            const resList = await categories_List(user.access_token_prov)
            if (resList?.categories) { 
                console.log("Categorias LISTADAS COM SUCESSO", resList.categories)
                setCategories([...resList.categories
                        .filter((categorie: any) => categorie.nome !== "Sem categoria")
                        .map((categorie: any) => ({
                            id: String(categorie.id),
                            nome: categorie.nome
                        })), 
                { id: "123123123123", nome: "+" }])
            }
        } catch (err: any) { 
            console.log(err.message)
        }
    }
 
    function ChangeModalVisibilityCategory() {
        setModalCreateCategory(prev => !prev)
    }

    async function handle_CreateCategry(name: string) {
        if (!user || !user.access_token_prov) {
            console.log("Usuário não autenticado") // toast pedindo para fazer login novamente ou chamado do refresh_token
            return
        }
        try {
            const res = await category_Create(user.access_token_prov,
                                        [{ id: "123123123", nome: name }])
            if(res?.message) {
                const resList = await categories_List(user.access_token_prov)
                if(resList?.message) {
                    setCategories(() => [...resList.categories, { id: "123123123", nome: "+" }])
                    ChangeModalVisibilityCategory()
                    setCategoriesPageHome(() => [...resList.categories, { id: "123123123", nome: "+" }])
                }
            }
        } catch(err: any) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        if (user?.access_token_prov) {
            fetch_Categories()
        } 
    }, [user?.access_token_prov])

    return (
        <View style={styles.container}>
            <ScrollView 
                style={{ flex:1 }}
                showsVerticalScrollIndicator={false}
            >
                <CreateCategoryModal 
                    modalVisible={modalCreateCategory}
                    toggleModal={ChangeModalVisibilityCategory}
                    onCategoryName={handle_CreateCategry}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o título do link"
                        placeholderTextColor={colors.gray[300]}
                        underlineColorAndroid="transparent"
                        value={link?.newTitle}
                        onChangeText={(title) => setLink(prevLink => ({ ...prevLink, newTitle: title }))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Link</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://..."
                        placeholderTextColor={colors.gray[300]}
                        underlineColorAndroid="transparent"
                        value={link?.newLink}
                        onChangeText={(link) => setLink(prevLink => ({ ...prevLink, newLink: link }))}
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
                        value={link?.newDescription}
                        onChangeText={(description) => setLink(prevLink => ({ ...prevLink, newDescription: description }))}
                        multiline
                    />
                </View>

                <Text style={styles.label}>Categoria</Text>
                    <Categories
                        data={categories}
                        selectedCategory={selectedCategory}
                        setSelectCategory={setSelectCategory}
                        onCreateCategory={ChangeModalVisibilityCategory}
                    />

                <View style={{ flex: 1, flexDirection: "column", justifyContent:"flex-end", marginTop: 20 }}>
                    <View style={{ height: 50, marginBottom: 50 }}>
                        <Button
                            text={loading ? "Carregando..." : "Editar Link"}
                            colorBack={loading ? colors.gray[400] : undefined}
                            onPress={handleUpdateLink}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[800],
        paddingHorizontal: 18,
        paddingTop: 20

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
        backgroundColor: colors.gray[700],
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
        backgroundColor: '#E0E0E0', 
        padding: 18,
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
