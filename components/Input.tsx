import { TextInput, TextInputProps } from "react-native";

export default function Input({ ...rest }: TextInputProps) {


    return <TextInput
        placeholderTextColor={'#666'}
        className="bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-500 text-zinc-800 text-xl rounded-2xl justify-center items-center py-5 px-6 font-semibold w-full"
        {...rest} />

}