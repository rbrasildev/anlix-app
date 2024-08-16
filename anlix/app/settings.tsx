import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, useColorScheme, ScrollView, Alert } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useState } from "react";

import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface AuthProps {
    url_sgp: string;
    urlAnlix: string;
    username: string;
    passwrod: string;
}

export default function Settings() {

    const [url_sgp, setUrlSgp] = useState('');
    const [url_anlix, setUrlAnlix] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSaveData = async () => {
        const newData = {
            url_sgp,
            url_anlix,
            username,
            password
        }

        await AsyncStorage.setItem('@anlix:auth', JSON.stringify(newData))

        Toast.show({
            type: "success",
            text1: "Configuração realizada som sucesso!"
        })
        
    }

    async function removeConfig() {
        AsyncStorage.removeItem('@anlix:auth');

        Toast.show({
            type: 'success',
            text1: 'Configuração removida com sucesso!'
        })

    }



    return (
        <KeyboardAvoidingView behavior="position" style={{ ...theme, flex: 1, padding: 15 }}>
            <ScrollView>
                <View style={{ padding: 15, borderRadius: 15, }}>
                    <View style={{ ...theme, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 22, ...theme, backgroundColor: 'transparent' }}>Dados do SGP</Text>
                        <TouchableOpacity onPress={() => removeConfig()} style={{ ...theme, borderRadius: 10, padding: 10, flexDirection: 'row', borderWidth: 1, gap: 4, alignItems: 'center' }}>
                            <Text style={{ ...theme, borderRadius: 10 }}>Limpar</Text>
                            <MaterialIcons name="auto-delete" size={22} color={'#4CB752'} />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ ...theme, backgroundColor: 'transparent' }}>Digite a url do SGP</Text>
                    <TextInput
                        value={url_sgp}
                        onChangeText={setUrlSgp}
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
                            onChangeText={setUrlAnlix}
                            value={url_anlix}
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
                            onChangeText={setUsername}
                            value={username}
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
                            onChangeText={setPassword}
                            value={password}
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
                    onPress={() => handleSaveData()}
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
            </ScrollView>
            <Toast />
        </KeyboardAvoidingView>
    )
}

