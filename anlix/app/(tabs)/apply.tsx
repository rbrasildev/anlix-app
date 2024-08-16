import React, { useState } from "react";
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, useColorScheme } from "react-native";
import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";
import config from "../config";
import Toast from "react-native-toast-message";

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


    const getDataSgp = async () => {
        try {
            setIsLoading(true);


            const auth = await config();

            const response = await fetch(`${auth.url_sgp}/api.php?login=${pppoe}`).then((response) => response.json())


            if (pppoe === "") {
                Toast.show({
                    type: 'info',
                    text1: 'Este campo não pode ser vazio seu verme!'
                })
                setIsLoading(false);
                return;
            }

            if (!response.login) {
                Toast.show({
                    type: 'error',
                    text1: 'Cliente não encontrado'
                })
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
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro ao buscar os dados'
            })
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
