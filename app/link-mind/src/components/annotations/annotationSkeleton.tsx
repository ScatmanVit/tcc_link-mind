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

export default function AnotacaoSkeleton() {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyles]}>
            
            <View style={styles.leadingIconSkeleton} />

            <View style={styles.textContent}>
                <View style={[styles.line, styles.titleLine]} />
                <View style={[styles.line, styles.previewLine]} />
                <View style={[styles.line, styles.previewLineShort]} />
            </View>

            <View style={styles.rightContent}>
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
        backgroundColor: colors.gray[950],
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 12,
        marginHorizontal: 1,
        marginBottom: 10,
        shadowColor: colors.gray[700],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leadingIconSkeleton: {
        width: 22,
        height: 22,
        borderRadius: 4,
        backgroundColor: colors.gray[800],
        marginRight: 15,
    },
    textContent: {
        flex: 1,
        gap: 6,
        paddingRight: 10,
    },
    line: {
        height: 10,
        backgroundColor: colors.gray[800],
        borderRadius: 4,
    },
    titleLine: {
        width: '60%',
        height: 18,
        marginBottom: 2,
    },
    previewLine: {
        width: '90%',
        height: 14,
    },
    previewLineShort: {
        width: '70%',
        height: 14,
    },
    rightContent: {
        paddingLeft: 10,
        justifyContent: 'center',
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.gray[800],
    },
});