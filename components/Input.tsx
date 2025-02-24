import { TextInput, TextInputProps } from "react-native";

export default function Input({ ...rest }: TextInputProps) {


    return <TextInput
        placeholderTextColor={'#666'}
        className="bg-white border-[0.5px] border-zinc-500 dark:bg-zinc-900 my-2 dark:text-zinc-500 text-zinc-800 text-xl rounded-2xl justify-center items-dcenter py-5 px-8 font-semibold w-full"
        {...rest} />

}