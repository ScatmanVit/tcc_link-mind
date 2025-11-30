import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { colors } from '@/styles/colors'; 

type ButtonToggleProps = {
    isEnabled: boolean;
    onToggle: () => void;
};

export default function ButtonToggle({ isEnabled, onToggle }: ButtonToggleProps) {
    return (
        <View style={notificationToggleStyles.container}>
                <Switch
                    trackColor={{ 
                        false: colors.gray[600], 
                        true: colors.green[300] 
                    }}
                    thumbColor={isEnabled ? colors.gray[50] : colors.gray[400]}
                    ios_backgroundColor={colors.gray[400]}
                    onValueChange={onToggle}
                    value={isEnabled}
                    style={notificationToggleStyles.switch}
                />
        </View>
    );
}

const notificationToggleStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: 4
    },
    switch: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
    },
});