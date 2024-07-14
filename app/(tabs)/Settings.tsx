import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';


const Settings = () => {
    const [url, setUrl] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const scheme = useColorScheme();

    const lightTheme = {
        textColor: '#000',
        color: '#141414',
        borderColor: '#333',
    };

    const darkTheme = {
        textColor: '#ccc',
        color: '#fff',
        borderColor: '#222',
        buttonTextColor: '#fff',

    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;


    const saveCredentials = async () => {
        try {
            await AsyncStorage.setItem('url', url);
            await AsyncStorage.setItem('login', login);
            await AsyncStorage.setItem('senha', senha);
            Alert.alert('Credenciais salvas com sucesso!');
        } catch (error) {
            Alert.alert('Erro ao salvar credenciais');
        }
    };

    const getCredentials = async () => {
        try {
            const storedUrl = await AsyncStorage.getItem('url');
            const storedLogin = await AsyncStorage.getItem('login');
            const storedSenha = await AsyncStorage.getItem('senha');

            if (storedUrl !== null && storedLogin !== null && storedSenha !== null) {
                setUrl(storedUrl);
                setLogin(storedLogin);
                setSenha(storedSenha);
            }
        } catch (error) {
            Alert.alert('Erro ao recuperar credenciais');
        }
    };

    const removeCredentials = async () => {
        try {
            await AsyncStorage.removeItem('url');
            await AsyncStorage.removeItem('login');
            await AsyncStorage.removeItem('senha');
            setUrl('');
            setLogin('');
            setSenha('');
            Alert.alert('Credenciais removidas com sucesso!');
        } catch (error) {
            Alert.alert('Erro ao remover credenciais');
        }
    };

    useEffect(() => {
        getCredentials();
    }, []);

    console.log(url, login, senha)
    return (
        <SafeAreaView style={{ padding: 20 }}>
            <Text style={{ ...theme }}>URL:</Text>
            <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder='Digite url api anlix'
                style={{
                    ...theme,
                    padding: 15,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 20,
                    backgroundColor: '#ccc'
                }} />

            <Text style={{ ...theme }}>Login:</Text>

            <TextInput
                value={login}
                onChangeText={setLogin}
                placeholder='Digite usuário api anlix'
                style={{
                    ...theme,
                    padding: 15,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    paddingLeft: 20,
                    fontSize: 20,
                    color: '#666',
                    backgroundColor: '#ccc'
                }} />

            <Text style={{ ...theme }}>Senha:</Text>

            <TextInput
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
                placeholder='Digite a senha api anlix'
                style={{
                    ...theme,
                    padding: 15,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingLeft: 20,
                    fontSize: 20,
                    color: '#666',
                    backgroundColor: '#ccc'
                }} />
            <View style={{ gap: 2 }}>

                <TouchableOpacity style={{
                    ...theme,
                    padding: 15,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginHorizontal: 15,
                    backgroundColor: '#666'
                }} onPress={saveCredentials} ><Text>Salvar</Text></TouchableOpacity>

                <TouchableOpacity style={{
                    padding: 15,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginHorizontal: 15,
                    backgroundColor: 'red'
                }} onPress={removeCredentials} ><Text>Remover</Text></TouchableOpacity>
            </View>
        </SafeAreaView >
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#131314',
    },

    title: {
        fontSize: 20,
        color: '#eeee',
        alignItems: "center",
        justifyContent: "center",
        margin: 6
    },

    subTitle: {
        fontSize: 18,
        color: '#fff',
        margin: 5.4,
        fontWeight: 'bold'
    },


    card: {
        padding: 20,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: '#1e1f20',
        borderRadius: 10,
        color: '#FFF',
        fontSize: 30,
        width: "90%"

    },


    online: {
        color: '#4CAF50',
        marginRight: 20,
        width: 20,
        height: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
    },
    offline: {
        color: 'red',
        marginRight: 20,
        width: 20,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 20,
    },
    button: {
        backgroundColor: '#F55265',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        marginHorizontal: 15,
    },
    input: {
        backgroundColor: '#141414',
        elevation: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        fontSize: 20,
        color: '#666',
    },

});