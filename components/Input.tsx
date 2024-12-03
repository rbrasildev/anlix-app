import { TextInput, TextInputProps, useColorScheme } from "react-native";

export default function Input({ ...rest }: TextInputProps) {
    const scheme = useColorScheme();


    const lightTheme = {
        textColor: '#000',
        color: '#141414',
        backgroundColor: '#fff',
        borderColor: '#ddd'
    };

    const darkTheme = {
        textColor: '#ccc',
        color: '#ccc',
        borderColor: '#222',
        backgroundColor: '#141414'
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;
    return <TextInput
        placeholderTextColor={'#666'}
        className=""
        style={{
            ...theme,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical:5,
            paddingHorizontal:15,
            padding:16,
            fontSize: 16,
            borderWidth: 1,
        }}  {...rest} />

}