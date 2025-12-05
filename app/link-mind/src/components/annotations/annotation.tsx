import { StyleSheet, Text, Pressable, View } from 'react-native';
import { FontAwesome6, Feather } from '@expo/vector-icons';
import { colors } from '@/styles/colors'; 

export type AnnotationPropsItem = {
    title: string;
    annotation: string;
    onOpenDetails: () => void; 
    onDelete: () => void;
    modalOptionsVisibilityViewAnnotation: () => void;
};

export type AnnotationProps = {
    id: string
    title: string,
    annotation: string,
    categoriaId?: string
}

const MAX_PREVIEW_LENGTH = 120; 

export default function Anotacao({
    title,
    annotation,
    onOpenDetails,
    modalOptionsVisibilityViewAnnotation,
    onDelete,
}: AnnotationPropsItem) {

    const annotationPreview = annotation.length > MAX_PREVIEW_LENGTH
        ? annotation.substring(0, MAX_PREVIEW_LENGTH) + '...'
        : annotation;

    return (
        <Pressable
            onPress={modalOptionsVisibilityViewAnnotation} 
            onLongPress={onOpenDetails}
            delayLongPress={300}
            style={({ pressed }) => [
                style.container,
                pressed && { backgroundColor: colors.gray[800] } 
            ]}
        >
            <Feather 
                name="file-text" 
                size={22} 
                color={colors.green[300]} 
                style={style.leadingIcon} 
            />

            <View style={style.text_content}>
                <Text style={style.title} numberOfLines={1}>
                    {title}
                </Text>
                
                <Text style={style.annotationPreview} numberOfLines={2}>
                    {annotationPreview}
                </Text>
            </View>

            <View style={style.right_content}>
                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    style={({ pressed }) => ([
                        style.deleteButton,
                        { opacity: pressed ? 0.6 : 1 }
                    ])}
                >
                    <FontAwesome6
                        name="trash"
                        size={16}
                        color={colors.gray[500]} 
                    />
                </Pressable>
            </View>
        </Pressable>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[950], 
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 12,
        marginHorizontal: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leadingIcon: {
        marginRight: 15,
    },
    text_content: {
        flex: 1,
        gap: 4,
        paddingRight: 4,
    },
    title: {
        color: colors.gray[50],
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    annotationPreview: {
        color: colors.gray[400],
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
    },
    right_content: {
        paddingLeft: 5,
        justifyContent: 'center',
    },
    deleteButton: {
        paddingHorizontal: 3,
    },
});