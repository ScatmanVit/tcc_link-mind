import { Text, View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from "react-native";
import { ComponentProps, useState, useRef, useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { colors } from "@/styles/colors";

export type InputProps = TextInputProps & {
    placeholder?: string;
    size?: number,
    height?: number,
    label?: string,
    error?: boolean,
    icon?: ComponentProps<typeof FontAwesome6>["name"],
    iconColor?: string,
    radius?: number,
    secureTextEntry?: boolean,
};


export default function Input({
    placeholder,
    height,
    radius,
    error,
    label,
    size = 16,
    icon,
    iconColor = colors.gray[100],
    secureTextEntry = false,
    ...rest
}: InputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false)
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        setHasError(error ?? false);
    }, [error]);

    function toggleShowPassword() {
        setShowPassword(prev => !prev);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    return (
        <View style={s.container}>
            {label && <Text style={[s.label, { fontSize: size }]}>{label}</Text>}

            <View
                style={[
                    s.inputWrapper,
                    { height: height, borderColor: hasError ? colors.red[500] : colors.gray[700], borderRadius: radius ? radius : 14 },
                ]}
            >
                {icon && (
                    <FontAwesome6
                        name={icon}
                        size={size}
                        color={iconColor}
                        style={s.icon}
                    />
                )}

                <TextInput
                    ref={inputRef}
                    style={[s.input, { fontSize: size, outline: "none" }]}
                    placeholder={placeholder}
                    underlineColorAndroid="transparent"
                    selectionColor={colors.green[200]}
                    secureTextEntry={secureTextEntry && !showPassword}
                    {...rest}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={toggleShowPassword}
                        style={s.eyeButton}
                        activeOpacity={0.7}
                    >
                        <FontAwesome6
                            name={showPassword ? "eye" : "eye-slash"}
                            size={size}
                            color={colors.gray[300]}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        gap: 6,
        width: "100%",
    },
    label: {
        fontSize: 22,
        color: colors.gray[200],
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.gray[800],
        borderRadius: 14,
        paddingHorizontal: 12,
        borderWidth: 0.4,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: colors.gray[100],
        backgroundColor: "transparent",
        paddingVertical: 9,
        borderWidth: 0,

    },
    eyeButton: {
        marginLeft: 8,
    },
});
