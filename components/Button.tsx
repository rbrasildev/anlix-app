import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export default function Button({ ...rest }: TouchableOpacityProps) {
    return <TouchableOpacity style={{
        padding: 20,
        backgroundColor: '#4CB752',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    }} {...rest} />
}