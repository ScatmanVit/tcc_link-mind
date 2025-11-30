import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    useAnimatedStyle,
    Easing,
} from 'react-native-reanimated';
import { colors } from '@/styles/colors';

export default function EventSkeleton() {
    const opacity = useSharedValue(0.5); // Começa com opacidade média

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1, // -1 para repetir infinitamente
            true // Alterna a direção da animação (0.5 -> 1 -> 0.5 -> 1...)
        );
    }, []);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            <View style={styles.textContent}>
                {/* Linha para o título */}
                <View style={[styles.line, styles.titleLine]} />
                {/* Linhas para endereço e data */}
                <View style={[styles.line, styles.smallLine]} />
                <View style={[styles.line, styles.smallLine]} />
                {/* Linha para o status */}
                <View style={[styles.line, styles.statusLine]} />
            </View>
            <View style={styles.rightContent}>
                {/* Círculos para ícones à direita */}
                <View style={styles.circle} />
                <View style={styles.circle} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.gray[900], // Fundo do esqueleto
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 11, // Para alinhar com o Event
        marginTop: 12, // Espaçamento entre os esqueletos
    },
    textContent: {
        flex: 1,
        gap: 6, // Espaçamento entre as "linhas" de texto
    },
    line: {
        height: 10,
        backgroundColor: colors.gray[800], // Cor das "linhas" do texto
        borderRadius: 4,
    },
    titleLine: {
        width: '80%', // Título é mais longo
        height: 14, // Título é mais alto
        marginBottom: 4,
    },
    smallLine: {
        width: '60%', // Linhas menores
    },
    statusLine: {
        width: '40%', // Linha de status
        marginTop: 4,
    },
    rightContent: {
        flexDirection: 'row',
        gap: 16,
        paddingLeft: 10,
    },
    circle: {
        width: 20, // Tamanho dos "ícones" circulares
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.gray[800],
    },
});