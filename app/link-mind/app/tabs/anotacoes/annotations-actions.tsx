import { colors } from "@/src/styles/colors";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { View, StyleSheet, TextInput, ScrollView, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation, useLocalSearchParams } from 'expo-router'; 
import Categories from "@/src/components/categories/categories";
import { CategoryPropsItem } from "../../_layout";
import { useCategory } from "@/src/components/categories/useCategory";
import CreateCategoryModal from "@/src/components/modals/createCategoryModal";
import category_Create from "@/src/services/categories/createCategories";
import categories_List from "@/src/services/categories/listCategories";
import { AuthContext } from '@/context/auth';
import { getCategoriesToSync, invalidateCategoriesStorage } from "@/src/async-storage/categories";
import NetInfo from '@react-native-community/netinfo';
import create_Annotation from "@/src/services/annotations/createAnnotation";
import { useToast } from 'react-native-toast-notifications';
import { FontAwesome6 } from "@expo/vector-icons";
import equal from "fast-deep-equal"; 
import update_Annotation from "@/src/services/annotations/updateAnnotation";


type InitialAnnotationState = {
    title?: string
    annotation?: string,
    categoriaId?: string
}

type ParamsAnnotation = {
    id?: string,
    title?: string,
    annotation?: string
    categoriaId?: string
    categoriesParams?: string
}

export default function AnnotationActions() {
    const navigation = useNavigation();
    const toast = useToast()
    const { user } = useContext(AuthContext)
    
    const searchParams = useLocalSearchParams<ParamsAnnotation>();
    const { id, title, annotation, categoriaId, categoriesParams } = searchParams; 
    const { selectedCategory, setSelectCategory } = useCategory()
    
    const [ saveStatus, setSaveStatus ] = useState<'saving' | 'saved' | null>(null);
    const timerRef = useRef<any>(null);
    
    const [ focusTitle, setFocusTitle ] = useState<boolean>(false)
    const [ titleText, setTitleText ] = useState<string>('')
    const [ annotationText, setAnnotationText ] = useState<string>('')
    const [ categories, setCategories ] = useState<CategoryPropsItem[]>([])
    const [ modalVisibilityCategory, setModalVisibilityCategory ] = useState<boolean>(false) 
    
    const textNoteRef = useRef(annotationText); 
    const textTitleNoteRed = useRef(titleText)
    const categoriaIdRef = useRef(selectedCategory)
    const initialRef = useRef<InitialAnnotationState | null>(null)
    
    function hasChanges({ title, annotation, categoriaId }: InitialAnnotationState): boolean {
        if (!initialRef.current) return false; 

        const current: InitialAnnotationState = {
            title,
            annotation,
            categoriaId
        };

        return !equal(initialRef.current, current);
    }
    
    async function sendToApi() {
        const finalTitle = textTitleNoteRed.current;
        const finalAnnotation = textNoteRef.current;
        const finalCategoriaId = categoriaIdRef.current
        
        if (!finalAnnotation?.trim() && !finalTitle?.trim()) {
            return;
        }

        if (id) {
            if (!hasChanges({
                title: finalTitle,
                annotation: finalAnnotation,
                categoriaId: finalCategoriaId?.id
            })) {
                toast.show("Nada foi alterado", {
                    type: 'danger',
                    placement: "top",
                    duration: 2000,
                    icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                    style: { backgroundColor: colors.amber[500] }
                })
                return
            } 
            
            if (!finalAnnotation?.trim()) {
                toast.show("A anotação é obrigatória", {
                    type: 'danger',
                    placement: "top",
                    duration: 2000,
                    icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                    style: { backgroundColor: colors.amber[500] }
                })
                return
            }

            if (!user || !user.access_token_prov) {
                console.log("Usuário não autenticado")
                return
            }

            try {
                const annotationUpdated = await update_Annotation({
                    access_token: user.access_token_prov,
                    annotationId: id,
                    dataNewAnnotation: {
                        newTitle: finalTitle.trim() ? finalTitle : "Sem título",
                        newAnnotation: finalAnnotation,
                        newCategoriaId: finalCategoriaId?.id
                    }
                })
                if (annotationUpdated?.success) {
                    console.log(annotationUpdated)
                    toast.show(annotationUpdated.message, {
                        type: 'success',
                        placement: "top",
                        duration: 2000,
                        icon: <FontAwesome6 name="check-circle" size={20} color="#4CAF50" />
                    });
                }
            } catch (err: any) {
                console.log(err.message)
                toast.show(err.message.includes("Campos obrigatórios não recebidos.") && "Por favor preencha o título e a anotação.", {
                    type: 'danger',
                    placement: "top",
                    duration: 3000,
                    dangerIcon: err.message.includes("Campos obrigatórios não recebidos.") 
                        ? <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />
                        : <FontAwesome6 name="triangle-exclamation" size={20} color="#F44336" />,
                    style: err.message.includes("Campos obrigatórios não recebidos.") 
                        ? { backgroundColor: colors.amber[500] }
                        : { backgroundColor: colors.red[500] }

                });
            } 
        } else {
            if (!finalAnnotation?.trim()) {
                toast.show("A anotação é obrigatória", {
                    type: 'danger',
                    placement: "top",
                    duration: 2000,
                    icon: <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />,
                    style: { backgroundColor: colors.amber[500] }
                })
                return
            }
            if (!user || !user.access_token_prov) {
                console.log("Usuário não autenticado")
                return
            }

            try {
                const annotationCreated = await create_Annotation({
                    access_token: user.access_token_prov,
                    data: {
                        title: finalTitle.trim() ? finalTitle : "Sem título",
                        annotation: finalAnnotation,
                        categoriaId: finalCategoriaId?.id
                    }
                })
                if (annotationCreated?.success) {
                    console.log(annotationCreated)
                    toast.show(annotationCreated.message, {
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
                    dangerIcon: err.message.includes("O Título e a anotação deve ter sido escritos para salvar anotação.") 
                        ? <FontAwesome6 name="circle-exclamation" size={20} color="#FFC107" />
                        : <FontAwesome6 name="triangle-exclamation" size={20} color="#F44336" />,
                    style: err.message.includes("O Título e a anotação deve ter sido escritos para salvar anotação.") 
                        ? { backgroundColor: colors.amber[500] }
                        : { backgroundColor: colors.red[500] }

                });
            } 
        }
    };
    
    const fetchCategories = useCallback(async (currentCategories: CategoryPropsItem[] = []) => {
        if (!user || !user.access_token_prov) return [];

        const netState = await NetInfo.fetch();
        const isConnected = netState.isConnected;

        if (!isConnected) {
            const localCategories = await getCategoriesToSync();
            return [...localCategories, { id: "ADD_CATEGORY", nome: "+" }];
        }
        
        try {
            const localCategories = await getCategoriesToSync();
            let categoriesToDisplay: CategoryPropsItem[] = [];

            if (localCategories.length > 0) {
                const res = await category_Create(user.access_token_prov, localCategories);

                if (res?.message) {
                    await invalidateCategoriesStorage();
                }
            }
            
            const resList = await categories_List(user.access_token_prov);
            if (resList?.categories) {
                categoriesToDisplay = resList.categories;
            } else {
                categoriesToDisplay = localCategories;
            }
            
            return [...categoriesToDisplay, { id: "ADD_CATEGORY", nome: "+" }];
        } catch (err: any) {
            console.log("Erro ao sincronizar/buscar categorias:", err);
            return currentCategories; 
        }
    }, [user?.access_token_prov]);

    async function handle_CreateCategory(name: string) {
        if (!user || !user.access_token_prov) {
            return;
        }
        try {
            const res = await category_Create(user.access_token_prov,
                                        [{ id: "TEMP_ID", nome: name }]); 
            if(res?.message) {
                const updatedList = await fetchCategories();
                setCategories(updatedList);
                ChangeModalVisibilityCategory();
            }
        } catch(err: any) {
            console.error("Erro ao criar categoria:", err.message);
        }
    }

    useEffect(() => {
        textNoteRef.current = annotationText
        textTitleNoteRed.current = titleText
        categoriaIdRef.current = selectedCategory

    }, [annotationText, titleText, selectedCategory])


    useEffect(() => {
        const initialTitle = title as string || '';
        const initialAnnotation = annotation as string || '';

        setTitleText(initialTitle);
        setAnnotationText(initialAnnotation);
        
        let initialCategories: CategoryPropsItem[] = [];
        if (categoriesParams) {
            try {
                initialCategories = JSON.parse(categoriesParams);
            } catch (e) {
                console.error("Erro ao parsear categoriesParams:", e);
            }
        }

        async function loadAndSelectCategories() {
            let finalCategories: CategoryPropsItem[] = [];

            if (!categoriesParams) {
                finalCategories = await fetchCategories(initialCategories);
            } else {
                finalCategories = initialCategories;
            }
            
            setCategories(finalCategories); 

            let initialCategory: CategoryPropsItem | undefined;
            if (categoriaId) {
                initialCategory = finalCategories.find(cat => cat.id === categoriaId);
            }
            
            setSelectCategory(initialCategory);

            initialRef.current = {
                title: initialTitle,
                annotation: initialAnnotation,
                categoriaId: categoriaId
            };
        }

        loadAndSelectCategories();
        
        const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', async (e) => {
            await sendToApi();
        });
        const unsubscribeBlur = navigation.addListener('blur', async () => {
            await sendToApi(); 
        });

        return () => {
            unsubscribeBeforeRemove();
            unsubscribeBlur(); 
        };
    }, [navigation, id, title, annotation, categoriaId, categoriesParams, user?.access_token_prov, fetchCategories]);

    function handleInputChange (text: string, isTitle: boolean) {
        if (isTitle) {
            setTitleText(text);
        } else {
            setAnnotationText(text);
        }
        setSaveStatus('saving');
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setSaveStatus('saved');
        }, 2000);
    };

    function ChangeModalVisibilityCategory() {
        setModalVisibilityCategory(prev => !prev)
    }

    const KEYBOARD_OFFSET = 64;

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1, backgroundColor: colors.gray[950] }}
                keyboardVerticalOffset={KEYBOARD_OFFSET}
            >
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}    
                >
                    <View style={styles.statusContainer}>
                        <CreateCategoryModal 
                            modalVisible={modalVisibilityCategory}
                            toggleModal={ChangeModalVisibilityCategory}
                            onCategoryName={handle_CreateCategory}
                        />
                        <Text style={[styles.statusText,
                            saveStatus === "saving" && { opacity: 0.7 }
                        ]}>
                            {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'saved' ? 'Salvo' : ''}
                        </Text>
                    </View>
                    <TextInput style={[styles.title,
                        focusTitle && {         
                            backgroundColor: colors.gray[950],
                            borderRadius: 10,
                            color: colors.gray[50],
                            paddingLeft: "3%",
                            borderBottomWidth: 0.5,
                            borderBottomColor: colors.gray[500],
                        },
                        titleText && { color: colors.gray[100] }
                    ]}  
                        onFocus={() => setFocusTitle(true)}
                        onBlur={() => setFocusTitle(false)}
                        placeholder='Sem título'
                        value={titleText}
                        onChangeText={(t) => handleInputChange(t, true)}
                        multiline
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input} 
                            placeholder='Comece a escrever...'
                            placeholderTextColor={colors.gray[500]}
                            underlineColorAndroid="transparent"
                            value={annotationText}
                            onChangeText={(t) => handleInputChange(t, false)}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>
                <View style={styles.carrousselCategories}>
                    <Categories
                        data={categories}
                        selectedCategory={selectedCategory}
                        setSelectCategory={setSelectCategory}
                        onCreateCategory={ChangeModalVisibilityCategory}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    )
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        height: "100%",
        backgroundColor: colors.gray[950] 
    },
    content: {
        flex: 1,
        flexDirection: "column",
        height: "100%",
        backgroundColor: colors.gray[950],
        paddingHorizontal: "2%",
        paddingTop: "1%",
        gap: 5
    },
    statusContainer: {
        alignItems: 'flex-end', 
        paddingRight: "4%",     
        marginBottom: "2%",      
    },
    statusText: {
        color: colors.green[300],
        fontSize: 12,
        opacity: 1
    },
    title: {
        paddingLeft: "4%",
        marginHorizontal: "2%",
        marginBottom: "8%",
        fontSize: 17,
        fontWeight: "600",
        borderRadius: 10,
        color: colors.gray[100],
        backgroundColor: colors.gray[900]
    },
    inputContainer: {
        flex: 1,
        backgroundColor: colors.gray[950]
    },
    input: {
        fontSize: 15,
        paddingHorizontal: "3%",
        color: colors.gray[300],
        marginTop: "-2%",
        lineHeight: 26,
        minHeight: 104,
    },
    carrousselCategories: {
        width: "100%",
        justifyContent: "flex-start",
        zIndex: 40,
        paddingVertical: "1.5%",
        marginBottom: "8%"
    }
})