import React, { useState } from "react";
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, useColorScheme } from "react-native";
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";
import { API_URL, API_USER, API_PASSWORD, API_SGP_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Apply() {
    const [pppoe, setPppoe] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const router = useRouter()
    const scheme = useColorScheme();

    const getCredentials = async () => {
        try {
            const storedUrl = await AsyncStorage.getItem('url');
            const storedLogin = await AsyncStorage.getItem('login');
            const storedSenha = await AsyncStorage.getItem('senha');
            if (storedUrl !== null && storedLogin !== null && storedSenha !== null) {
                setUrl(storedUrl);
                setLogin(storedLogin);
                setSenha(storedSenha);
            } else {
                router.push('Settings')
            }
        } catch (error) {
            Alert.alert('Erro ao recuperar credenciais');
        }
    };

    const lightTheme = {
        backgroundColor: '#fff',
        textColor: '#000',
        borderColor: '#ccc',
    };

    const darkTheme = {
        textColor: '#fff',
        color: '#87949D',
        borderColor: '#333',
    };

    const theme = scheme === 'light' ? lightTheme : darkTheme;

    const getDataSgp = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_SGP_URL}/api/api.php?login=${pppoe}`).then((response) => response.json())
            console.log(response)

            if (pppoe === "") {
                Alert.alert(
                    "Atenção",
                    "Este campo não pode ser vazio verme!",
                );
                setIsLoading(false);
                return;
            }

            if (!response.login) {
                Alert.alert(
                    "Falha ao buscar dados",
                    "Cliente não encontrado!",
                );
                setIsLoading(false);
                return;
            }

            router.push({
                pathname: "Cliente",
                params: { cpf: pppoe }
            });

            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Erro", "Ocorreu um erro ao buscar os dados.");
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="position" enabled>
                <Text style={{ fontSize: 32, color: '#4CB752' }}>Anlix apply</Text>

                <Text style={{ fontSize: 20, color: "#d0d0d0", fontWeight: 'bold' }}>PPPoE</Text>
                <TextInput
                    style={{
                        ...theme,
                        height: 60,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                        paddingLeft: 20,
                        fontSize: 20,
                        borderWidth: 1,
                    }}
                    placeholderTextColor="#87949D"
                    placeholder="Digite login pppoe"
                    value={pppoe}
                    onChangeText={setPppoe}
                    autoCapitalize={"none"}
                />
                <TouchableOpacity style={styles.button} onPress={getDataSgp}>
                    <Text style={{ fontSize: 20, fontWeight: 'medium' }}>Enviar</Text>
                    <View style={{ marginLeft: 10 }}>
                        {isLoading && <ActivityIndicator size="small" color="#fff" />}
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#131314',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#1E1F20',
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        fontSize: 20,
        color: '#87949D',
    },
    button: {
        backgroundColor: '#4CB752',
        height: 60,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        flexDirection: 'row',
        gap: 3,
    }
})
