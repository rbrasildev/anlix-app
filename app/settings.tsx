import { KeyboardAvoidingView, Text, TouchableOpacity, View, useColorScheme, ScrollView, Alert } from "react-native"

import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Input from "@/components/Input";


interface AuthProps {
    url_sgp: string;
    app: string;
    token: string;
    url_anlix: string;
    username: string;
    password: string;
}

interface DeviceProps {
    use_tr069: boolean
    model: string;
    status: number;
    message: string;
}

export default function Settings() {

    const [url_sgp, setUrlSgp] = useState('');
    const [url_anlix, setUrlAnlix] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [app, setApp] = useState('');
    const [token, setToken] = useState('');

    const { getItem, setItem, removeItem } = useAsyncStorage('@anlix:auth')

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
            password,
            app,
            token
        }

        const response: DeviceProps[] = await fetch(`${url_anlix}/api/v2/device/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            },
            body: JSON.stringify({ "fields": "model,use_tr069" })
        }).then((response) => response.json())


        if (response.status == 404) {
            Toast.show({
                type: "error",
                text1: "Falha ao conectar com servidor, verifique os dados"
            })
            return;
        }

        if (response.status == 401) {
            Toast.show({
                type: "error",
                text1: response.message
            })
            return;
        }



        await setItem(JSON.stringify(newData))

        Toast.show({
            type: "success",
            text1: "Configuração foi realizada com sucesso!"
        })

        router.push('/')

    }


    async function removeConfig() {
        setUrlSgp('')
        setUrlAnlix('')
        setUsername('')
        setPassword('')
        setApp('')
        setToken('')

        removeItem()

        Toast.show({
            type: 'success',
            text1: 'Configuração removida com sucesso!'
        })

    }

    async function anlixFetchData() {
        const response = await getItem();

        const data: AuthProps = response ? JSON.parse(response) : [];

        setUrlSgp(data.url_sgp)
        setApp(data.app)
        setToken(data.token)
        setUrlAnlix(data.url_anlix)
        setUsername(data.username)
        setPassword(data.password)
    }

    useEffect(() => {
        anlixFetchData()
    }, [])



    return (
        <KeyboardAvoidingView behavior="position" style={{ ...theme, flex: 1, padding: 15 }}>
            <ScrollView>
                <View style={{ borderRadius: 15, marginTop: 60 }}>
                    <View style={{ ...theme, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 22, color: theme.color }}>Dados do SGP</Text>
                        <TouchableOpacity onPress={() => removeConfig()} style={{ ...theme, borderRadius: 10, padding: 10, flexDirection: 'row', borderWidth: 1, gap: 4, alignItems: 'center' }}>
                            <Text style={{ ...theme, borderRadius: 10 }}>Limpar</Text>
                            <MaterialIcons name="auto-delete" size={22} color={'#4CB752'} />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ color: theme.color }}>Digite a url do SGP</Text>
                    <Input
                        value={url_sgp}
                        onChangeText={setUrlSgp}
                        placeholder="https://"
                        placeholderTextColor={'#666'}
                    />
                    <Text style={{ color: theme.color }}>App</Text>
                    <Input
                        value={app}
                        onChangeText={setApp}
                        placeholder="app"
                        placeholderTextColor={'#666'}
                    />
                    <Text style={{ color: theme.color }}>Token</Text>
                    <Input
                        value={token}
                        onChangeText={setToken}
                        placeholder="token"
                        placeholderTextColor={'#666'}
                        secureTextEntry
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
                        <Text style={{ fontSize: 22, marginBottom: 15, color: theme.color }}>Dados do Flashman</Text>
                        <Text style={{ color: theme.color }}>Digite a url do ANLIX</Text>
                        <Input
                            onChangeText={setUrlAnlix}
                            value={url_anlix}
                            placeholder="https://"
                            placeholderTextColor={'#666'}
                        />

                    </View>
                    <View>
                        <Text style={{ color: theme.color }}>Username</Text>
                        <Input
                            onChangeText={setUsername}
                            value={username}
                            placeholder="Digite usuário"
                            placeholderTextColor={'#666'}
                        />
                    </View>
                    <View style={{ marginVertical: 15 }}>
                        <Text style={{ color: theme.color }}>Password</Text>
                        <Input
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Digite a senha"
                            placeholderTextColor={'#666'}
                            secureTextEntry={true}
                        />
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
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast />
        </KeyboardAvoidingView>
    )
}

