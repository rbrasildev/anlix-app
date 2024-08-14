import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native"
export default function Settings() {

    const scheme = useColorScheme();

    const lightTheme = {
        textColor: '#000',
        borderColor: '#ccc',
        color: '#333',
        backgroundColor: '#fff',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#87949D',
        borderColor: '#333',
        backgroundColor: '#141414'
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;
    return (
        <KeyboardAvoidingView behavior="position" style={{ padding: 15 }}>
            <View style={{  padding: 15, borderRadius: 15, }}>
                <Text style={{ fontSize: 22, ...theme, backgroundColor: 'transparent' }}>Dados do SGP</Text>
                <Text style={{ ...theme, backgroundColor: 'transparent' }}>Digite a url do SGP</Text>
                <TextInput
                    style={{
                        ...theme,
                        fontSize: 18,
                        padding: 10,
                        paddingHorizontal: 15,
                        borderWidth: 1,
                        borderRadius: 15,
                        marginTop: 10,
                    }}
                    placeholder="https://"
                    placeholderTextColor={'#666'}
                />
            </View>
            <View
                style={{
                    borderRadius: 15,
                    padding: 15,
                    marginVertical: 15
                }}>
                <View
                    style={{
                        ...theme,
                        borderWidth: 0.3
                    }}
                />
                <View style={{ marginVertical: 15 }}>
                    <Text style={{ fontSize: 22, ...theme, marginBottom: 15, backgroundColor: 'transparent' }}>Dados do Flashman</Text>
                    <Text style={{ ...theme, backgroundColor: 'transparent' }}>Digite a url do ANLIX</Text>
                    <TextInput
                        style={{
                            ...theme,
                            fontSize: 18,
                            padding: 10,
                            paddingHorizontal: 15,
                            borderWidth: 1,
                            borderRadius: 15,
                            marginTop: 10,
                        }}
                        placeholder="https://"
                        placeholderTextColor={'#666'}
                    />
                </View>
                <View>
                    <Text style={{ ...theme, backgroundColor: 'transparent' }}>Username</Text>
                    <TextInput
                        style={{
                            ...theme,
                            fontSize: 18,
                            padding: 10,
                            paddingHorizontal: 15,
                            borderWidth: 1,
                            borderRadius: 15,
                            marginTop: 10,
                        }}
                        placeholder="Digite usuário"
                        placeholderTextColor={'#666'}
                    />
                </View>
                <View style={{ marginVertical: 15 }}>
                    <Text style={{ ...theme, backgroundColor: 'transparent' }}>Password</Text>
                    <TextInput
                        style={{
                            ...theme,
                            fontSize: 18,
                            padding: 10,
                            paddingHorizontal: 15,
                            borderWidth: 1,
                            borderRadius: 15,
                            marginTop: 10,
                        }}
                        placeholder="Digite a senha"
                        placeholderTextColor={'#666'}
                        secureTextEntry={true}
                    />
                </View>
            </View>
            <TouchableOpacity
                style={{
                    ...theme,
                    paddingVertical: 15,
                    borderRadius: 15,
                    borderWidth: 0.5,
                    backgroundColor: '#4CB752',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text style={{ fontSize: 18, backgroundColor: 'transparent', fontWeight: '500' }}>Salvar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

