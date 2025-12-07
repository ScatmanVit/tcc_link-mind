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
            <View style={styles.textContent}>
                <View style={[styles.line, styles.titleLine]} />
                <View style={[styles.line, styles.smallLine]} />
                <View style={[styles.line, styles.smallLine]} />
                <View style={[styles.line, styles.statusLine]} />
            </View>
            <View style={styles.rightContent}>
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
        backgroundColor: colors.gray[950], 
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 11, 
        marginTop: 12, 
    },
    textContent: {
        flex: 1,
        gap: 6, 
    },
    line: {
        height: 10,
        backgroundColor: colors.gray[800], 
        borderRadius: 4,
    },
    titleLine: {
        width: '80%',
        height: 14, 
        marginBottom: 4,
    },
    smallLine: {
        width: '60%',
    },
    statusLine: {
        width: '40%',
        marginTop: 4,
    },
    rightContent: {
        flexDirection: 'row',
        gap: 16,
        paddingLeft: 10,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.gray[800],
    },
});