import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export default function Button({ title, ...rest }: ButtonProps) {
    return <TouchableOpacity
        className="className='dark:text-zinc-800 py-6 my-2 bg-lime-500 rounded-2xl w-full"
        {...rest}
    ><Text className="dark:text-white text-center">{title}</Text>
    </TouchableOpacity>
}