
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

type ButtonProps = {
   text: string,
   color?: string,
   colorBack?: string,
   onPress?: () => void
}

export default function ButtonApp({onPress, text, colorBack, color}: ButtonProps) {
   return (
      <TouchableOpacity style={[s.ButtonSend, 
            { backgroundColor: 
               colorBack ? colorBack 
                  : colors.green[300] }]} activeOpacity={0.1} onPress={onPress}>
         <Text style={[s.ButtonSendText, 
            { color: 
               color ? color
                  : colors.gray[950]
            }]}>
            {text}
         </Text>
      </TouchableOpacity>
   )
}

const s = StyleSheet.create({
   ButtonSend: {
       marginTop: 3,
       width: "100%",
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "center",
       borderColor: colors.gray[700],
       backgroundColor: colors.green[200],
       borderRadius: 14,
       paddingHorizontal: 12,
       paddingVertical: 12,
       borderWidth: 1,
     },
     ButtonSendText: {
       color: colors.gray[950],
       fontSize: 17,
       fontWeight: "700", 
     },
})