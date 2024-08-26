import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, useColorScheme } from "react-native";
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";

import Toast from "react-native-toast-message";
import Input from "@/components/Input";
import getSgpData from "../services/getSgpData";


export default function Apply() {
    const [pppoe, setPppoe] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()
    const scheme = useColorScheme();

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


    async function handleDataSgp() {
        setIsLoading(true)
        try {

            const response = await getSgpData(pppoe)

            if (pppoe === "") {
                Toast.show({
                    type: 'info',
                    text1: 'Este campo não pode ser vazio seu verme!'
                })
                setIsLoading(false);
                return;
            }

            if (response.contratos == false) {
                Toast.show({
                    type: 'error',
                    text1: `Não conseguimos localizar esse cpf ${pppoe}`
                })
                setIsLoading(false);
                return;
            }

            console.log(response)

            router.push({
                pathname: "/Cliente",
                params: {
                    clienteId: response.contratos[0].clienteId,
                    contratoId: response.contratos[0].contratoId,
                    razaoSocial: response.contratos[0].razaoSocial,
                    servico_wifi_password: response.contratos[0].servico_wifi_password,
                    servico_wifi_password_5: response.contratos[0].servico_wifi_password_5,
                    servico_wifi_ssid: response.contratos[0].servico_wifi_ssid,
                    servico_wifi_ssid_5: response.contratos[0].servico_wifi_ssid_5,
                    servico_login: response.contratos[0].servico_login,
                    servico_senha: response.contratos[0].servico_senha
                }
            });

            setIsLoading(false);
        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: `Error${error}`
            })
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="position" enabled>
                <Text style={{ fontSize: 32, color: '#4CB752' }}>Anlix apply</Text>

                <Text style={{ fontSize: 20, color: theme.textColor, fontWeight: 'bold', marginTop: 10 }}>CPF/CNPJ</Text>
                <Input
                    placeholderTextColor="#87949D"
                    placeholder="Digite CPF do cliente"
                    value={pppoe}
                    onChangeText={setPppoe}
                    autoCapitalize={"none"}
                />

                <TouchableOpacity style={styles.button} onPress={handleDataSgp}>
                    <Text style={{ fontSize: 20, fontWeight: 'medium' }}>Enviar</Text>
                    <View style={{ width: 32 }}>
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
