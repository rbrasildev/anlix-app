import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export default function Button({ title, ...rest }: ButtonProps) {
    return <TouchableOpacity
        style={{
            padding: 20,
            backgroundColor: '#4CB752',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
            ...rest
        }}><Text>{title}</Text></TouchableOpacity>
}